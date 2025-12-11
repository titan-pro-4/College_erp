import React from 'react';
import { X, Download, Filter, Search } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onExport?: () => void;
  showFilter?: boolean;
  showSearch?: boolean;
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onExport,
  showFilter = false,
  showSearch = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                {subtitle && <p className="text-sm opacity-90 mt-1">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Action Bar */}
            {(showFilter || showSearch || onExport) && (
              <div className="flex items-center gap-3 mt-4">
                {showSearch && (
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                )}
                
                {showFilter && (
                  <button className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-colors flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filter</span>
                  </button>
                )}
                
                {onExport && (
                  <button 
                    onClick={onExport}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Export</span>
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
