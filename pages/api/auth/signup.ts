import { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { setCookie } from 'cookies-next';

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, phoneNumber, city, password } =
      req.body;
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
        valid: validator.isMobilePhone(phoneNumber),
        errorMessage: 'Phone number is invalid.',
      },
      {
        valid: validator.isLength(city, { min: 1 }),
        errorMessage: 'First name must be more than one character.',
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: 'Password is invalid.',
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

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      return res.status(400).json({ errorMessage: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        city,
        email,
        phone: phoneNumber,
      },
    });

    const alg = 'HS256';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({
      email: user.email,
    })
      .setProtectedHeader({ alg })
      .setExpirationTime('24h')
      .sign(secret);

    setCookie('jwt', token, { req, res, maxAge: 60 * 6 * 24 });

    return res.status(200).json({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    });
  }
  return res.status(404).json({ errorMessage: 'Unknown Endpoint' });
}
