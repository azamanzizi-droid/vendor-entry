
import React from 'react';
import type { InventoryItem } from '../types';

interface InventoryListProps {
  items: InventoryItem[];
  onDeleteItem: (id: string) => void;
  isAdminMode: boolean;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
    </svg>
);


export const InventoryList: React.FC<InventoryListProps> = ({ items, onDeleteItem, isAdminMode }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">Tiada rekod lagi.</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">Sila tambah rekod baru menggunakan borang di atas.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
  }

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return `RM ${value.toFixed(2)}`;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 transition-transform duration-200 hover:shadow-xl hover:-translate-y-1 relative group flex items-start space-x-4">
          {item.imageUrl && (
            <img 
              src={item.imageUrl} 
              alt={item.nama} 
              className="w-24 h-24 object-cover rounded-md flex-shrink-0 bg-slate-200 dark:bg-slate-700"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
          <div className="flex-grow">
            <div className="pr-20">
              <p className="font-bold text-lg text-teal-600 dark:text-teal-400 truncate" title={item.nama}>{item.nama}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">oleh <span className="font-medium text-slate-700 dark:text-slate-300">{item.vendor}</span></p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-3 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Stok</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-base">{item.kuantitiStok}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Harga Kos</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-base">{formatCurrency(item.hargaKos)}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Harga Jual</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-base">{formatCurrency(item.hargaJual)}</p>
              </div>
            </div>

            {item.notes && (
               <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                 <p className="text-sm text-slate-500 dark:text-slate-400">Nota</p>
                 <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm">{item.notes}</p>
              </div>
            )}
          </div>
          <div className="absolute top-3 right-3 text-xs text-slate-400 dark:text-slate-500">
            {formatDate(item.date)}
          </div>
          {isAdminMode && (
            <button 
                onClick={() => onDeleteItem(item.id)} 
                className="absolute bottom-3 right-3 p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Padam rekod"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};