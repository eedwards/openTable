// import React from 'react';
// import BookingCard from './BookingCard';

// type RestaurantInfo = {
//   name: string;
//   slug: string;
//   main_image: string;
// };

// type BookingWithRestaurant = {
//   id: number;
//   number_of_people: number;
//   booking_time: Date;
//   restaurant: RestaurantInfo;
// };

// export default function UserBookings({
//   bookings,
//   userId,
// }: {
//   bookings: BookingWithRestaurant[];
//   userId: number;
// }) {
//   return (
//     <>
//       <h3 className="text-xl md:text-lg font-semibold mb-3 md:mb-4 text-gray-800 border-b pb-2">
//         Your Reservations
//       </h3>
//       <ul className="flex flex-wrap gap-2">
//         {bookings.map((booking, index) => (
//           <li
//             key={index}
//             className="text-black-600 py-2 md:py-5 rounded-full text-sm w-full md:w-auto"
//           >
//             <BookingCard key={index} booking={booking} userId={userId} />
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }

import React from 'react';
import BookingCard from './BookingCard';

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

type UserWithDetails = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  bookings: BookingWithRestaurant[];
};

export default function UserBookings({ user }: { user: UserWithDetails }) {
  return (
    <>
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-gray-800 border-b pb-2">
        Your Reservations
      </h3>
      <ul className="flex flex-col sm:flex-row gap-4">
        {user.bookings.map((booking, index) => (
          <li
            key={index}
            className="text-black-600 py-2 sm:py-5 rounded-lg text-sm w-full sm:w-1/2 lg:w-1/3"
          >
            <BookingCard key={index} booking={booking} user={user} />
          </li>
        ))}
      </ul>
    </>
  );
}
