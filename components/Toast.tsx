import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

const SuccessIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ErrorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  const isSuccess = type === 'success';

  return (
    <div
      className={`
        flex items-center p-4 w-full max-w-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg shadow-lg
        dark:shadow-slate-900/50
        animate-fade-in-up
      `}
      role="alert"
    >
      <div className={`
        inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg
        ${isSuccess ? 'bg-teal-100 dark:bg-teal-800 text-teal-500 dark:text-teal-200' : 'bg-red-100 dark:bg-red-800 text-red-500 dark:text-red-200'}
      `}>
        {isSuccess ? <SuccessIcon className="w-5 h-5" /> : <ErrorIcon className="w-5 h-5" />}
        <span className="sr-only">{isSuccess ? 'Success' : 'Error'} icon</span>
      </div>
      <div className="ml-3 text-sm font-normal text-slate-700 dark:text-slate-200">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg focus:ring-2 focus:ring-slate-300 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 inline-flex h-8 w-8"
        onClick={onDismiss}
        aria-label="Tutup"
      >
        <span className="sr-only">Tutup</span>
        <CloseIcon className="w-5 h-5" />
      </button>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(1rem);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
