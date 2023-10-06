import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  const {
    bookerEmail,
    bookerPhoneNumber,
    bookerFirstName,
    bookerLastName,
    bookerOccasion,
    bookerRequest,
    bookerId,
    reservationId,
  } = req.body;

  if (req.method === 'POST') {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const {
      bookerEmail,
      bookerPhoneNumber,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest,
      bookerId,
    } = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
        id: true,
        name: true,
        main_image: true,
      },
    });
    if (!restaurant) {
      return res.status(404).json({ errorMessage: 'Restaurant not found' });
    }

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return res
        .status(400)
        .json({ errorMessage: 'Restaurant is not open at that time.' });
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
    const searchTimeWithTables = await searchTimesWithTables.find((t) => {
      return t.date.toISOString() === new Date(`${day}T${time}`).toISOString();
    });
    if (!searchTimeWithTables) {
      return res
        .status(400)
        .json({ errorMessage: 'No availability. Cannot book.' });
    }

    const tablesCount: { 2: number[]; 4: number[] } = { 2: [], 4: [] };

    searchTimeWithTables.tables.forEach((table) => {
      if (table.seats === 2) {
        tablesCount[2].push(table.id);
      } else if (table.seats === 4) {
        tablesCount[4].push(table.id);
      }
    });

    const tablesToBook: number[] = [];
    let seatsRemaining = parseInt(partySize);
    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount[4].length) {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining = seatsRemaining - 4;
        } else {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining = seatsRemaining - 2;
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining = seatsRemaining - 2;
        } else {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining = seatsRemaining - 4;
        }
      }
    }
    const restaurantName = restaurant.name;
    const booking = await prisma.booking.create({
      data: {
        booking_time: new Date(`${day}T${time}`),
        number_of_people: parseInt(partySize),
        booker_email: bookerEmail,
        booker_phone: bookerPhoneNumber,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        booker_occasion: bookerOccasion,
        booker_request: bookerRequest,
        restaurant_id: restaurant.id,
        booker_id: bookerId,
        restaurant_name: restaurantName,
        image: restaurant.main_image,
      },
    });

    const bookingsOnTablesData = tablesToBook.map((table_id) => {
      return {
        table_id,
        booking_id: booking.id,
      };
    });

    await prisma.bookingsOnTables.createMany({
      data: bookingsOnTablesData,
    });

    return res.json(booking);
  }

  if (req.method === 'PUT') {
    if (!reservationId) {
      return res
        .status(400)
        .json({ errorMessage: 'Reservation ID is required for edits.' });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: reservationId },
    });

    if (!existingBooking) {
      return res.status(404).json({ errorMessage: 'Reservation not found' });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
        id: true,
        name: true,
        main_image: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({ errorMessage: 'Restaurant not found' });
    }

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return res
        .status(400)
        .json({ errorMessage: 'Restaurant is not open at that time.' });
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

    const searchTimeWithTables = await searchTimesWithTables.find((t) => {
      return t.date.toISOString() === new Date(`${day}T${time}`).toISOString();
    });

    if (!searchTimeWithTables) {
      return res
        .status(400)
        .json({ errorMessage: 'No availability. Cannot book.' });
    }

    const tablesCount: { 2: number[]; 4: number[] } = { 2: [], 4: [] };
    searchTimeWithTables.tables.forEach((table) => {
      if (table.seats === 2) {
        tablesCount[2].push(table.id);
      } else if (table.seats === 4) {
        tablesCount[4].push(table.id);
      }
    });

    const tablesToBook: number[] = [];
    let seatsRemaining = parseInt(partySize);
    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount[4].length) {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining = seatsRemaining - 4;
        } else {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining = seatsRemaining - 2;
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining = seatsRemaining - 2;
        } else {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining = seatsRemaining - 4;
        }
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: reservationId },
      data: {
        booking_time: new Date(`${day}T${time}`),
        number_of_people: parseInt(partySize),
        booker_email: bookerEmail,
        booker_phone: bookerPhoneNumber,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        booker_occasion: bookerOccasion,
        booker_request: bookerRequest,
      },
    });

    const bookingsOnTablesData = tablesToBook.map((table_id) => {
      return {
        table_id,
        booking_id: updatedBooking.id,
      };
    });

    await prisma.bookingsOnTables.createMany({
      data: bookingsOnTablesData,
    });

    return res.json(updatedBooking);
  }

  return res.status(405).json({ errorMessage: 'Method not allowed' });
}

// import { PrismaClient } from '@prisma/client';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';

// const prisma = new PrismaClient();

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === 'POST') {
//     const { slug, day, time, partySize } = req.query as {
//       slug: string;
//       day: string;
//       time: string;
//       partySize: string;
//     };

//     const {
//       bookerEmail,
//       bookerPhoneNumber,
//       bookerFirstName,
//       bookerLastName,
//       bookerOccasion,
//       bookerRequest,
//       bookerId,
//     } = req.body;

//     const restaurant = await prisma.restaurant.findUnique({
//       where: {
//         slug,
//       },
//       select: {
//         tables: true,
//         open_time: true,
//         close_time: true,
//         id: true,
//         name: true,
//         main_image: true,
//       },
//     });
//     if (!restaurant) {
//       return res.status(404).json({ errorMessage: 'Restaurant not found' });
//     }

//     if (
//       new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
//       new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
//     ) {
//       return res
//         .status(400)
//         .json({ errorMessage: 'Restaurant is not open at that time.' });
//     }
//     const searchTimesWithTables = await findAvailableTables({
//       day,
//       time,
//       res,
//       restaurant,
//     });
//     if (!searchTimesWithTables) {
//       return res.status(400).json({ errorMessage: 'Invalid data provided' });
//     }
//     const searchTimeWithTables = await searchTimesWithTables.find((t) => {
//       return t.date.toISOString() === new Date(`${day}T${time}`).toISOString();
//     });
//     if (!searchTimeWithTables) {
//       return res
//         .status(400)
//         .json({ errorMessage: 'No availability. Cannot book.' });
//     }

//     const tablesCount: { 2: number[]; 4: number[] } = { 2: [], 4: [] };

//     searchTimeWithTables.tables.forEach((table) => {
//       if (table.seats === 2) {
//         tablesCount[2].push(table.id);
//       } else if (table.seats === 4) {
//         tablesCount[4].push(table.id);
//       }
//     });

//     const tablesToBook: number[] = [];
//     let seatsRemaining = parseInt(partySize);
//     while (seatsRemaining > 0) {
//       if (seatsRemaining >= 3) {
//         if (tablesCount[4].length) {
//           tablesToBook.push(tablesCount[4][0]);
//           tablesCount[4].shift();
//           seatsRemaining = seatsRemaining - 4;
//         } else {
//           tablesToBook.push(tablesCount[2][0]);
//           tablesCount[2].shift();
//           seatsRemaining = seatsRemaining - 2;
//         }
//       } else {
//         if (tablesCount[2].length) {
//           tablesToBook.push(tablesCount[2][0]);
//           tablesCount[2].shift();
//           seatsRemaining = seatsRemaining - 2;
//         } else {
//           tablesToBook.push(tablesCount[4][0]);
//           tablesCount[4].shift();
//           seatsRemaining = seatsRemaining - 4;
//         }
//       }
//     }
//     const restaurantName = restaurant.name;
//     const booking = await prisma.booking.create({
//       data: {
//         booking_time: new Date(`${day}T${time}`),
//         number_of_people: parseInt(partySize),
//         booker_email: bookerEmail,
//         booker_phone: bookerPhoneNumber,
//         booker_first_name: bookerFirstName,
//         booker_last_name: bookerLastName,
//         booker_occasion: bookerOccasion,
//         booker_request: bookerRequest,
//         restaurant_id: restaurant.id,
//         booker_id: bookerId,
//         restaurant_name: restaurantName,
//         image: restaurant.main_image,
//       },
//     });

//     const bookingsOnTablesData = tablesToBook.map((table_id) => {
//       return {
//         table_id,
//         booking_id: booking.id,
//       };
//     });

//     await prisma.bookingsOnTables.createMany({
//       data: bookingsOnTablesData,
//     });

//     return res.json(booking);
//   }
// }
