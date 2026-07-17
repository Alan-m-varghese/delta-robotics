import React, { useContext } from 'react';
import { UIContext } from '../context/UIContext';

export default function Toast() {
  const { toastMessage, toastVisible } = useContext(UIContext);

  return (
    <div 
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 bg-inverse-surface dark:bg-surface text-surface dark:text-on-surface px-6 py-4 rounded-xl shadow-lg border border-outline-variant flex items-center gap-3 ${
        toastVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-12 opacity-0 pointer-events-none'
      }`}
    >
      <span className="material-symbols-outlined text-primary-container">info</span>
      <span className="font-bold text-sm">{toastMessage}</span>
    </div>
  );
}
