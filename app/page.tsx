import { Metadata } from "next";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";

export const metadata: Metadata = {
  title: "Restaurant Reservations",
};

export default function Home() {
  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        <RestaurantCard />
      </div>
    </main>
  );
}
