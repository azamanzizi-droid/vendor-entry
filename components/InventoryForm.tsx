import React, { useState } from 'react';
import type { InventoryItem } from '../types';

interface InventoryFormProps {
  onAddItem: (item: Omit<InventoryItem, 'id'>) => Promise<boolean>;
  vendors: string[];
  onAddVendor: (vendor: string) => void;
  isSubmitting: boolean;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({ onAddItem, vendors, onAddVendor, isSubmitting }) => {
  const [nama, setNama] = useState('');
  const [vendor, setVendor] = useState('');
  const [kuantitiStok, setKuantitiStok] = useState('');
  const [hargaKos, setHargaKos] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    nama: false,
    vendor: false,
    kuantitiStok: false,
  });

  const today = new Date().toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'ADD_NEW_VENDOR') {
      const newVendor = window.prompt('Masukkan nama vendor baru:');
      if (newVendor && newVendor.trim() !== '') {
        const trimmedVendor = newVendor.trim();
        onAddVendor(trimmedVendor);
        setVendor(trimmedVendor);
      } else {
        setVendor('');
      }
    } else {
      setVendor(selectedValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newFieldErrors = {
      nama: !nama.trim(),
      vendor: !vendor,
      kuantitiStok: !kuantitiStok.trim(),
    };

    setFieldErrors(newFieldErrors);

    if (newFieldErrors.nama || newFieldErrors.vendor || newFieldErrors.kuantitiStok) {
      setError('Sila isi semua medan yang diperlukan (Nama, Vendor, Kuantiti Stok).');
      return;
    }
    const kuantitiStokNum = parseInt(kuantitiStok, 10);
    if (isNaN(kuantitiStokNum) || kuantitiStokNum < 0) {
      setError('Kuantiti Stok mesti nombor 0 atau lebih.');
      setFieldErrors({ ...fieldErrors, kuantitiStok: true });
      return;
    }
    
    const hargaKosNum = hargaKos ? parseFloat(hargaKos) : undefined;
    if (hargaKos && (isNaN(hargaKosNum) || hargaKosNum < 0)) {
        setError('Harga Kos mesti nombor yang sah.');
        return;
    }
    
    const hargaJualNum = hargaJual ? parseFloat(hargaJual) : undefined;
    if (hargaJual && (isNaN(hargaJualNum) || hargaJualNum < 0)) {
        setError('Harga Jual mesti nombor yang sah.');
        return;
    }

    setError('');

    const success = await onAddItem({
      date: new Date().toISOString().split('T')[0],
      nama,
      vendor,
      kuantitiStok: kuantitiStokNum,
      hargaKos: hargaKosNum,
      hargaJual: hargaJualNum,
      imageUrl,
      notes,
    });

    if (success) {
      setNama('');
      setVendor('');
      setKuantitiStok('');
      setHargaKos('');
      setHargaJual('');
      setImageUrl('');
      setNotes('');
    }
  };
  
  const getInputBorderClasses = (hasError: boolean) => {
    const baseClasses = "w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-md shadow-sm disabled:opacity-50";
    if (hasError) {
      return `${baseClasses} border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500`;
    }
    return `${baseClasses} border-slate-300 dark:border-slate-600 focus:ring-teal-500 focus:border-teal-500`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={isSubmitting} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tarikh</label>
              <input
                id="date"
                type="text"
                value={today}
                disabled
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none text-slate-500 dark:text-slate-400"
              />
            </div>
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama <span className="text-red-500">*</span></label>
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Cth: Nasi Lemak Ayam"
                className={getInputBorderClasses(fieldErrors.nama)}
                aria-required="true"
                aria-invalid={fieldErrors.nama}
              />
            </div>
            <div>
              <label htmlFor="vendor" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vendor <span className="text-red-500">*</span></label>
              <select
                id="vendor"
                value={vendor}
                onChange={handleVendorChange}
                className={getInputBorderClasses(fieldErrors.vendor)}
                aria-label="Pilih Vendor"
                aria-required="true"
                aria-invalid={fieldErrors.vendor}
              >
                <option value="" disabled>-- Pilih Vendor --</option>
                {vendors.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
                <option value="ADD_NEW_VENDOR" className="font-bold text-teal-600 dark:text-teal-400 bg-slate-50 dark:bg-slate-700">
                  + Tambah Vendor Baru
                </option>
              </select>
            </div>
            <div>
              <label htmlFor="kuantitiStok" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kuantiti Stok <span className="text-red-500">*</span></label>
              <input
                id="kuantitiStok"
                type="number"
                value={kuantitiStok}
                onChange={(e) => setKuantitiStok(e.target.value)}
                placeholder="Cth: 20"
                min="0"
                className={getInputBorderClasses(fieldErrors.kuantitiStok)}
                aria-required="true"
                aria-invalid={fieldErrors.kuantitiStok}
              />
            </div>
            <div>
              <label htmlFor="hargaKos" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Harga Kos (RM)</label>
              <input
                id="hargaKos"
                type="number"
                step="0.01"
                min="0"
                value={hargaKos}
                onChange={(e) => setHargaKos(e.target.value)}
                placeholder="Cth: 2.50"
                className={getInputBorderClasses(false)}
              />
            </div>
             <div>
              <label htmlFor="hargaJual" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Harga Jual (RM)</label>
              <input
                id="hargaJual"
                type="number"
                step="0.01"
                min="0"
                value={hargaJual}
                onChange={(e) => setHargaJual(e.target.value)}
                placeholder="Cth: 4.00"
                className={getInputBorderClasses(false)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL Gambar (Pilihan)</label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={getInputBorderClasses(false)}
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nota (Pilihan)</label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cth: Sambal lebih pedas"
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50"
            ></textarea>
          </div>
        </fieldset>
        
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-900 transition-colors duration-200 disabled:bg-teal-400 dark:disabled:bg-teal-800 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Menyimpan...' : 'Tambah Rekod'}
          </button>
        </div>
      </form>
    </div>
  );
};
