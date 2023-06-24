import RestaurantNavBar from "../components/RestaurantNavBar";
import Menu from "../components/Menu";
import { Metadata } from "next";
import db from "../../../lib/db";

export const metadata: Metadata = {
  title: "Menu | Milestones Grill",
};

const fetchRestaurantMenu = async (slug: string) => {
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: { items: true },
  });

  if (!restaurant) throw new Error("No restaurant menu found");

  return restaurant.items;
};

export default async function RestaurantMenu({
  params,
}: {
  params: { slug: string };
}) {
  const menu = await fetchRestaurantMenu(params.slug);
  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavBar slug={params.slug} />
      <Menu menu={menu} />
    </div>
  );
}
