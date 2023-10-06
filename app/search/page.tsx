import Link from 'next/link';
import Navbar from '../components/Navbar';
import SearchHeader from './components/SearchHeader';
import SearchSideBar from './components/SearchSideBar';
import RestaurantCardWide from './components/RestaurantCardWide';
import { PrismaClient, Location, Cuisine, PRICE } from '@prisma/client';

const prisma = new PrismaClient();

interface SearchParams {
  city: string;
  cuisine: string;
  price: PRICE;
}

const fetchRestaurantByCity = (searchParams: SearchParams) => {
  const where: any = {};
  if (searchParams.city) {
    const location = {
      name: {
        equals: searchParams.city.toLowerCase(),
      },
    };
    where.location = location;
  }
  if (searchParams.cuisine) {
    const cuisine = {
      name: {
        equals: searchParams.cuisine.toLowerCase(),
      },
    };
    where.cuisine = cuisine;
  }
  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.price = searchParams.price;
  }

  const select = {
    id: true,
    name: true,
    main_image: true,
    cuisine: true,
    slug: true,
    location: true,
    price: true,
    reviews: true,
  };

  return prisma.restaurant.findMany({
    where,
    select,
  });
};
const fetchLocations = async () => {
  const locations = await prisma.location.findMany();
  return locations;
};
const fetchCuisines = async () => {
  const cuisines = await prisma.cuisine.findMany();
  return cuisines;
};

export default async function Search({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const restaurants = await fetchRestaurantByCity(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();
  return (
    <>
      <SearchHeader />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          locations={locations}
          cuisines={cuisines}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            <>
              {restaurants.map((restaurant) => (
                <RestaurantCardWide
                  restaurant={restaurant}
                  key={restaurant.id}
                />
              ))}
            </>
          ) : (
            <p>No restaurants found</p>
          )}
        </div>
      </div>
    </>
  );
}
