import React from 'react';

interface HeaderProps {
  onOpenSettings: () => void;
}

const StoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m21.21 15.89-1.21-6.05A3 3 0 0 0 17.17 7H6.83a3 3 0 0 0-2.83 2.84L2.79 15.89A2 2 0 0 0 4.78 18h14.44a2 2 0 0 0 1.99-2.11Z" />
    <path d="M7 18v-1a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v1" />
    <path d="M12 12a3 3 0 0 0-3-3" />
    <path d="M15 9a3 3 0 0 0-3 3" />
  </svg>
);

const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto p-4 md:p-6 flex items-center justify-between">
        <div className="flex-1"></div>
        <div className="flex items-center space-x-3 text-teal-600 dark:text-teal-400">
          <StoreIcon className="w-8 h-8 md:w-10 md:h-10"/>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Gerai <span className="text-teal-600 dark:text-teal-400">ZZ</span>
          </h1>
        </div>
        <div className="flex-1 flex justify-end">
          <button 
            onClick={onOpenSettings}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-800"
            aria-label="Buka tetapan"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
