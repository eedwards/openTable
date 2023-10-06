'use client';
import { User } from '@prisma/client';
import Link from 'next/link';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

type RestaurantInfo = {
  id: number;
  open_time: string;
  close_time: string;
  name: string;
  slug: string;
  main_image: string;
};

interface Review {
  id: number;
  rating: number;
  text: string;
  restaurant: RestaurantInfo;
}
type UserWithDetails = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
};

interface ReviewCardProps {
  review: Review;
  onEdit?: (editedReview: Review) => void;
  user: UserWithDetails;
}
type ErrorResponse = {
  errorMessage: string;
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState(review);

  const updateReview = async (updatedReview: Review, user: UserWithDetails) => {
    const payload = {
      ...updatedReview,
      restaurantId: updatedReview.restaurant.id,
      userId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
    };
    console.log('payload', payload);

    try {
      await axios.put('/api/reviews/reviews', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response && axiosError.response.data) {
        throw new Error(axiosError.response.data.errorMessage);
      } else {
        throw new Error('Unknown error occurred while updating the review.');
      }
    }
  };

  const handleSave = async () => {
    await updateReview(editedReview, user);
    onEdit?.(editedReview);
    setIsEditing(false);
  };

  return (
    <div className="w-full md:w-72 h-auto rounded overflow-hidden border cursor-pointer p-4 md:p-5 bg-white shadow-xl rounded-lg">
      <img
        src={editedReview.restaurant.main_image}
        alt=""
        className="w-full h-38 object-cover"
      />
      <div className="p-2">
        <h3 className="text-center text-xl text-gray-900 font-medium leading-8 mb-4">
          {editedReview.restaurant.name}
        </h3>
        <div className="text-center text-gray-400 text-xs font-semibold mb-4">
          <p>Reviewed by:</p>
          <p>
            {user.first_name} {user.last_name}
          </p>
        </div>
        <div className="text-center text-gray-500 mb-4">
          <p>
            {isEditing ? (
              <textarea
                value={editedReview.text}
                onChange={(e) =>
                  setEditedReview({ ...editedReview, text: e.target.value })
                }
                className="border rounded w-full bg-white p-2 h-32"
              />
            ) : (
              editedReview.text
            )}
          </p>
        </div>
        <div className="text-center text-gray-500 mb-4">
          <p>
            Rating:
            {isEditing ? (
              <input
                type="number"
                value={editedReview.rating}
                onChange={(e) =>
                  setEditedReview({ ...editedReview, rating: +e.target.value })
                }
                className="border rounded ml-2 bg-white p-2 w-20"
                max={5}
                min={0}
              />
            ) : (
              `${editedReview.rating}/5`
            )}
          </p>
        </div>
        <div className="text-center my-3 space-y-2">
          {isEditing ? (
            <button
              className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-gray-700 transition duration-300"
              onClick={handleSave}
            >
              Save
            </button>
          ) : (
            <button
              className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
              onClick={() => setIsEditing(true)}
            >
              Edit Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
