"use client";
import { useState } from "react";
import { CircleUser } from "lucide-react";
const Navbar = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <nav className="flex flow-row w-screen px-8 py-8 items-center justify-between bg-blue-800 font-poppins text-white">
        <div className="flex flex-row items-center gap-6">
          <img src="/logo/jitu.png" alt="" />
          <div className="flex flex-row gap-5 font-medium text-xl ">
            <p className=" hover:text-yellow-100 hover:cursor-pointer">Halo</p>
            <p className="hover:text-yellow-100 hover:cursor-pointer">
              Collection
            </p>
            <p className="hover:text-yellow-100 hover:cursor-pointer">
              Leaderboard
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-center items-center font-medium text-lg">
          <p>Hi, Username</p>
          <CircleUser className="size-8" />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
