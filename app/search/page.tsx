import { PRICE } from "@prisma/client";
import Header from "../components/Header";
import RestaurantCard from "./components/RestaurantCard";
import SearchSideBar from "./components/SearchSideBar";
import { Metadata } from "next";
import db from "../lib/db";

export interface ISearchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

export const metadata: Metadata = {
  title: "Search Restaurants",
};

const getRestaurantsByFilter = async ({
  city,
  cuisine,
  price,
}: ISearchParams) => {
  const where: any = {};

  if (city) {
    where["location"] = {
      name: {
        equals: city.toLowerCase(),
      },
    };
  }

  if (cuisine) {
    where["cuisine"] = {
      name: {
        equals: cuisine.toLowerCase(),
      },
    };
  }

  if (price) {
    where["price"] = {
      equals: price,
    };
  }

  const select = {
    id: true,
    name: true,
    main_image: true,
    price: true,
    cuisine: { select: { name: true } },
    location: { select: { name: true } },
    slug: true,
    reviews: true,
  };

  return db.restaurant.findMany({
    where,
    select,
  });
};

const fetchCuisines = async () => {
  return db.cuisine.findMany();
};

const fetchLocations = async () => {
  return db.location.findMany();
};

export default async function Search({
  searchParams,
}: {
  searchParams: ISearchParams;
}) {
  const restaurants = await getRestaurantsByFilter(searchParams);
  const cuisines = await fetchCuisines();
  const locations = await fetchLocations();

  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          cuisines={cuisines}
          locations={locations}
          searchParams={searchParams}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <p>Sorry, we found no restaurants in this area</p>
          )}
        </div>
      </div>
    </>
  );
}
