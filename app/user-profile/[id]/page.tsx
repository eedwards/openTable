import { PrismaClient, User } from '@prisma/client';
import { notFound } from 'next/navigation';
import React from 'react';
import UserBookings from './components/UserBookings';
import UserInfo from './components/UserInfo';
import UserReviews from './components/UserReviews';

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
  text: string;
  rating: number;
  restaurant: RestaurantInfo;
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
export default async function UserProfile({
  params,
}: {
  params: { id: number };
}) {
  const user = await fetchUserById(Number(params.id));
  if (!user) {
    return notFound();
  }
  return (
    <>
      <div className="bg-white w-full p-4 md:p-6 mb-8">
        <UserInfo user={user} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-4 md:mb-0 w-full">
          <UserBookings user={user} />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-4 md:mb-0 w-full">
            <UserReviews user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
