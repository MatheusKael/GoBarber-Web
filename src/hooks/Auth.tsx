import React, { createContext, useCallback, useContext, useState } from 'react';
import api from '../services/api';

interface AuthState {
  token: string;
  user: object;
}

interface SignInCrendentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(crendentials: SignInCrendentials): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState(() => {
    const token = localStorage.getItem('@GoBarber:Token');
    const user = localStorage.getItem('@GoBarber:User');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:Token', token);
    localStorage.setItem('@GoBarber:User', JSON.stringify(user));
    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:Token');
    localStorage.removeItem('@GoBarber:User');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Context must be used within a ContextProvider');
  }
  return context;
}
