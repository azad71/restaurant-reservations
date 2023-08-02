import { NextApiRequest, NextApiResponse } from "next";
import times from "../../../../data/times";
import db from "../../../../app/lib/db";

interface IAvailabilityParams {
  slug: string;
  day: string;
  time: string;
  partySize: string;
}

interface IBookingTableObj {
  [key: string]: {
    [key: number]: boolean;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(404).json({ message: "Invalid routes" });

  const { slug, day, time, partySize } =
    req.query as unknown as IAvailabilityParams;

  if (!slug || !day || !time || !partySize) {
    return res.status(400).json({ errorMessage: "Invalid data provided" });
  }

  const searchTimes = times.find((t) => t.time === time)?.searchTimes;

  if (!searchTimes) {
    return res.status(400).json({ errorMessage: "Invalid time slot provided" });
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

  const bookingTableObj: IBookingTableObj = {};

  bookings.forEach((booking) => {
    bookingTableObj[booking.booking_time.toISOString()] = booking.tables.reduce(
      (obj, table) => {
        return {
          ...obj,
          [table.table_id]: true,
        };
      },
      {}
    );
  });

  const restaurants = await db.restaurant.findUnique({
    where: { slug },
    select: { tables: true },
  });

  if (!restaurants) {
    return res.status(400).json({ errorMessage: "Invalid data provided" });
  }

  const tables = restaurants.tables;

  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  searchTimesWithTables.forEach((searchObj) => {
    searchObj.tables = searchObj.tables.filter((table) => {
      const hasBooked = bookingTableObj[searchObj.date.toISOString()];
      if (hasBooked) {
        if (hasBooked[table.id]) return false;
      }
      return true;
    });
  });

  return res.json({
    searchTimes,
    bookings,
    bookingTableObj,
    searchTimesWithTables,
  });
}
