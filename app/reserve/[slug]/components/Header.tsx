import { Time, convertToDisplayTime } from "../../../../utils/convertTime";

interface Props {
  image: string;
  name: string;
  date: string;
  partySize: string;
}

export default function Header({ image, name, date, partySize }: Props) {
  const [day, time] = date.split("T");

  return (
    <div>
      <h3 className="font-bold">You're almost done!</h3>
      <div className="mt-5 flex">
        <img src={image} alt="" className="w-32 h-18 rounded" />
        <div className="ml-4">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex mt-3">
            <p className="mr-6">{new Date(day).toDateString()}</p>
            <p className="mr-6">{convertToDisplayTime(time as Time)}</p>
            <p className="mr-6">{partySize} people</p>
          </div>
        </div>
      </div>
    </div>
  );
}
