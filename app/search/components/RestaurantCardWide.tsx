import { Cuisine, PRICE, Location, Review } from '@prisma/client';
import Link from 'next/link';
import Price from '../../components/Price';
import { calculateReviewRatingAverage } from '../../../utilities/calculateReviewRatingAverage';
import Stars from '../../components/Stars';

export interface Restaurant {
  id: number;
  name: string;
  main_image: string;
  cuisine: Cuisine;
  slug: string;
  location: Location;
  price: PRICE;
  reviews: Review[];
}

export default function RestaurantCardWide({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  const renderRatingText = () => {
    const rating = calculateReviewRatingAverage(restaurant.reviews);
    if (rating > 4) return 'Awesome';
    else if (rating <= 4 && rating > 3) return 'Good';
    else if (rating <= 3 && rating > 0) return 'Average';
    else return '';
  };
  return (
    <Link href="/restaurant/123">
      <div className="border-b flex pb-5 ml-4">
        <img
          src={restaurant.main_image}
          alt=""
          className="w-44 h-30 w-60 rounded"
        />
        <div className="pl-5">
          <h2 className="text-3xl">{restaurant.name}</h2>
          <div className="flex items-start">
            <div className="flex mb-2">
              <Stars reviews={restaurant.reviews} />
            </div>
            <p className="ml-2 text-sm">{renderRatingText()}</p>
          </div>
          <div className="mb-9">
            <div className="font-light flex text-reg">
              <p className="mr-4">
                <Price price={restaurant.price} />
              </p>
              <p className="mr-4 capitalize">{restaurant.cuisine.name}</p>
              <p className="mr-4 capitalize">{restaurant.location.name}</p>
            </div>
          </div>
          <div className="text-red-600">
            <Link href={`/restaurant/${restaurant.slug}`}>
              View more information
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
}
