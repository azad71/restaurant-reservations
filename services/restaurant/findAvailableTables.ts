import { NextApiResponse } from "next";
import times from "../../data/times";
import db from "../../app/lib/db";
import { Table } from "@prisma/client";

interface IFindAvailableTables {
  time: string;
  day: string;
  res: NextApiResponse;
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
  };
}

interface IBookingTableObj {
  [key: string]: { [key: number]: true };
}

export const findAvailabileTables = async ({
  time,
  day,
  res,
  restaurant,
}: IFindAvailableTables) => {
  const searchTimes = times.find((t) => {
    return t.time === time;
  })?.searchTimes;

  if (!searchTimes) {
    return res.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

  const bookings = await db.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTablesObj: IBookingTableObj = {};

  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce((obj, table) => {
        return {
          ...obj,
          [table.table_id]: true,
        };
      }, {});
  });

  const tables = restaurant.tables;

  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      const hasTable = bookingTablesObj[t.date.toISOString()];
      if (hasTable) {
        if (hasTable[table.id]) return false;
      }
      return true;
    });
  });

  return searchTimesWithTables;
};
