import axios from 'axios';
import { deleteCookie, removeCookies } from 'cookies-next';
import { useContext } from 'react';
import { AuthenticationContext } from '../app/context/AuthContext';

const useAuth = () => {
  const { setAuthState } = useContext(AuthenticationContext);

  const signIn = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
      isAuthenticated: false,
    });
    try {
      const response = await axios.post('/api/auth/signin', {
        email,
        password,
      });
      setAuthState({
        data: response.data,
        error: null,
        loading: false,
        isAuthenticated: false,
      });
      handleClose();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
        isAuthenticated: false,
      });
    }
  };
  const signUp = async (
    {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      city,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      city: string;
    },
    handleClose: () => void
  ) => {
    setAuthState({
      data: null,
      error: null,
      loading: true,
      isAuthenticated: false,
    });
    try {
      const response = await axios.post('/api/auth/signup', {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        city,
      });
      setAuthState({
        data: response.data,
        error: null,
        loading: false,
        isAuthenticated: true,
      });
      handleClose();
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false,
        isAuthenticated: false,
      });
    }
  };

  const signOut = async () => {
    deleteCookie('jwt');

    setAuthState({
      data: null,
      error: null,
      loading: false,
      isAuthenticated: false,
    });
  };

  return { signIn, signUp, signOut };
};
export default useAuth;
