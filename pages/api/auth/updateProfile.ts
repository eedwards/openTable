import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jose from 'jose';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PATCH') {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ errorMessage: 'Not authorized' });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    let payload;
    try {
      payload = await jose.jwtVerify(token, secret);
    } catch (e) {
      return res
        .status(401)
        .json({ errorMessage: 'Token verification failed' });
    }

    const { id, firstName, lastName, email, phone, city } = req.body;
    if (typeof req.body.id !== 'number') {
      return res.status(400).json({ errorMessage: 'id is not a number' });
    }

    if (typeof req.body.firstName !== 'string') {
      return res
        .status(400)
        .json({ errorMessage: 'firstName is not a string' });
    }

    if (typeof req.body.lastName !== 'string') {
      return res.status(400).json({ errorMessage: 'lastName is not a string' });
    }

    if (typeof req.body.email !== 'string') {
      return res.status(400).json({ errorMessage: 'email is not a string' });
    }

    if (typeof req.body.city !== 'string') {
      return res.status(400).json({ errorMessage: 'city is not a string' });
    }
    if (typeof req.body.phone !== 'string' || !req.body.phone) {
      return res
        .status(400)
        .json({ errorMessage: 'phone is either missing or not a string' });
    }

    const errors: string[] = [];
    const validationSchema = [
      {
        valid: validator.isLength(firstName, { min: 1, max: 30 }),
        errorMessage: 'First name must be between 1 and 30 characters',
      },
      {
        valid: validator.isLength(lastName, { min: 1, max: 30 }),
        errorMessage: 'Last name must be between 1 and 30 characters',
      },
      {
        valid: validator.isEmail(email),
        errorMessage: 'Email is invalid.',
      },
      {
        valid: phone && validator.isMobilePhone(phone),
        errorMessage: 'Phone number is invalid.',
      },
      {
        valid: validator.isLength(city, { min: 1 }),
        errorMessage: 'First name must be more than one character.',
      },
    ];

    validationSchema.forEach((item) => {
      if (!item.valid) {
        errors.push(item.errorMessage);
      }
    });
    if (errors.length) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser || existingUser.id !== parseInt(id, 10)) {
      return res
        .status(403)
        .json({ errorMessage: 'You can only update your own profile' });
    }

    try {
      let updateData = {
        first_name: firstName,
        last_name: lastName,
        email,
        city,
        phone,
      };

      // Check if password needs updating
      // if (password) {
      //   const hashedPassword = await bcrypt.hash(password, 10);
      //   updateData.password = hashedPassword;
      // }

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id, 10) },
        data: updateData,
      });

      return res.status(200).json({
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        city: updatedUser.city,
      });
    } catch (error) {
      return res.status(500).json({ errorMessage: 'Failed to update user' });
    }
  }

  return res.status(404).json({ errorMessage: 'Unknown Endpoint' });
}
