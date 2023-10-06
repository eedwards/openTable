'use client';

import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import Router from 'next/router';
import { useContext, useEffect, useState } from 'react';
import useReservation from '../../../../hooks/useReservation';
import AuthModal from '../../../components/AuthModal';
import { AuthenticationContext } from '../../../context/AuthContext';
import {
  convertToDisplayTime,
  Time,
} from '../../../../utilities/convertToDisplayTime';
import { format } from 'date-fns';

export default function ReservationForm({
  slug,
  partySize,
  date,
  bookingId,
  restaurantName,
  image,
}: {
  slug: string;
  partySize: string;
  date: string;
  bookingId: number;
  restaurantName: string;
  image: string;
}) {
  const [inputs, setInputs] = useState({
    bookerFirstName: '',
    bookerLastName: '',
    bookerPhoneNumber: '',
    bookerEmail: '',
    bookerOccasion: '',
    bookerRequests: '',
    bookerId: 0,
    restaurantName: '',
  });
  const [day, time] = date.split('T');
  const [disabled, setDisabled] = useState(true);
  const [didBook, setDidBook] = useState(false);

  const { error, loading, handleReservation } = useReservation();
  const { data, setIsModalOpen } = useContext(AuthenticationContext);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleClick = async () => {
    if (data && data.id) {
      const booking = await handleReservation({
        slug,
        partySize,
        time,
        day,
        bookingId,
        bookerId: data.id,
        bookerFirstName: inputs.bookerFirstName,
        bookerLastName: inputs.bookerLastName,
        bookerEmail: inputs.bookerEmail,
        bookerPhoneNumber: inputs.bookerPhoneNumber,
        bookerOccasion: inputs.bookerOccasion,
        bookerRequests: inputs.bookerRequests,
        restaurantName,
        setDidBook,
      });
    } else {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    if (
      inputs.bookerFirstName &&
      inputs.bookerLastName &&
      inputs.bookerEmail &&
      inputs.bookerPhoneNumber
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputs]);

  return (
    // <div className="flex items-start justify-center min-h-screen pt-20 px-4 md:px-0">

    <div className="flex flex-wrap justify-center w-full md:w-[660px] space-y-6 p-6 rounded shadow">
      <div className="flex">
        <ReservationHeader
          image={image}
          name={restaurantName}
          date={date}
          partySize={partySize}
        />
      </div>
      {didBook ? (
        <div className="w-full max-w-xl text-center">
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-xl text-gray-700 mb-4">
            Your reservation has been confirmed.
          </p>
          <Link
            href={`/user-profile/${data?.id}`}
            className="block w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            View Details
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 w-full">
            <input
              type="text"
              className="border bg-white text-black rounded p-3 w-full"
              placeholder="First name"
              value={inputs.bookerFirstName}
              name="bookerFirstName"
              onChange={handleChangeInput}
            />
            <input
              type="text"
              className="border bg-white text-black rounded p-3 w-full"
              placeholder="Last name"
              value={inputs.bookerLastName}
              name="bookerLastName"
              onChange={handleChangeInput}
            />
            <input
              type="text"
              className="border bg-white text-black rounded p-3 w-full"
              placeholder="Phone number"
              value={inputs.bookerPhoneNumber}
              name="bookerPhoneNumber"
              onChange={handleChangeInput}
            />
            <input
              type="text"
              className="border bg-white text-black rounded p-3 w-full"
              placeholder="Email"
              value={inputs.bookerEmail}
              name="bookerEmail"
              onChange={handleChangeInput}
            />
          </div>

          <div className="space-y-4 w-full mt-4">
            <input
              type="text"
              className="border bg-white text-black rounded p-3 w-full"
              placeholder="Occasion (optional)"
              value={inputs.bookerOccasion}
              name="bookerOccasion"
              onChange={handleChangeInput}
            />
            <input
              type="text"
              className="border bg-white text-black rounded p-3 w-full"
              placeholder="Requests (optional)"
              value={inputs.bookerRequests}
              name="bookerRequests"
              onChange={handleChangeInput}
            />
          </div>

          <div className="w-full mt-6">
            <button
              disabled={disabled || loading}
              className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
              onClick={handleClick}
            >
              {loading ? (
                <CircularProgress color="inherit" />
              ) : (
                'Complete Reservation'
              )}
            </button>

            <p className="mt-4 text-lg text-gray-600 text-center">
              By clicking “Complete reservation”, you agree to the OpenTable
              Terms of Use and Privacy Policy. Standard text message rates may
              apply. You may opt out of receiving text messages at any time.
            </p>
          </div>
        </>
      )}
    </div>
    // </div>
  );
}

interface ReservationHeaderProps {
  image: string;
  name: string;
  date: string;
  partySize: string;
}

const ReservationHeader: React.FC<ReservationHeaderProps> = ({
  image,
  name,
  partySize,
  date,
}) => {
  const [day, time] = date.split('T');
  return (
    <div className="mt-5 flex flex-col md:flex-row  p-4">
      <img
        src={image}
        alt="Description of Image"
        className="w-96 h-42  rounded mx-auto md:mx-0"
      />

      <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
        <div className="flex flex-wrap justify-center md:justify-start mt-3 space-x-0 md:space-x-6">
          <p>{format(new Date(day), 'ccc, LLL d')}</p>
          <p>{convertToDisplayTime(time as Time)}</p>
        </div>
        <p>
          {partySize} {parseInt(partySize) === 1 ? 'person' : 'people'}
        </p>
      </div>
    </div>
  );
};
