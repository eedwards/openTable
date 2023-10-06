import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';

export default function useBooking() {
  const [loading, setLoading] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const createReservation = async ({
    slug,
    day,
    time,
    partySize,

    bookerOccasion,
    bookerRequests,
    setDidBook,
  }: {
    slug: string;
    day: string;
    time: string;
    partySize: string;
    bookerFirstName: string;
    bookerLastName: string;
    bookerPhoneNumber: string;
    bookerEmail: string;
    bookerOccasion: string;
    bookerRequests: string;
    setDidBook: Dispatch<SetStateAction<boolean>>;
  }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/restaurant/${slug}/reserve`,
        {
          bookerOccasion,
          bookerRequests,
        },
        {
          params: { day, time, partySize },
        }
      );
      setLoading(false);
      setDidBook(true);
      return response.data;
    } catch (error: any) {
      setError(error.response.data.errorMessage);
    }
  };
  return { loading, error, createReservation };
}
