// import { NextApiRequest, NextApiResponse } from 'next';
// import validator from 'validator';
// import { PrismaClient } from '@prisma/client';
// import * as jose from 'jose';

// const prisma = new PrismaClient();

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === 'POST') {
//     const token = req.cookies.jwt;
//     if (!token) {
//       return res.status(401).json({ errorMessage: 'Not authorized' });
//     }

//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     let payload;
//     try {
//       payload = await jose.jwtVerify(token, secret);
//     } catch (e) {
//       return res
//         .status(401)
//         .json({ errorMessage: 'Token verification failed' });
//     }

//     const { rating, reviewText, restaurantId, firstName, lastName, userId } =
//       req.body;
//     console.log('req.body', req.body);
//     // console.log('payload', payload);

//     // Validate request data
//     if (typeof rating !== 'number' || rating < 1 || rating > 5) {
//       return res
//         .status(400)
//         .json({ errorMessage: 'Rating must be between 1 and 5' });
//     }

//     if (typeof reviewText !== 'string') {
//       return res.status(400).json({ errorMessage: 'Review text is not valid' });
//     }

//     if (typeof restaurantId !== 'number') {
//       return res
//         .status(400)
//         .json({ errorMessage: 'Restaurant ID is not valid' });
//     }

//     if (typeof firstName !== 'string' || typeof lastName !== 'string') {
//       return res
//         .status(400)
//         .json({ errorMessage: 'First name and last name are required' });
//     }

//     // Save review
//     try {
//       const newReview = await prisma.review.create({
//         data: {
//           text: reviewText,
//           first_name: firstName,
//           last_name: lastName,
//           rating,
//           user_id: userId, // Assuming payload contains user's ID
//           restaurant_id: restaurantId,
//         },
//       });

//       return res.status(200).json(newReview);
//     } catch (error) {
//       return res.status(500).json({ errorMessage: 'Failed to post review' });
//     }
//   }

//   return res.status(404).json({ errorMessage: 'Unknown Endpoint' });
// }

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ errorMessage: 'Not authorized' });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  let payload;
  try {
    payload = await jose.jwtVerify(token, secret);
  } catch (e) {
    return res.status(401).json({ errorMessage: 'Token verification failed' });
  }

  if (req.method === 'POST') {
    const { rating, reviewText, restaurantId, firstName, lastName, userId } =
      req.body;

    try {
      const newReview = await prisma.review.create({
        data: {
          text: reviewText,
          first_name: firstName,
          last_name: lastName,
          rating,
          user_id: userId,
          restaurant_id: restaurantId,
        },
      });

      return res.status(200).json(newReview);
    } catch (error) {
      return res.status(500).json({ errorMessage: 'Failed to post review' });
    }
  } else if (req.method === 'PUT') {
    const {
      id,
      rating,
      reviewText,
      restaurantId,
      firstName,
      lastName,
      userId,
    } = req.body;

    try {
      const existingReview = await prisma.review.findUnique({
        where: { id },
      });

      if (!existingReview) {
        return res.status(404).json({ errorMessage: 'Review not found' });
      }

      if (existingReview.user_id !== userId) {
        return res
          .status(403)
          .json({ errorMessage: 'No permission to edit this review' });
      }

      const updatedReview = await prisma.review.update({
        where: { id },
        data: {
          text: reviewText,
          first_name: firstName,
          last_name: lastName,
          rating,
          restaurant_id: restaurantId,
        },
      });

      return res.status(200).json(updatedReview);
    } catch (error) {
      return res.status(500).json({ errorMessage: 'Failed to update review' });
    }
  }

  return res.status(404).json({ errorMessage: 'Unknown Endpoint' });
}
