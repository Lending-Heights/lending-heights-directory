import { LayoutGrid, Table } from 'lucide-react';

type ViewMode = 'gallery' | 'table';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex bg-lh-bg border-2 border-lh-border rounded-xl p-1 gap-1">
      <button
        onClick={() => onViewChange('gallery')}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-lg font-poppins font-semibold text-sm transition-all duration-300
          ${currentView === 'gallery' 
            ? 'bg-lh-blue text-white shadow-md' 
            : 'text-lh-secondary-text hover:text-lh-blue hover:bg-white'
          }
        `}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">Gallery</span>
      </button>
      
      <button
        onClick={() => onViewChange('table')}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-lg font-poppins font-semibold text-sm transition-all duration-300
          ${currentView === 'table' 
            ? 'bg-lh-blue text-white shadow-md' 
            : 'text-lh-secondary-text hover:text-lh-blue hover:bg-white'
          }
        `}
      >
        <Table className="w-4 h-4" />
        <span className="hidden sm:inline">Table</span>
      </button>
    </div>
  );
}
