import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import React from 'react';
import UserBookings from '../../user-profile/[id]/components/UserBookings';
import UserReviews from '../../user-profile/[id]/components/UserReviews';

const prisma = new PrismaClient();

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
  first_name: string;
  last_name: string;
  text: string;
  rating: number;
  restaurant: RestaurantInfo;
};

type BookingWithRestaurant = {
  id: number;
  booker_first_name: string;
  booker_last_name: string;
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
  reviews: ReviewWithRestaurant[];
  bookings: BookingWithRestaurant[];
};
const fetchUserById = async (id: number): Promise<UserWithDetails | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      city: true,
      id: true,
      reviews: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          text: true,
          rating: true,
          restaurant: {
            select: {
              id: true,
              open_time: true,
              close_time: true,
              name: true,
              slug: true,
              main_image: true,
            },
          },
        },
      },
      bookings: {
        select: {
          id: true,
          booker_first_name: true,
          booker_last_name: true,
          number_of_people: true,
          booking_time: true,
          restaurant: {
            select: {
              id: true,
              open_time: true,
              close_time: true,
              name: true,
              slug: true,
              main_image: true,
            },
          },
        },
      },
    },
  });

  return user;
};

export default async function LeaveAReview({
  params,
}: {
  params: { id: number };
}) {
  const user = await fetchUserById(Number(params.id));
  if (!user) {
    return notFound();
  }
  // console.log('user', user);
  return (
    <>
      {/* <div className="flex gap-6"> */}
      {/* <div className="w-1/2 bg-white shadow-lg rounded-lg p-6"> */}
      <UserReviews user={user}></UserReviews>
      {/* <UserBookings user={user} /> */}
      {/* </div> */}
      {/* </div> */}
      {/* <div className=" flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-4">
            Leave a Review
          </h2>

          <form action="/submit-review" method="post">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="mt-1 p-2 w-full border rounded-md bg-white"
              ></input>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <select
                id="rating"
                name="rating"
                required
                className="mt-1 p-2 w-full border rounded-md bg-white"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Your Review
              </label>
              <textarea
                id="review"
                name="review"
                rows={4}
                required
                className="mt-1 p-2 w-full border rounded-md bg-white"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div> */}
    </>
  );
}
