import { PrismaClient, Review } from '@prisma/client';
import { notFound } from 'next/navigation';
import ReservationCard from './components/ReservationCard';
import RestaurantDescription from './components/RestaurantDescription';
import RestaurantHeader from './components/RestaurantHeader';
import RestaurantImages from './components/RestaurantImages';
import RestaurantNavBar from './components/RestaurantNavBar';
import RestaurantRating from './components/RestaurantRating';
import RestaurantReviews from './components/RestaurantReviews';
import RestaurantTitle from './components/RestaurantTitle';

const prisma = new PrismaClient();

interface Restaurant {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
  reviews: Review[];
  open_time: string;
  close_time: string;
}

const fetchRestaurantBySlug = async (slug: string): Promise<Restaurant> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

export default async function RestaurantDetails({
  params,
}: {
  params: { slug: string };
}) {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  return (
    <>
      <div className="lg:w-2/3">
        <RestaurantNavBar slug={restaurant.slug} />
        <div className="border-b border-gray-200 py-2 mb-3">
          <RestaurantTitle name={restaurant.name} />
          <div className="mt-2">
            <RestaurantRating reviews={restaurant.reviews} />
          </div>
        </div>

        <div className="mb-4">
          <RestaurantDescription description={restaurant.description} />
        </div>
        <div className="mb-4">
          <RestaurantReviews reviews={restaurant.reviews} />
        </div>
      </div>

      <div className="lg:w-1/3 space-y-5">
        <div className="bg-white p-4 shadow rounded">
          <ReservationCard
            slug={restaurant.slug}
            openTime={restaurant.open_time}
            closeTime={restaurant.close_time}
          />
        </div>
        <div className="relative rounded-lg overflow-hidden">
          <RestaurantImages images={restaurant.images} />
        </div>
      </div>
    </>
  );
}
