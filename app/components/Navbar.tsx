"use client";
import { CircleUser } from "lucide-react";
import { authClient } from "~/lib/auth-client";

const Navbar = () => {
  const { data: session, error } = authClient.useSession();

  return (
    <>
      <nav className="flex flow-row w-screen px-8 py-8 items-center  justify-between bg-blue-800 font-poppins text-white">
        <div className="flex flex-row items-center gap-6">
          <img src="/logo/jitu.png" alt="jitu logo" className="w-32" />
          <div className="flex flex-row gap-5 font-medium text-xl max-md:text-sm ">
            <p className=" hover:text-yellow-100 hover:cursor-pointer">Home</p>
            <p className="hover:text-yellow-100 hover:cursor-pointer">
              Collection
            </p>
            <p className="hover:text-yellow-100 hover:cursor-pointer">
              Leaderboard
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-center items-center font-medium max-md:text-sm text-lg">
          <p>Hi, {session?.user.name}</p>
          <p>{error?.message}</p>
          <p>Halo aku sore</p>
          <CircleUser className="size-8" />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
