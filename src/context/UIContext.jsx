import React, { createContext, useState, useRef } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [toastMessage, setToastMessage] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef(null);

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: '',
    description: '',
    actionText: 'CONFIRM',
    onAction: null
  });

  const showToast = (message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    setToastVisible(true);

    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const showModal = (title, description, actionText = 'CONFIRM', onAction = null) => {
    setModalConfig({
      visible: true,
      title,
      description,
      actionText,
      onAction
    });
  };

  const hideModal = () => {
    setModalConfig(prev => ({
      ...prev,
      visible: false
    }));
  };

  return (
    <UIContext.Provider value={{
      showToast,
      showModal,
      hideModal,
      toastMessage,
      toastVisible,
      modalConfig
    }}>
      {children}
    </UIContext.Provider>
  );
};
