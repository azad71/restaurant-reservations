import Header from "../components/Header";
import Navbar from "../components/Navbar";
import RestaurantCard from "./components/RestaurantCard";
import SearchSideBar from "./components/SearchSideBar";

export default function Search() {
  return (
    <main className="bg-gray-100 min-h-screen w-screen">
      <main className="max-w-screen-xl m-auto bg-white">
        <Navbar />
        <Header />
        <div className="flex py-4 m-auto w-2/3 justify-between items-start">
          <SearchSideBar />

          <div className="w-5/6">
            <RestaurantCard />
          </div>
        </div>
      </main>
    </main>
  );
}
