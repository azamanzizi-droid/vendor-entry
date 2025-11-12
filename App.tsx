import React, { useState, useEffect } from 'react';
import { InventoryForm } from './components/InventoryForm';
import { InventoryList } from './components/InventoryList';
import type { InventoryItem, ToastMessage } from './types';
import { Header } from './components/Header';
import { SettingsModal } from './components/SettingsModal';
import { Toast } from './components/Toast';
import { PinModal } from './components/PinModal';

const App: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    try {
      const localData = localStorage.getItem('inventoryItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse inventory from localStorage", error);
      return [];
    }
  });

  const [vendors, setVendors] = useState<string[]>(() => {
    try {
      const localData = localStorage.getItem('vendors');
      return localData ? JSON.parse(localData) : ['Mak Kiah', 'Pak Abu', 'Kak Ani'];
    } catch (error) {
      console.error("Could not parse vendors from localStorage", error);
      return ['Mak Kiah', 'Pak Abu', 'Kak Ani'];
    }
  });
  
  const [sheetUrl, setSheetUrl] = useState<string>(() => localStorage.getItem('sheetUrl') || '');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinExists, setPinExists] = useState(() => !!localStorage.getItem('settingsPin'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const localData = localStorage.getItem('isAdminMode');
      return localData ? JSON.parse(localData) : false;
    } catch (error) {
      console.error("Could not parse isAdminMode from localStorage", error);
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);
  
  useEffect(() => {
    localStorage.setItem('vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('sheetUrl', sheetUrl);
  }, [sheetUrl]);

  useEffect(() => {
    localStorage.setItem('isAdminMode', JSON.stringify(isAdminMode));
  }, [isAdminMode]);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const addItem = async (item: Omit<InventoryItem, 'id'>) => {
    setIsSubmitting(true);
    const newItem: InventoryItem = {
      id: new Date().toISOString() + Math.random(),
      ...item,
    };
    setItems(prevItems => [newItem, ...prevItems]);

    if (sheetUrl) {
      try {
        // We format the date specifically for the spreadsheet
        const sheetData = {
          ...item,
          date: new Date(item.date).toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' })
        };

        // 'no-cors' is used for simple POST requests to Google Apps Script web apps
        // to avoid CORS preflight issues. We can't read the response, so this is
        // a "fire and forget" request. We show success if the network request itself doesn't fail.
        await fetch(sheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sheetData),
          redirect: 'follow',
        });
        addToast('Rekod berjaya disimpan ke Google Sheet.', 'success');
      } catch (error) {
        console.error("Failed to submit to Google Sheet:", error);
        addToast('Gagal menyimpan ke Google Sheet. Semak URL & sambungan internet.', 'error');
      }
    }
    
    setIsSubmitting(false);
    return true; // Indicate success for form clearing
  };
  
  const deleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    addToast('Rekod telah dipadam.', 'success');
  };

  const addVendor = (newVendor: string) => {
    const trimmedVendor = newVendor.trim();
    if (trimmedVendor && !vendors.find(v => v.toLowerCase() === trimmedVendor.toLowerCase())) {
      setVendors(prevVendors => [...prevVendors, trimmedVendor].sort((a, b) => a.localeCompare(b)));
    }
  };

  const handleOpenSettings = () => {
    if (pinExists) {
      setIsPinModalOpen(true);
    } else {
      setIsSettingsOpen(true);
    }
  };

  const handlePinUpdate = () => {
    setPinExists(!!localStorage.getItem('settingsPin'));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans transition-colors duration-300">
      <Header onOpenSettings={handleOpenSettings} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <InventoryForm 
            onAddItem={addItem} 
            vendors={vendors}
            onAddVendor={addVendor}
            isSubmitting={isSubmitting}
          />
          <div className="mt-12">
             <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-6 border-b-2 border-slate-200 dark:border-slate-700 pb-2">Rekod Terkini</h2>
            <InventoryList items={items} onDeleteItem={deleteItem} isAdminMode={isAdminMode} />
          </div>
        </div>
      </main>
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={setSheetUrl}
        currentUrl={sheetUrl}
        onPinChange={handlePinUpdate}
        isAdminMode={isAdminMode}
        onSetIsAdminMode={setIsAdminMode}
      />
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
            setIsPinModalOpen(false);
            setIsSettingsOpen(true);
        }}
      />
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast 
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;