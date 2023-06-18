import RestaurantNavBar from "./components/RestaurantNavBar";
import Title from "./components/Title";
import Rating from "./components/Rating";
import Description from "./components/Description";
import Images from "./components/Images";
import Reviews from "./components/Reviews";
import ReservationCard from "./components/ReservationCard";
import { Metadata } from "next";
import db from "../../lib/db";

export const metadata: Metadata = {
  title: "Milestones Grill",
};

export interface IRestaurantDetails {
  id: number;
  name: string;
  description: string;
  images: string[];
  slug: string;
}

const getRestaurantsBySlug = async (
  slug: string
): Promise<IRestaurantDetails> => {
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      description: true,
      images: true,
      slug: true,
    },
  });

  if (!restaurant) throw new Error();

  return restaurant;
};

export default async function RestaurantDetails({
  params,
}: {
  params: { slug: string };
}) {
  const restaurant = await getRestaurantsBySlug(params.slug);

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug} />
        <Title title={restaurant.name} />
        <Rating />
        <Description description={restaurant.description} />
        <Images images={restaurant.images} />
        <Reviews />
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard />
      </div>
    </>
  );
}
