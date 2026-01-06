'use server';

import { createClient } from '@/lib/supabase/server';
import {
  CSV_HEADER_TO_DB_COLUMN,
  convertValue,
  EXCLUDED_COLUMNS,
} from '@/lib/config/csv-column-mapping';

// ============================================================================
// TYPES
// ============================================================================

interface ImportResult {
  success: boolean;
  message: string;
  totalRows?: number;
  importedRows?: number;
  updatedRows?: number;
  skippedRows?: number;
  errors?: string[];
}

interface ParsedRow {
  [key: string]: unknown;
}

// ============================================================================
// CSV PARSING
// ============================================================================

/**
 * Parse CSV content into rows
 * Handles quoted fields with commas and newlines
 */
function parseCSV(content: string): { headers: string[]; rows: string[][] } {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  // Handle both \r\n and \n line endings
  const chars = content.replace(/\r\n/g, '\n').split('');

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (char === '"') {
      // Check for escaped quote
      if (inQuotes && chars[i + 1] === '"') {
        currentLine += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
        currentLine += char;
      }
    } else if (char === '\n' && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }

  // Don't forget the last line
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  // Parse each line into fields
  const parseRow = (line: string): string[] => {
    const fields: string[] = [];
    let currentField = '';
    let inFieldQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inFieldQuotes && line[i + 1] === '"') {
          currentField += '"';
          i++;
        } else {
          inFieldQuotes = !inFieldQuotes;
        }
      } else if (char === ',' && !inFieldQuotes) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }

    fields.push(currentField.trim());
    return fields;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(parseRow);

  return { headers, rows };
}

/**
 * Transform a CSV row into a database record
 */
function transformRow(
  headers: string[],
  values: string[],
  rowNumber: number
): { record: ParsedRow; warnings: string[] } {
  const record: ParsedRow = {
    csv_import_date: new Date().toISOString(),
    csv_row_number: rowNumber,
  };
  const warnings: string[] = [];

  headers.forEach((header, index) => {
    const value = values[index] || '';
    const mapping = CSV_HEADER_TO_DB_COLUMN.get(header);

    if (!mapping) {
      // Unknown column - store in raw_data if needed
      return;
    }

    if (mapping.exclude) {
      // Skip excluded columns (like SSN)
      return;
    }

    try {
      const convertedValue = convertValue(value, mapping.type);
      record[mapping.dbColumn] = convertedValue;
    } catch (err) {
      warnings.push(`Row ${rowNumber}: Failed to convert "${header}" value "${value}"`);
      record[mapping.dbColumn] = null;
    }
  });

  return { record, warnings };
}

// ============================================================================
// IMPORT FUNCTION
// ============================================================================

/**
 * Import CSV data into the loans table
 *
 * @param csvContent - Raw CSV file content as string
 * @returns Import result with statistics
 */
export async function importPipelineCSV(csvContent: string): Promise<ImportResult> {
  try {
    const supabase = await createClient();
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        message: 'Unauthorized',
        errors: ['You must be logged in to import data'],
      };
    }

    console.log('[CSV Import] Starting import...');

    // Parse CSV
    const { headers, rows } = parseCSV(csvContent);

    if (headers.length === 0) {
      return {
        success: false,
        message: 'Invalid CSV file',
        errors: ['CSV file appears to be empty or has no headers'],
      };
    }

    console.log(`[CSV Import] Found ${headers.length} columns, ${rows.length} rows`);

    // Check for required ARIVE Loan Id column
    const hasLoanId = headers.includes('ARIVE Loan Id');
    if (!hasLoanId) {
      return {
        success: false,
        message: 'Missing required column',
        errors: ['CSV must contain "ARIVE Loan Id" column for upsert matching'],
      };
    }

    // Log excluded columns for transparency
    const excludedFound = headers.filter(h => EXCLUDED_COLUMNS.includes(h));
    if (excludedFound.length > 0) {
      console.log(`[CSV Import] Excluding sensitive columns: ${excludedFound.join(', ')}`);
    }

    // Transform rows
    const records: ParsedRow[] = [];
    let skippedRows = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // +2 because row 1 is headers, array is 0-indexed

      // Skip rows without ARIVE Loan Id
      const loanIdIndex = headers.indexOf('ARIVE Loan Id');
      const loanId = row[loanIdIndex];

      if (!loanId || loanId.trim() === '') {
        skippedRows++;
        warnings.push(`Row ${rowNumber}: Skipped - missing ARIVE Loan Id`);
        continue;
      }

      const { record, warnings: rowWarnings } = transformRow(headers, row, rowNumber);
      warnings.push(...rowWarnings);
      records.push(record);
    }

    console.log(`[CSV Import] Transformed ${records.length} records, skipped ${skippedRows}`);

    if (records.length === 0) {
      return {
        success: false,
        message: 'No valid records to import',
        errors: ['All rows were skipped due to missing ARIVE Loan Id'],
        skippedRows,
      };
    }

    // Log sync start
    const { error: logStartError } = await supabase
      .from('sync_logs')
      .insert({
        status: 'running',
        sync_type: 'csv',
        records_fetched: records.length,
        records_upserted: 0,
      } as any);

    if (logStartError) {
      console.error('[CSV Import] Failed to log start:', logStartError);
    }

    // Upsert in batches of 50 to avoid timeouts
    const batchSize = 50;
    let importedRows = 0;
    let updatedRows = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(records.length / batchSize);

      console.log(`[CSV Import] Processing batch ${batchNumber}/${totalBatches}`);

      // Check which records already exist
      const loanIds = batch.map(r => r.arive_loan_id).filter(Boolean);
      const { data: existingLoans } = await supabase
        .from('loans')
        .select('arive_loan_id')
        .in('arive_loan_id', loanIds as string[]) as any;

      const existingIds = new Set((existingLoans as any[])?.map((l: any) => l.arive_loan_id) || []);

      // Upsert the batch
      // @ts-ignore - Supabase types don't know about new columns yet
      const { error: upsertError } = await (supabase
        .from('loans') as any)
        .upsert(batch, {
          onConflict: 'arive_loan_id',
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error(`[CSV Import] Batch ${batchNumber} error:`, upsertError);
        errors.push(`Batch ${batchNumber}: ${upsertError.message}`);
      } else {
        // Count new vs updated
        batch.forEach(record => {
          if (existingIds.has(record.arive_loan_id as string)) {
            updatedRows++;
          } else {
            importedRows++;
          }
        });
      }
    }

    // Log sync completion
    const { error: logCompleteError } = await supabase
      .from('sync_logs')
      .insert({
        status: errors.length > 0 ? 'completed' : 'completed',
        sync_type: 'csv',
        records_fetched: records.length,
        records_upserted: importedRows + updatedRows,
        error_message: errors.length > 0 ? errors.join('; ') : null,
      } as any);

    if (logCompleteError) {
      console.error('[CSV Import] Failed to log completion:', logCompleteError);
    }

    const totalProcessed = importedRows + updatedRows;
    const hasErrors = errors.length > 0;

    return {
      success: !hasErrors || totalProcessed > 0,
      message: hasErrors
        ? `Import completed with errors: ${totalProcessed} records processed`
        : `Successfully imported ${importedRows} new records and updated ${updatedRows} existing records`,
      totalRows: rows.length,
      importedRows,
      updatedRows,
      skippedRows,
      errors: errors.length > 0 ? errors : undefined,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[CSV Import] Fatal error:', error);

    // Try to log sync failure (may fail if supabase client failed to initialize)
    try {
      const supabaseForLog = await createClient();
      await supabaseForLog
        .from('sync_logs')
        .insert({
          status: 'failed',
          sync_type: 'csv',
          records_fetched: 0,
          records_upserted: 0,
          error_message: errorMessage,
        } as any);
    } catch (logError) {
      console.error('[CSV Import] Failed to log error:', logError);
    }

    return {
      success: false,
      message: 'Import failed',
      errors: [errorMessage],
    };
  }
}

/**
 * Get import statistics
 */
export async function getImportStats(): Promise<{
  totalLoans: number;
  lastImport: string | null;
  lastImportCount: number | null;
}> {
  const supabase = await createClient();

  // Get total loan count
  const { count: totalLoans } = await supabase
    .from('loans')
    .select('*', { count: 'exact', head: true });

  // Get last CSV import
  const { data: lastSync } = await supabase
    .from('sync_logs')
    .select('created_at, records_upserted')
    .eq('sync_type', 'csv')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(1)
    .single() as any;

  return {
    totalLoans: totalLoans || 0,
    lastImport: (lastSync as any)?.created_at || null,
    lastImportCount: (lastSync as any)?.records_upserted || null,
  };
}
