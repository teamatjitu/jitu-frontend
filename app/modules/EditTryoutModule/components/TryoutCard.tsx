"use client";
import { useState } from "react";
import { Pen } from "~/components/icons";
import { Calendar } from "lucide-react";
import { useLoaderData } from "react-router";
import { pesertaData } from "./PesertaTable";
import { updateTryout } from "~/api/admin";
import { Link } from "react-router";

type TryoutCardProps = {
  tryout: Tryout;
};

export const TryoutCard = ({ tryout }: TryoutCardProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(tryout.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);

  const toLocalDatetimeInput = (iso: string) => {
    const date = new Date(iso);
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in ms
    const localISOTime = new Date(date.getTime() - tzOffset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  const [publishedAt, setPublishedAt] = useState(
    toLocalDatetimeInput(tryout.publishedAt.toString())
  );
  const [closedAt, setClosedAt] = useState(
    toLocalDatetimeInput(tryout.closedAt.toString())
  );

  const formattedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSaveName = async () => {
    try {
      setLoading(!loading);
      await updateTryout(tryout.id, {
        name,
      });
      setIsEditingName(!isEditingName);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(!loading);
    }
  };

  const handleSaveDate = async () => {
    setLoading(true);
    try {
      await updateTryout(tryout.id, {
        publishedAt: new Date(publishedAt).toISOString(),
        closedAt: new Date(closedAt).toISOString(),
      });
      setIsEditingDate(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update date";
      alert(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="shadow-xl w-full max-w-[90rem] mt-5 rounded-2xl">
        <div className="w-full bg-[#4292FD] h-10 rounded-t-2xl" />
        <div className="px-4 py-6 text-blue-800">
          <div className="flex flex-row gap-3">
            {isEditingName ? (
              <input
                className="border rounded px-2 mb-5 text-2xl font-semibold"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                autoFocus
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") handleSaveName();
                }}
              />
            ) : (
              <p className="mb-5 font-semibold text-2xl">{name}</p>
            )}
            <Pen
              className="hover:cursor-pointer"
              onClick={() => {
                setIsEditingName(!isEditingName);
              }}
            />
          </div>
          <div className="text-sm font-bold space-y-2 uppercase">
            <div>
              <p>Jumlah Peserta: {pesertaData.length}</p>
            </div>
            <div>
              <p className="text-yellow-500 font-bold text-sm">tanggal </p>
              <div className="flex flex-row gap-3 items-center">
                {isEditingDate ? (
                  <div
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") handleSaveDate();
                    }}
                    className="space-x-4"
                  >
                    <input
                      type="datetime-local"
                      className="border rounded px-2 py-1"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      disabled={loading}
                    />
                    <input
                      type="datetime-local"
                      className="border rounded px-2 py-1"
                      value={closedAt}
                      onChange={(e) => setClosedAt(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                ) : (
                  <p>
                    {" "}
                    {formattedDate(publishedAt)} - {formattedDate(closedAt)}
                  </p>
                )}
                <Calendar
                  color="#285898"
                  className="hover:cursor-pointer"
                  onClick={() => setIsEditingDate(!isEditingDate)}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-yellow-500 font-bold text-sm">Skolastik: </p>
                <ul className="list-disc ml-6">
                  <li> Penalaran Umum - 30/30 soal - 30 menit</li>
                  <li>
                    {" "}
                    Pengetahuan dan Pemahaman Umum - 20/20 soal - 15 menit
                  </li>
                  <li> Pemahaman Bacaan dan Menulis - 20/20 soal - 25 menit</li>
                  <li> Pengetahuan Kuantitatif - 20/20 soal - 20 menit</li>
                </ul>
              </div>
              <div>
                <p className="text-yellow-500 font-bold text-sm">Literasi:</p>
                <ul className="list-disc ml-6">
                  <li>Literasi Bahasa Indosia - 30/30 soal - 42.5 menit</li>
                  <li>Literasi Bahasa Inggris - 20/20 soal - 30 menit</li>
                  <li>Penalaran Matematika - 20/20 soal - 42.5 menit</li>
                </ul>
              </div>
            </div>
            <Link to={`/admin/add-soal/${tryout.id}/pu`}>
              <button className="text-white mt-6 bg-[#4292FD] w-full py-2 rounded-lg hover:cursor-pointer">
                Edit
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
