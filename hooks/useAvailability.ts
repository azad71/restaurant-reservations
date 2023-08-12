import axios from "axios";
import { useState } from "react";
import { Time } from "../utils/convertTime";

interface IUseAvailabilityParams {
  slug: string;
  day: string;
  time: string;
  partySize: string;
}

interface IData {
  time: Time;
  available: boolean;
}

export default function useAvailability() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<IData[] | null>(null);

  const fetchAvailabilities = async ({
    slug,
    day,
    time,
    partySize,
  }: IUseAvailabilityParams) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/restaurant/${slug}/availability`,
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );

      setLoading(false);
      setData(response.data);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return { loading, error, data, fetchAvailabilities };
}
