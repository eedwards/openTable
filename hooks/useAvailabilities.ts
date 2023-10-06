import { useState } from 'react';
import axios from 'axios';

export default function useAvailabilities() {
  const [data, setData] = useState<
    { time: string; isAvailable: boolean }[] | null
  >(null);
  const [loading, setLoading] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const fetchAvailabilities = async ({
    slug,
    day,
    time,
    partySize,
  }: {
    slug: string;
    day: string;
    time: string;
    partySize: number;
  }) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/restaurant/${slug}/availability`,
        {
          params: { day, time, partySize },
        }
      );
      setLoading(false);

      setData(response.data);
    } catch (error: any) {
      setError(error.response.data.errorMessage);
    }
  };
  return { data, loading, error, fetchAvailabilities };
}
