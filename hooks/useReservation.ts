import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';

type ReservationParams = {
  slug: string;
  day: string;
  time: string;
  partySize: string;
  bookerId: number;
  bookerFirstName: string;
  bookerLastName: string;
  bookerPhoneNumber: string;
  bookerEmail: string;
  bookerOccasion: string;
  bookerRequests: string;
  restaurantName: string;
  setDidBook: Dispatch<SetStateAction<boolean>>;
  bookingId?: number;
};

export default function useReservation() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleReservation = async ({
    slug,
    day,
    time,
    bookerId,
    partySize,
    bookerFirstName,
    bookerLastName,
    bookerPhoneNumber,
    bookerEmail,
    bookerOccasion,
    bookerRequests,
    restaurantName,
    setDidBook,
    bookingId,
  }: ReservationParams) => {
    setLoading(true);
    let response;

    const requestBody = {
      bookerFirstName,
      bookerLastName,
      bookerPhoneNumber,
      bookerEmail,
      bookerOccasion,
      bookerRequests,
      bookerId,
      restaurantName,
      bookingId,
    };
    console.log('reqbody', requestBody);

    const requestParams = { day, time, partySize };

    try {
      if (bookingId) {
        console.log('&&&&');
        // If an ID is provided, we assume this is an edit
        response = await axios.put(
          `http://localhost:3000/api/restaurant/${slug}/reserve/${bookingId}`,
          requestBody,
          { params: requestParams }
        );
      } else {
        console.log('hi', requestBody, requestParams);

        // If no ID is provided, this is a new reservation
        response = await axios.post(
          `http://localhost:3000/api/restaurant/${slug}/reserve`,
          requestBody,
          { params: requestParams }
        );
      }
      setLoading(false);
      setDidBook(true);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return { loading, error, handleReservation };
}

// import { Dispatch, SetStateAction, useState } from 'react';
// import axios from 'axios';

// export default function useReservation() {
//   const [loading, setLoading] = useState<any>(null);
//   const [error, setError] = useState<any>(null);

//   const createReservation = async ({
//     slug,
//     day,
//     time,
//     bookerId,
//     partySize,
//     bookerFirstName,
//     bookerLastName,
//     bookerPhoneNumber,
//     bookerEmail,
//     bookerOccasion,
//     bookerRequests,
//     restaurantName,
//     setDidBook,
//   }: {
//     slug: string;
//     day: string;
//     time: string;
//     partySize: string;
//     bookerId: number;
//     bookerFirstName: string;
//     bookerLastName: string;
//     bookerPhoneNumber: string;
//     bookerEmail: string;
//     bookerOccasion: string;
//     bookerRequests: string;
//     restaurantName: string;

//     setDidBook: Dispatch<SetStateAction<boolean>>;
//   }) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `http://localhost:3000/api/restaurant/${slug}/reserve`,
//         {
//           bookerFirstName,
//           bookerLastName,
//           bookerPhoneNumber,
//           bookerEmail,
//           bookerOccasion,
//           bookerRequests,
//           bookerId,
//           restaurantName,
//         },
//         {
//           params: { day, time, partySize },
//         }
//       );
//       setLoading(false);
//       setDidBook(true);
//       return response.data;
//     } catch (error: any) {
//       setError(error.response.data.errorMessage);
//     }
//   };
//   return { loading, error, createReservation };
// }
