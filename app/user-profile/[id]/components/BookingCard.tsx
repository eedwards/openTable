'use client';
import React, { useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import ReservationCard from '../../../restaurant/[slug]/components/ReservationCard';

type RestaurantInfo = {
  id: number;
  open_time: string;
  close_time: string;
  name: string;
  slug: string;
  main_image: string;
};

interface BookingWithRestaurant {
  id: number;
  number_of_people: number;
  booking_time: Date;
  restaurant: RestaurantInfo;
  booker_occasion?: string | null;
  booker_request?: string | null;
}

type UserWithDetails = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
};

export default function BookingCard({
  booking,
  user,
}: {
  booking: BookingWithRestaurant;
  user: UserWithDetails;
}) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isReviewFormVisible, setReviewFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to control when the edit reservation view should be shown

  const toggleReviewForm = () => {
    setReviewFormVisible(!isReviewFormVisible);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  async function submitReview() {
    const response = await axios.post('/api/reviews/reviews', {
      reviewText,
      rating,
      restaurantId: booking.restaurant.id,
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
    });

    if (response.status === 200) {
      toggleReviewForm();
    }
  }
  function handleSave(editedBookingData: BookingWithRestaurant) {
    // Make an API call to save edits
    axios
      .put(`/api/reservations/${editedBookingData.id}`, editedBookingData)
      .then((response: AxiosResponse<any>) => {
        if (response.status === 200) {
          // Update local state if needed
          // Close the editing view
          toggleEdit();
        }
      })
      .catch((error: AxiosError) => {
        // Handle any errors
        console.error('Error saving reservation:', error);
      });
  }

  return (
    <div className="w-full md:w-72 h-auto rounded overflow-hidden border cursor-pointer p-4 md:p-5 bg-white shadow-xl rounded-lg ">
      <img
        src={booking.restaurant.main_image}
        alt=""
        className="w-full h-38 object-cover"
      />
      <div className="p-2">
        {isReviewFormVisible && (
          <div className="mt-4 p-4 rounded">
            <label htmlFor="rating" className="block mb-2 font-semibold">
              Rating:
            </label>
            <select
              name="rating"
              id="rating"
              className="w-full mb-4 p-2 border rounded bg-white"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <label htmlFor="review" className="block mb-2 font-semibold">
              Your Review:
            </label>
            <textarea
              name="review"
              id="review"
              className="w-full p-2 border rounded bg-white"
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
            <div className="flex">
              <button
                onClick={submitReview}
                className="mt-4 p-2 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
              >
                Submit Review
              </button>
              <button
                onClick={toggleReviewForm}
                className="mt-4 p-2 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isEditing && (
          <ReservationCard
            openTime={booking.restaurant.open_time}
            closeTime={booking.restaurant.close_time}
            slug={booking.restaurant.slug}
            existingReservation={booking}
            onSave={handleSave}
          />
        )}

        {!isReviewFormVisible && !isEditing && (
          <>
            <h3 className="text-center text-lg md:text-xl text-gray-900 font-medium leading-8">
              {booking.restaurant.name}
            </h3>
            <div className="text-center text-gray-400 text-xs font-semibold">
              <p>{new Date(booking.booking_time).toISOString()}</p>
            </div>
            <table className="text-xs my-3">
              <tbody>
                <tr>
                  <td className="px-2 py-2 text-gray-500 font-semibold">
                    Reservation for:
                  </td>
                  <td className="px-2 py-2 text-gray-500">
                    {booking.number_of_people}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-2 text-gray-500 font-semibold">
                    Occasion:
                  </td>
                  <td className="px-2 py-2 text-gray-500">
                    {booking.booker_occasion || 'None'}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-2 text-gray-500 font-semibold">
                    Requests:
                  </td>
                  <td className="px-2 py-2 text-gray-500">
                    {booking.booker_request || 'None'}
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={toggleReviewForm}
              className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
            >
              Leave A Review
            </button>
            <button
              onClick={toggleEdit}
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 ml-2"
            >
              Edit Your Reservation
            </button>
          </>
        )}
      </div>
    </div>
  );
}
