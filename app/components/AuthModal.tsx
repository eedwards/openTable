/* eslint-disable react/no-unescaped-entities */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState, useContext } from 'react';
import AuthModalInputs from './AuthModalInputs';
import useAuth from '../../hooks/useAuth';
import { AuthenticationContext } from '../context/AuthContext';
import { Alert, CircularProgress } from '@mui/material';
import { is } from 'date-fns/locale';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  color: 'black',
};

export default function AuthModal() {
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  const { signIn, signUp } = useAuth();
  const { loading, error, isModalOpen, setIsModalOpen } = useContext(
    AuthenticationContext
  );

  const [isSignIn, setIsSignIn] = useState(true);
  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: '',
    password: '',
  });
  const [disabled, setDisabled] = useState(true);

  const renderContent = (sigInContent: String, signUpContent: string) => {
    return isSignIn ? sigInContent : signUpContent;
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setInputs({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      city: '',
      password: '',
    });
  }, [isSignIn]);

  useEffect(() => {
    if (isSignIn) {
      if (inputs.email && inputs.password) {
        return setDisabled(false);
      }
    } else {
      if (
        inputs.firstName &&
        inputs.lastName &&
        inputs.email &&
        inputs.phoneNumber &&
        inputs.city &&
        inputs.password
      ) {
        return setDisabled(false);
      }
    }
    setDisabled(true);
  }, [inputs, isSignIn]);

  const handleClick = async () => {
    if (isSignIn) {
      await signIn(
        { email: inputs.email, password: inputs.password },
        handleClose
      );
    } else {
      signUp(inputs, handleClose);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
        onClick={handleOpen}
      >
        Sign In
      </button>
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="py-24 p-2 h-[400px] flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="p-2 h-[400px]">
              {error ? <Alert severity="error">{error}</Alert> : null}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className={'text-sm'}>
                  {renderContent('Sign in', 'Create Account')}
                </p>
              </div>
              <div className="m-auto">
                <h2 className="text-2xl font-light text-center">
                  {renderContent(
                    'Sign in to your account',
                    'Create an account'
                  )}
                </h2>
                <AuthModalInputs
                  inputs={inputs}
                  handleChangeInput={handleChangeInput}
                  isSignIn={isSignIn}
                />
                <div className="text-center mt-4 pb-5">
                  {isSignIn ? (
                    <>
                      Don't have an account?
                      <button
                        className="text-blue-500 ml-1"
                        onClick={() => setIsSignIn(false)}
                      >
                        Create one now.
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?
                      <button
                        className="text-blue-500 ml-1"
                        onClick={() => setIsSignIn(true)}
                      >
                        Sign in.
                      </button>
                    </>
                  )}
                </div>
                <button
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                  disabled={disabled}
                  onClick={handleClick}
                >
                  {renderContent('Sign In', 'Create Account')}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
