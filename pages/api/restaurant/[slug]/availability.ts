import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { times } from '../../../../data';
import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };
    if (!slug || !day || !time || !partySize) {
      return res.status(400).json({ errorMessage: 'Invalid data provided' });
    }
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
        name: true,
      },
    });
    if (!restaurant) {
      return res.status(400).json({ errorMessage: 'Invalid data provided' });
    }

    const searchTimesWithTables = await findAvailableTables({
      day,
      time,
      res,
      restaurant,
    });
    if (!searchTimesWithTables) {
      return res.status(400).json({ errorMessage: 'Invalid data provided' });
    }

    const availabilities = searchTimesWithTables
      .map((t) => {
        const sumSeats = t.tables.reduce((sum, table) => {
          return sum + table.seats;
        }, 0);
        return {
          time: t.time,
          isAvailable: sumSeats >= parseInt(partySize),
        };
      })
      .filter((availabilty) => {
        const timeIsAfterOpeningHours =
          new Date(`${day}T${availabilty.time}`) >=
          new Date(`${day}T${restaurant.open_time}`);
        const timeIsBeforeClosingHours =
          new Date(`${day}T${availabilty.time}`) <=
          new Date(`${day}T${restaurant.close_time}`);
        return timeIsAfterOpeningHours && timeIsBeforeClosingHours;
      });

    return res.json(availabilities);
  }
}
