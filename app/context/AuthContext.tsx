'use client';

import axios from 'axios';
import { getCookie } from 'cookies-next';
import React, { useState, createContext, useEffect } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  password: string;
}

interface State {
  loading: boolean;
  error: string | null;
  data: User | null;
  isAuthenticated: boolean;
}
interface AuthState extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthenticationContext = createContext<AuthState>({
  loading: false,
  error: null,

  data: null,
  isAuthenticated: false,
  setAuthState: () => {},
  isModalOpen: false,
  setIsModalOpen: () => {},
});

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<State>({
    loading: true,
    error: null,
    data: null,
    isAuthenticated: false,
  });

  const fetchUser = async () => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
      isAuthenticated: false,
    });

    try {
      const jwt = getCookie('jwt');
      if (!jwt) {
        return setAuthState({
          data: null,
          error: null,
          loading: false,
          isAuthenticated: false,
        });
      }
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

      setAuthState({
        data: response.data,
        error: null,
        loading: false,
        isAuthenticated: true,
      });
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
        isAuthenticated: false,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AuthenticationContext.Provider
      value={{ ...authState, setAuthState, isModalOpen, setIsModalOpen }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
