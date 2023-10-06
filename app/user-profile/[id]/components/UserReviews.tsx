import React from 'react';
import ReviewCard from './ReviewCard';

type RestaurantInfo = {
  id: number;
  open_time: string;
  close_time: string;
  name: string;
  slug: string;
  main_image: string;
};

type ReviewWithRestaurant = {
  id: number;
  text: string;
  rating: number;
  restaurant: RestaurantInfo;
};

type UserWithDetails = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  reviews: ReviewWithRestaurant[];
  // ... Add other user fields if necessary
};

export default function UserReviews({ user }: { user: UserWithDetails }) {
  if (!user) return null;

  // Now you can access the user details using the `user` variable
  return (
    <>
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-gray-800 border-b pb-2">
        Your reviews:
      </h3>
      <ul className="flex flex-col sm:flex-row gap-4">
        {user.reviews?.map((review, index) => (
          <li
            key={index}
            className="text-black-600 py-2 sm:py-5 rounded-lg text-sm w-full sm:w-1/2 lg:w-1/3"
          >
            <ReviewCard key={index} review={review} user={user} />
          </li>
        ))}
      </ul>
    </>
  );
}
