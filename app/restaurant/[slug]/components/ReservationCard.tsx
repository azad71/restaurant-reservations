"use client";

import DatePicker from "react-datepicker";
import partySize from "../../../../data/partySize";
import { useState } from "react";
import times from "../../../../data/times";

export default function ReservationCard({
  openTime,
  closeTime,
}: {
  openTime: string;
  closeTime: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateChange = (date: Date | null) => {
    if (date) {
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
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

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select name="" className="py-3 border-b font-light" id="">
          {partySize.map((size, idx) => (
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
          <select name="" id="" className="py-3 border-b font-light">
            {filterRestaurantSchedule().map((schedule, idx) => (
              <option key={idx} value={schedule.time}>
                {schedule.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button className="bg-red-600 rounded w-full px-4 text-white font-bold h-16">
          Find a Time
        </button>
      </div>
    </div>
  );
}
