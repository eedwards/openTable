import ReservationForm from './components/ReservationForm';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (!restaurant) {
    notFound();
  }
  return restaurant;
};

export default async function Reservation({
  params,
  searchParams,
}: {
  params: { slug: string; id: number };
  searchParams: { date: string; partySize: string };
}) {
  const restaurant = await fetchRestaurantBySlug(params.slug);

  return (
    <div className="flex items-center justify-center min-h-screen border-t">
      <ReservationForm
        slug={params.slug}
        date={searchParams.date}
        partySize={searchParams.partySize}
        bookerId={params.id}
        restaurantName={restaurant.name}
        image={restaurant.main_image}
      />
    </div>
  );
}
