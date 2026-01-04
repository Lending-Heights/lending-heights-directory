'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { importPipelineCSV, getImportStats } from '@/app/actions/import-csv';
import { EXCLUDED_COLUMNS } from '@/lib/config/csv-column-mapping';

interface ImportStatus {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
  details?: {
    totalRows?: number;
    importedRows?: number;
    updatedRows?: number;
    skippedRows?: number;
    errors?: string[];
  };
}

interface CSVUploadProps {
  onImportComplete?: () => void;
}

export function CSVUpload({ onImportComplete }: CSVUploadProps) {
  const [importStatus, setImportStatus] = useState<ImportStatus>({ status: 'idle' });
  const [isDragging, setIsDragging] = useState(false);
  const [stats, setStats] = useState<{
    totalLoans: number;
    lastImport: string | null;
    lastImportCount: number | null;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load stats on mount
  useState(() => {
    getImportStats().then(setStats);
  });

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setImportStatus({
        status: 'error',
        message: 'Please upload a CSV file',
      });
      return;
    }

    setImportStatus({ status: 'uploading', message: 'Reading file...' });

    try {
      const content = await file.text();

      setImportStatus({ status: 'processing', message: 'Processing data...' });

      const result = await importPipelineCSV(content);

      if (result.success) {
        setImportStatus({
          status: 'success',
          message: result.message,
          details: {
            totalRows: result.totalRows,
            importedRows: result.importedRows,
            updatedRows: result.updatedRows,
            skippedRows: result.skippedRows,
            errors: result.errors,
          },
        });

        // Refresh stats
        const newStats = await getImportStats();
        setStats(newStats);

        // Notify parent
        onImportComplete?.();
      } else {
        setImportStatus({
          status: 'error',
          message: result.message,
          details: {
            errors: result.errors,
          },
        });
      }
    } catch (error) {
      setImportStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to process file',
      });
    }
  }, [onImportComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [handleFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const resetStatus = useCallback(() => {
    setImportStatus({ status: 'idle' });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Pipeline Data
        </CardTitle>
        <CardDescription>
          Upload your ARIVE Pipeline Reports CSV to sync loan data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-muted-foreground">Total Loans</div>
              <div className="text-2xl font-semibold">{stats.totalLoans}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-muted-foreground">Last Import</div>
              <div className="text-lg font-medium">
                {stats.lastImport
                  ? new Date(stats.lastImport).toLocaleDateString()
                  : 'Never'}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-muted-foreground">Last Import Count</div>
              <div className="text-2xl font-semibold">
                {stats.lastImportCount ?? '-'}
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        {importStatus.status === 'idle' && (
          <>
            <div
              onClick={handleClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors duration-200
                ${isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-1">
                Drop your CSV file here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-400">
                    Privacy Protection
                  </p>
                  <p className="text-amber-700 dark:text-amber-500">
                    The following sensitive fields are automatically excluded from import:{' '}
                    <span className="font-mono text-xs">
                      {EXCLUDED_COLUMNS.join(', ')}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Processing State */}
        {(importStatus.status === 'uploading' || importStatus.status === 'processing') && (
          <div className="border rounded-lg p-8 text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
            <p className="text-lg font-medium">{importStatus.message}</p>
            <p className="text-sm text-muted-foreground mt-1">
              This may take a moment for large files...
            </p>
          </div>
        )}

        {/* Success State */}
        {importStatus.status === 'success' && (
          <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-green-800 dark:text-green-400">
                  {importStatus.message}
                </p>
                {importStatus.details && (
                  <div className="mt-3 grid grid-cols-4 gap-3 text-sm">
                    <div className="bg-white dark:bg-green-950/50 rounded p-2">
                      <div className="text-muted-foreground">Total Rows</div>
                      <div className="font-semibold">{importStatus.details.totalRows}</div>
                    </div>
                    <div className="bg-white dark:bg-green-950/50 rounded p-2">
                      <div className="text-muted-foreground">New</div>
                      <div className="font-semibold text-green-600">{importStatus.details.importedRows}</div>
                    </div>
                    <div className="bg-white dark:bg-green-950/50 rounded p-2">
                      <div className="text-muted-foreground">Updated</div>
                      <div className="font-semibold text-blue-600">{importStatus.details.updatedRows}</div>
                    </div>
                    <div className="bg-white dark:bg-green-950/50 rounded p-2">
                      <div className="text-muted-foreground">Skipped</div>
                      <div className="font-semibold text-amber-600">{importStatus.details.skippedRows}</div>
                    </div>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetStatus}
                  className="mt-4"
                >
                  Import Another File
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {importStatus.status === 'error' && (
          <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-red-800 dark:text-red-400">
                  {importStatus.message}
                </p>
                {importStatus.details?.errors && importStatus.details.errors.length > 0 && (
                  <ul className="mt-2 text-sm text-red-700 dark:text-red-400 list-disc list-inside">
                    {importStatus.details.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {importStatus.details.errors.length > 5 && (
                      <li>...and {importStatus.details.errors.length - 5} more errors</li>
                    )}
                  </ul>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetStatus}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
