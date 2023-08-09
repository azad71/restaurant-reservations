import { Metadata } from "next";
import Form from "./components/Form";
import Header from "./components/Header";
import db from "../../lib/db";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
  searchParams: {
    date: string;
    partySize: string;
  };
}

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = await db.restaurant.findUnique({ where: { slug } });

  if (!restaurant) notFound();

  return restaurant;
};

export default async function Reserve({ params, searchParams }: Props) {
  const restaurant = await fetchRestaurantBySlug(params.slug);
  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header
          image={restaurant.main_image}
          name={restaurant.name}
          date={searchParams.date}
          partySize={searchParams.partySize}
        />
        <Form
          slug={params.slug}
          date={searchParams.date}
          partySize={searchParams.partySize}
        />
      </div>
    </div>
  );
}
