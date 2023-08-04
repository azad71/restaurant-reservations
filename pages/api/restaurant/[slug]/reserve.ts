import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../app/lib/db";
import { findAvailabileTables } from "../../../../services/restaurant/findAvailableTables";

interface ITableCount {
  [key: number]: number[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(404).send("Invalid route");
  }

  const { slug, day, time, partySize } = req.query as Record<string, string>;

  const {
    bookerEmail,
    bookerPhone,
    bookerFirstName,
    bookerLastName,
    bookerOccassion,
    bookerRequest,
  } = req.body;

  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
      id: true,
    },
  });

  if (!restaurant) {
    return res.status(400).json({
      errorMessage: "Restaurant not found",
    });
  }

  const isInvalidTime =
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`);

  if (isInvalidTime) {
    return res.status(400).json({
      errorMessage: "Restaurant is not open at that time",
    });
  }

  const searchTimesWithTables = await findAvailabileTables({
    time,
    day,
    res,
    restaurant,
  });

  if (!searchTimesWithTables) {
    return res.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

  const foundSearchTime = searchTimesWithTables.find(
    (table) =>
      table.date.toISOString() === new Date(`${day}T${time}`).toISOString()
  );

  if (!foundSearchTime) {
    return res.status(400).json({
      errorMessage: "Schedule not available",
    });
  }

  const tableCount: ITableCount = {
    2: [],
    4: [],
  };

  foundSearchTime.tables.forEach((table) => {
    if (table.seats === 2) {
      tableCount[2].push(table.id);
    } else {
      tableCount[4].push(table.id);
    }
  });

  const tablesToBook: number[] = [];
  let seatsRemaining = parseInt(partySize);

  while (seatsRemaining > 0) {
    if (seatsRemaining >= 3) {
      if (tableCount[4].length) {
        tablesToBook.push(tableCount[4][0]);
        tableCount[4].shift();
        seatsRemaining -= 4;
      } else {
        tablesToBook.push(tableCount[2][0]);
        tableCount[2].shift();
        seatsRemaining -= 2;
      }
    } else {
      if (tableCount[2].length) {
        tablesToBook.push(tableCount[2][0]);
        tableCount[2].shift();
        seatsRemaining -= 2;
      } else {
        tablesToBook.push(tableCount[4][0]);
        tableCount[4].shift();
        seatsRemaining -= 4;
      }
    }
  }

  const booking = await db.booking.create({
    data: {
      number_of_people: parseInt(partySize),
      booking_time: new Date(`${day}T${time}`),
      booker_email: bookerEmail,
      booker_phone: bookerPhone,
      booker_first_name: bookerFirstName,
      booker_last_name: bookerLastName,
      restaurant_id: restaurant.id,
      booker_occasion: bookerOccassion,
      booker_request: bookerRequest,
    },
  });

  const bookingsOnTableData = tablesToBook.map((table_id) => {
    return {
      table_id,
      booking_id: booking.id,
    };
  });

  await db.bookingsOnTable.createMany({
    data: bookingsOnTableData,
  });

  return res.json(booking);
}

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-02-03&time=15:00:00.000Z&partySize=8
