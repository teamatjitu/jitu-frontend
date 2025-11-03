import { CircleUser } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "~/lib/auth-client";
import { useNavigate } from "react-router";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SessionInfo {
  id: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  userId: string;
}

interface SessionData {
  session: SessionInfo;
  user: User;
}

const Navbar = () => {
  // const { data: session, error } = authClient.useSession();
  // const [session, setSession] = useState<SessionData | null>(null);
  // const router = useNavigate();

  // useEffect(() => {
  //   const getSession = async () => {
  //     try {
  //       const session = await fetch(
  //         "http://localhost:3000/api/auth/get-session",
  //         {
  //           credentials: "include",
  //         }
  //       );
  //       const sessionData = await session.json();
  //       if (!sessionData) router("/login");
  //       setSession(sessionData);
  //     } catch (error) {
  //       router("/login");
  //     }
  //   };

  //   getSession();
  // }, []);

  return (
    <>
      <nav className="flex flow-row min-w-screen px-8 py-8 items-center  justify-between bg-blue-800 font-poppins text-white">
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
          <p>Hi, Sayang</p>
          <CircleUser className="size-8" />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
