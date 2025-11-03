"use client";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

import ChartBarInteractive from "./components/chart";
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

const getDefaultAvatar = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random&color=fff`;
};

export const ProfileModule = () => {
  const defaultPicture = getDefaultAvatar("DekDepe");
  const [isPremium, setIsPremium] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);
  const router = useNavigate();

  // const { data: session } = authClient.useSession();

  // console.log(session);
  const dataDiri = {
    nama: "Dek Depe",
    kelamin: "Jawa Barat",
    telp: "01234567889",
  };

  const dataSekolah = {
    asal: "Harvard School & Grooming",
    domisili: "Jalan Magetan No. 32",
    kelas: "DO",
  };

  return (
    <main className="min-h-screen px-20 py-20  flex flex-col">
      <h1 className="text-6xl font-semibold text-blue-800">Profile</h1>
      <div className="flex gap-10 justify-between max-md:flex-wrap md:flex-row mt-12 w-full ">
        <div className="w-3xl flex flex-col gap-10">
          {/* User Picture */}
          <div className="flex flex-row px-4 shadow-lg rounded-3xl border items-center text-blue-800 border-blue-950 py-5 gap-10 bg-blue-50">
            <img
              src={defaultPicture}
              alt="user picture"
              className="max-xl:w-16 max-xl:h-16 w-32 h-32 rounded-full"
            />
            <div className="space-y-1">
              <h4 className="font-bold text-2xl max-xl:text-lg">
                Halo, Dek daka
              </h4>
              <p className="max-lg:text-sm">DekDepe123@ui.ac.id</p>
              <div className="w-fit space-y-2">
                <div className="flex flex-row gap-2.5">
                  <p className="bg-white w-fit px-2.5 rounded-2xl text-center">
                    Free
                  </p>
                  <p className="bg-yellow-100 w-fit px-2.5 rounded-2xl text-center">
                    Premium
                  </p>
                </div>
                <Link to={"/edit-profile"}>
                  <Button
                    className="w-full rounded-xl hover:cursor-pointer"
                    variant={"blue"}
                  >
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Data Diri */}
          <div className="flex flex-col px-4 shadow-lg rounded-3xl border text-blue-800 border-blue-950 py-5 gap-3 bg-blue-50">
            <h5 className="font-semibold text-2xl">Data Diri</h5>
            <div className="bg-white text-black px-2.5 py-2.5 rounded-lg border-2 border-gray-300">
              <p>{dataDiri.nama}</p>
              <hr className="border-black mb-3" />
              <p>{dataDiri.kelamin}</p>
              <hr className="border-black mb-3" />
              <p>{dataDiri.telp}</p>
              <hr className="border-black " />
            </div>
          </div>

          {/* Data Sekolah */}
          <div className="flex flex-col px-4 shadow-lg rounded-3xl border text-blue-800 border-blue-950 py-5 gap-3 bg-blue-50">
            <h5 className="font-semibold text-2xl">Data Sekolah</h5>
            <div className="bg-white text-black px-2.5 py-2.5 rounded-lg border-2 border-gray-300">
              <p>{dataSekolah.asal}</p>
              <hr className="border-black mb-3" />
              <p>{dataSekolah.domisili}</p>
              <hr className="border-black mb-3" />
              <p>{dataSekolah.kelas}</p>
              <hr className="border-black " />
            </div>
          </div>
        </div>
        {/* Chart Div */}
        <div className="w-[60%] max-md:w-full">
          <ChartBarInteractive />
        </div>
      </div>
    </main>
  );
};
