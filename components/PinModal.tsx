import React, { useState, useEffect, useRef } from 'react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>
);

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state and focus input when modal opens
      setPin('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPin(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('settingsPin');
    if (pin === storedPin) {
      onSuccess();
    } else {
      setError('PIN salah. Sila cuba lagi.');
      setPin('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 md:p-8 text-center">
            <KeyIcon className="mx-auto h-10 w-10 text-teal-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-4">
              Masukkan PIN
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Masukkan PIN anda untuk mengakses tetapan.
            </p>
            <div className="mt-6">
               <input
                ref={inputRef}
                id="pin"
                type="password"
                value={pin}
                onChange={handlePinChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-center tracking-[0.3em] font-mono text-lg focus:ring-teal-500 focus:border-teal-500"
                maxLength={8}
                pattern="\d*"
                inputMode="numeric"
                autoComplete="off"
                aria-label="Medan input PIN"
              />
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400 mt-3">{error}</p>}
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-500">Batal</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-800">Masuk</button>
          </div>
        </form>
      </div>
    </div>
  );
};
