import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
  currentUrl: string;
  onPinChange: () => void;
  isAdminMode: boolean;
  onSetIsAdminMode: (isAdmin: boolean) => void;
}

const appsScriptCode = `const SHEET_NAME = 'Inventori';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(\`Sheet "\${SHEET_NAME}" not found.\`);
    }
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // The order of data here must match the order in your sheet's columns
    const newRow = [
      data.date,
      data.nama,
      data.vendor,
      data.imageUrl,
      data.hargaKos,
      data.hargaJual,
      data.kuantitiStok,
      data.notes
    ];
    
    sheet.appendRow(newRow);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Row appended successfully.' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log(error);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentUrl, onPinChange, isAdminMode, onSetIsAdminMode }) => {
  const [url, setUrl] = useState(currentUrl);
  const [copied, setCopied] = useState(false);

  const [pin, setPin] = useState(localStorage.getItem('settingsPin') || '');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');

  useEffect(() => {
    setUrl(currentUrl);
    setPin(localStorage.getItem('settingsPin') || '');
    setNewPin('');
    setConfirmPin('');
    setPinError('');
    setPinSuccess('');
  }, [currentUrl, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(url);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePin = () => {
    setPinError('');
    setPinSuccess('');
    if (newPin.length < 4) {
      setPinError('PIN mesti sekurang-kurangnya 4 digit.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('PIN pengesahan tidak sepadan.');
      return;
    }
    localStorage.setItem('settingsPin', newPin);
    setPin(newPin);
    setNewPin('');
    setConfirmPin('');
    setPinSuccess('PIN baru berjaya disimpan!');
    onPinChange();
    setTimeout(() => setPinSuccess(''), 3000);
  };

  const handleRemovePin = () => {
    if (window.confirm('Anda pasti ingin membuang PIN? Tetapan akan boleh diakses tanpa kata laluan.')) {
      localStorage.removeItem('settingsPin');
      setPin('');
      setNewPin('');
      setConfirmPin('');
      setPinError('');
      setPinSuccess('PIN telah dibuang.');
      onPinChange();
      setTimeout(() => setPinSuccess(''), 3000);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tetapan</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Integrasi Google Sheet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Simpan rekod inventori secara automatik ke Google Sheet peribadi anda.</p>
            <label htmlFor="sheetUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 mt-4">URL Web App Google</label>
            <input
              id="sheetUrl"
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Tampal URL dari Google Apps Script di sini"
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
           <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
             <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Keselamatan & Ciri Admin</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Lindungi halaman tetapan dan aktifkan ciri admin.</p>

            <div className="mt-4 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">Mod Admin</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Tunjukkan butang padam pada setiap rekod.</p>
                </div>
                <label htmlFor="admin-toggle" className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="admin-toggle" 
                    className="sr-only peer" 
                    checked={isAdminMode} 
                    onChange={(e) => onSetIsAdminMode(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600"></div>
                </label>
            </div>

             {!pin ? (
                <div className="mt-4 space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300">Tetapkan PIN Baru</h4>
                    <div>
                        <label htmlFor="newPin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">PIN Baru</label>
                        <input id="newPin" type="password" value={newPin} onChange={e => setNewPin(e.target.value.replace(/[^0-9]/g, ''))} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Sekurang-kurangnya 4 digit" inputMode="numeric" pattern="\d*"/>
                    </div>
                    <div>
                        <label htmlFor="confirmPin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sahkan PIN</label>
                        <input id="confirmPin" type="password" value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Ulang PIN baru" inputMode="numeric" pattern="\d*"/>
                    </div>
                    <div className="flex justify-end">
                      <button onClick={handleSavePin} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">Simpan PIN</button>
                    </div>
                </div>
             ) : (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">PIN telah ditetapkan. Anda boleh menukar atau membuangnya.</p>
                    <div className="flex space-x-3 mt-3">
                        <button onClick={() => { setPin(''); setPinError(''); setPinSuccess(''); }} className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-500">Tukar PIN</button>
                        <button onClick={handleRemovePin} className="px-4 py-2 text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900">Buang PIN</button>
                    </div>
                </div>
             )}
             {pinError && <p className="text-sm text-red-500 dark:text-red-400 mt-2">{pinError}</p>}
             {pinSuccess && <p className="text-sm text-green-500 dark:text-green-400 mt-2">{pinSuccess}</p>}
           </div>


          <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Arahan Pemasangan Google Sheet</h3>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <h4 className="font-semibold">Langkah 1: Sediakan Google Sheet</h4>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Buka <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 underline">sheets.new</a> untuk cipta Sheet baru.</li>
                <li>Namakan semula tab pertama (di bawah) kepada <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Inventori</code>.</li>
                <li>Letakkan tajuk berikut dalam baris pertama, dari sel A1 hingga H1: <br/>
                  <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">Tarikh</code>, <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">Nama</code>, <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">Vendor</code>, <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">Image URL</code>, <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">Harga Kos</code>, <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">Harga Jual</code>, <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">Kuantiti Stok</code>, <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">Nota</code>
                </li>
              </ol>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <h4 className="font-semibold">Langkah 2: Cipta & Deploy Apps Script</h4>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Dalam Sheet anda, klik menu <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Extensions</code> &rarr; <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Apps Script</code>.</li>
                    <li>Padam kod sedia ada dan tampal kod di bawah:
                        <div className="relative my-2">
                            <pre className="bg-slate-200 dark:bg-slate-900 p-3 rounded-md text-xs overflow-x-auto"><code>{appsScriptCode}</code></pre>
                            <button onClick={handleCopy} className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600">{copied ? 'Disalin!' : 'Salin'}</button>
                        </div>
                    </li>
                    <li>Klik butang <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Deploy</code> (atas kanan) &rarr; <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">New deployment</code>.</li>
                    <li>Klik ikon gear (<span className="font-sans-serif">⚙️</span>), pilih <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Web app</code>.</li>
                    <li>Dalam <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Execute as</code>, pilih <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Me</code>.</li>
                    <li>Dalam <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Who has access</code>, pilih <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Anyone</code>.</li>
                    <li className="text-amber-600 dark:text-amber-400"><b>PENTING:</b> Ini membenarkan sesiapa sahaja yang mempunyai pautan untuk menambah data. Jangan kongsi URL ini.</li>
                    <li>Klik <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Deploy</code> dan beri kebenaran (authorize) jika diminta.</li>
                    <li>Salin <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">Web app URL</code> dan tampal dalam medan di atas.</li>
                </ol>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3 sticky bottom-0 z-10">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-500">Batal</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">Simpan & Tutup</button>
        </div>
      </div>
    </div>
  );
};