'use client';
import { FC, useState } from 'react';
import { partySize as PartySizes, times } from '../../../../data';
import DatePicker from 'react-datepicker';
import useAvailabilities from '../../../../hooks/useAvailabilities';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import {
  convertToDisplayTime,
  Time,
} from '../../../../utilities/convertToDisplayTime';

interface PartySizeSelectProps {
  partySize: number;
  setPartySize: (value: number) => void;
}

const PartySizeSelect: FC<PartySizeSelectProps> = ({
  partySize,
  setPartySize,
}) => (
  <div className="mb-3">
    <label className="block mb-1">Party size</label>
    <select
      key={partySize}
      className="py-2 border-b w-full bg-white text-black"
      value={partySize}
      onChange={(e) => setPartySize(Number(e.target.value))}
    >
      {PartySizes.map((size) => (
        <option key={size.value} value={size.value}>
          {size.label}
        </option>
      ))}
    </select>
  </div>
);

interface TimeSelectProps {
  openTime: string;
  closeTime: string;
  time: string;
  setTime: (time: string) => void;
}

const TimeSelect: FC<TimeSelectProps> = ({
  openTime,
  closeTime,
  time,
  setTime,
}) => {
  const filterTimesByRestaurantOpenWindow = () => {
    const timesWithinWindow: typeof times = [];
    let isWithinWindow = false;

    times.forEach((t) => {
      if (t.time === openTime) isWithinWindow = true;
      if (isWithinWindow) timesWithinWindow.push(t);
      if (t.time === closeTime) isWithinWindow = false;
    });

    return timesWithinWindow;
  };

  return (
    <div className="mb-5">
      <label className="block mb-1">Time</label>
      <select
        className="py-2 border-b w-full bg-white text-black"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      >
        {filterTimesByRestaurantOpenWindow().map((time) => (
          <option key={time.time} value={time.time}>
            {time.displayTime}
          </option>
        ))}
      </select>
    </div>
  );
};
type RestaurantInfo = {
  id: number;
  open_time: string;
  close_time: string;
  name: string;
  slug: string;
  main_image: string;
};
type BookingWithRestaurant = {
  id: number;
  number_of_people: number;
  booking_time: Date;
  restaurant: RestaurantInfo;
};
interface ReservationCardProps {
  openTime: string;
  closeTime: string;
  slug: string;
  onSave: (data: BookingWithRestaurant) => void;
  existingReservation?: BookingWithRestaurant;
}

interface AvailableTime {
  time: string;
  isAvailable: boolean;
}

const ReservationCard: FC<ReservationCardProps> = ({
  openTime,
  closeTime,
  slug,
  existingReservation,
}) => {
  const { data, loading, fetchAvailabilities } = useAvailabilities();
  console.log('existingReservation', existingReservation);

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    existingReservation
      ? new Date(existingReservation.booking_time)
      : new Date()
  );

  const getTimeFromBooking = (bookingTime: any): string => {
    if (typeof bookingTime === 'string') {
      try {
        return new Date(bookingTime).toISOString().split('T')[1];
      } catch (err) {
        console.error('Error converting string to date', err);
      }
    } else if (bookingTime instanceof Date) {
      return bookingTime.toISOString().split('T')[1];
    }
    return openTime; // Default to openTime if all else fails
  };

  const [time, setTime] = useState<string>(
    getTimeFromBooking(existingReservation?.booking_time)
  );

  const [partySize, setPartySize] = useState<number>(
    existingReservation ? existingReservation.number_of_people : 1
  );

  const [day, setDay] = useState<string>(
    selectedDate ? selectedDate.toISOString().split('T')[0] : ''
  );

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split('T')[0]);
      setSelectedDate(date);
    } else {
      setSelectedDate(null);
      setDay('');
    }
  };

  const handleClick = () => {
    fetchAvailabilities({ slug, day, time, partySize });
  };

  return (
    <div className="w-full bg-white rounded p-4 shadow-md">
      <div className="text-center border-b pb-3 mb-3 font-bold">
        <h4 className="text-lg">
          {existingReservation ? 'Edit Reservation' : 'Make a Reservation'}
        </h4>
      </div>

      <PartySizeSelect partySize={partySize} setPartySize={setPartySize} />

      <div className="mb-3">
        <DatePicker
          selected={selectedDate}
          onChange={handleChangeDate}
          className="py-2 border-b w-full bg-white text-black"
          dateFormat={'MMMM d'}
          wrapperClassName="w-full"
        />
      </div>

      <TimeSelect
        openTime={openTime}
        closeTime={closeTime}
        time={time}
        setTime={setTime}
      />

      <button
        className="bg-red-600 rounded w-full py-4 text-white font-bold hover:bg-red-700"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? <CircularProgress color="inherit" /> : 'Find a Time'}
      </button>

      {data && data.length ? (
        <AvailableTimes
          data={data as AvailableTime[]}
          day={day}
          slug={slug}
          partySize={partySize}
        />
      ) : null}
    </div>
  );
};

interface AvailableTimesProps {
  data: AvailableTime[];
  day: string;
  slug: string;
  partySize: number;
  existingReservation?: BookingWithRestaurant;
}

const AvailableTimes: FC<AvailableTimesProps> = ({
  data,
  day,
  slug,
  partySize,
  existingReservation,
}) => (
  <div className="mt-4">
    <p className="mb-3">Select a Time</p>
    <div className="flex flex-wrap">
      {data.map((timeEntry) =>
        timeEntry.isAvailable ? (
          <Link
            key={timeEntry.time}
            className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3 hover:bg-red-700"
            href={`/reserve/${slug}?date=${day}T${timeEntry.time}&partySize=${partySize}&bookingId=${existingReservation?.id}`}
          >
            {convertToDisplayTime(timeEntry.time as Time)}
          </Link>
        ) : (
          <div
            key={timeEntry.time}
            className="p-2 w-24 text-gray-700 mb-3 rounded mr-3 bg-gray-300"
          >
            Unavailable
          </div>
        )
      )}
    </div>
  </div>
);

export default ReservationCard;
