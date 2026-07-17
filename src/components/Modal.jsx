import React, { useContext } from 'react';
import { UIContext } from '../context/UIContext';

export default function Modal() {
  const { modalConfig, hideModal } = useContext(UIContext);
  const { visible, title, description, actionText, onAction } = modalConfig;

  if (!visible) return null;

  const handleConfirm = () => {
    if (onAction) {
      onAction();
    }
    hideModal();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
      onClick={hideModal}
    >
      <div 
        className="bg-surface dark:bg-inverse-surface p-8 rounded-2xl border border-outline-variant w-full max-w-md shadow-2xl transform scale-100 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-headline-md text-headline-md text-on-surface dark:text-white mb-4">
          {title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant mb-6">
          {description}
        </p>
        <div className="flex justify-end gap-md">
          <button 
            className="border border-outline-variant text-on-surface dark:text-white hover:bg-surface-variant/10 px-4 py-2 rounded-lg font-bold transition-colors"
            onClick={hideModal}
          >
            CLOSE
          </button>
          {onAction && (
            <button 
              className="bg-primary-container text-white hover:bg-primary px-4 py-2 rounded-lg font-bold transition-colors"
              onClick={handleConfirm}
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
