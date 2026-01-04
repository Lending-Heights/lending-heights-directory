'use client';

import { useRouter } from 'next/navigation';
import { CSVUpload } from '@/components/closings/CSVUpload';

export function CSVUploadWrapper() {
  const router = useRouter();

  const handleImportComplete = () => {
    // Refresh the page to show new data
    router.refresh();
  };

  return <CSVUpload onImportComplete={handleImportComplete} />;
}
