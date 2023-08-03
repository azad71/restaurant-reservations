"use client";

import DatePicker from "react-datepicker";
import partySizeData from "../../../../data/partySize";
import { lazy, useState } from "react";
import times from "../../../../data/times";
import useAvailability from "../../../../hooks/useAvailability";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { convertToDisplayTime } from "../../../../utils/convertTime";

interface Props {
  openTime: string;
  closeTime: string;
  slug: string;
}

export default function ReservationCard({ openTime, closeTime, slug }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);
  const [partySize, setPartySize] = useState("2");

  const { loading, data, error, fetchAvailabilities } = useAvailability();

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
  };

  const handleClick = () => {
    fetchAvailabilities({
      slug,
      day,
      time,
      partySize,
    });
  };

  const filterRestaurantSchedule = () => {
    const availableSchedules: typeof times = [];
    times.forEach((schedule) => {
      if (schedule.time >= openTime && schedule.time <= closeTime) {
        availableSchedules.push(schedule);
      }
    });

    return availableSchedules;
  };

  console.log({ data });

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          className="py-3 border-b font-light"
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
        >
          {partySizeData.map((size, idx) => (
            <option key={idx} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          <DatePicker
            className="py-3 border-b font-light text-reg w-24"
            wrapperClassName="w-[48%]"
            dateFormat="MMMM d"
            selected={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name=""
            id=""
            className="py-3 border-b font-light"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {filterRestaurantSchedule().map((schedule, idx) => (
              <option key={idx} value={schedule.time}>
                {schedule.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
        </button>
      </div>
      {data?.length ? (
        <div className="mt-4">
          <p className="text-reg">Select a time</p>
          <div className="flex flex-wrap mt-2">
            {data.map((table) =>
              table.available ? (
                <Link
                  href={`/reserve/${slug}?date=${day}T${table.time}&partySize=${partySize}`}
                  className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-2 mr-3 rounded"
                >
                  <p className="text-sm font-bold">
                    {convertToDisplayTime(table.time)}
                  </p>
                </Link>
              ) : (
                <p className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3"></p>
              )
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
