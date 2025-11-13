
import React, { useState, useEffect } from 'react';
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

const ImagePlaceholderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);

const ImageWithFallback: React.FC<{src?: string, alt: string}> = ({ src, alt }) => {
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(false);
    }, [src]);

    if (!src || error) {
        return (
            <div className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-md text-slate-400 dark:text-slate-500">
                <ImagePlaceholderIcon className="w-6 h-6" />
            </div>
        );
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className="w-12 h-12 object-cover rounded-md bg-slate-200 dark:bg-slate-700"
            onError={() => setError(true)}
        />
    );
};

export const InventoryList: React.FC<InventoryListProps> = ({ items, onDeleteItem, isAdminMode }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">Tiada rekod lagi.</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">Sila tambah rekod baru menggunakan borang di atas.</p>
      </div>
    );
  }

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return `RM ${value.toFixed(2)}`;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-4 py-3 w-20 text-center">Imej</th>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">Vendor</th>
              <th scope="col" className="px-6 py-3 text-right">Harga Kos</th>
              <th scope="col" className="px-6 py-3 text-right">Harga Jual</th>
              <th scope="col" className="px-6 py-3 text-center">Stok</th>
              {isAdminMode && <th scope="col" className="px-4 py-3 text-center">Tindakan</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {items.map((item) => (
              <tr key={item.id} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 align-middle">
                <td className="px-4 py-2">
                  <div className="flex justify-center">
                    <ImageWithFallback src={item.imageUrl} alt={item.nama} />
                  </div>
                </td>
                <td scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  <div className="font-bold">{item.nama}</div>
                  {item.notes && <div className="text-xs text-slate-500 dark:text-slate-400" title={item.notes}>{item.notes}</div>}
                </td>
                <td className="px-6 py-4">{item.vendor}</td>
                <td className="px-6 py-4 text-right font-mono">{formatCurrency(item.hargaKos)}</td>
                <td className="px-6 py-4 text-right font-mono">{formatCurrency(item.hargaJual)}</td>
                <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 text-center text-base">{item.kuantitiStok}</td>
                {isAdminMode && (
                  <td className="px-4 py-2 text-center">
                    <button 
                      onClick={() => onDeleteItem(item.id)} 
                      className="p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                      aria-label={`Padam rekod ${item.nama}`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
