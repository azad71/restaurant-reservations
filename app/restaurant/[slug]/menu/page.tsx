import RestaurantNavBar from "../components/RestaurantNavBar";
import Menu from "../components/Menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Milestones Grill",
};

export default function RestaurantMenu() {
  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavBar />
      <Menu />
    </div>
  );
}
