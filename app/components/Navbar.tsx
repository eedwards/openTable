'use client';
import Link from 'next/link';
import AuthModal from './AuthModal';
import { useContext } from 'react';
import { AuthenticationContext } from '../context/AuthContext';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { data, loading } = useContext(AuthenticationContext);
  const { signOut } = useAuth();
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      <div>
        {loading ? null : (
          <div className="flex">
            {data ? (
              <Link
                href={`/user-profile/${data?.id}`}
                className="bg-gray-100 text-gray border p-1 px-4 rounded mr-3"
              >
                Hello, {data.firstName}
              </Link>
            ) : null}
            {data ? (
              <button
                className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
                onClick={signOut}
              >
                Sign Out
              </button>
            ) : (
              <>
                <AuthModal />
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
