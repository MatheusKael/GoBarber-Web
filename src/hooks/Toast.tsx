import React, { createContext, useCallback, useContext, useState } from 'react';
import { uuid } from 'uuidv4';
import ToastContainer from '../components/ToastContainer';

interface ToastContextDataa {
  addToast(messages: Omit<ToastMessagesTypes, 'id'>): void;
  removeToast(id: string): void;
}
export interface ToastMessagesTypes {
  id: string;
  type?: 'info' | 'error' | 'success';
  title: string;
  description?: string;
}

export const ToastContext = createContext<ToastContextDataa>(
  {} as ToastContextDataa,
);

export const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessagesTypes[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessagesTypes, 'id'>) => {
      const id = uuid();

      const toast = {
        id,
        type,
        title,
        description,
      };

      setMessages(oldMessages => [...oldMessages, toast]);
    },
    [],
  );
  const removeToast = useCallback((id: string) => {
    setMessages(state => state.filter(message => message.id !== id));
  }, []);
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextDataa {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within an ToastContextProvider');
  }
  return context;
}
