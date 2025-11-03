import { Pen } from "~/components/icons";
import { Calendar } from "lucide-react";
import { useLoaderData } from "react-router";
import { pesertaData } from "./PesertaTable";

export const TryoutCard = () => {
  const tryout = useLoaderData<Tryout>();

  const publishedDate = new Date(tryout.publishedAt);
  const closedDate = new Date(tryout.closedAt);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedPublishedDate = new Intl.DateTimeFormat(
    "en-US",
    options
  ).format(publishedDate);
  const formattedClosedDate = new Intl.DateTimeFormat("en-US", options).format(
    closedDate
  );

  return (
    <>
      <div className="shadow-xl w-[90rem] mt-5 rounded-2xl">
        <div className="w-full bg-[#4292FD] h-10 rounded-t-2xl" />
        <div className="px-4 py-6 text-blue-800">
          <div className="flex flex-row gap-3">
            <p className="mb-5 font-semibold text-2xl">{tryout.name}</p>
            <Pen className="hover:cursor-pointer" />
          </div>
          <div className="text-sm font-bold space-y-2 uppercase">
            <div>
              <p>Jumlah Peserta: {pesertaData.length}</p>
            </div>
            <div>
              <p className="text-yellow-500 font-bold text-sm">Tanggal </p>
              <div className="flex flex-row gap-3 items-center">
                <p>
                  {" "}
                  {formattedPublishedDate} - {formattedClosedDate}
                </p>
                <Calendar color="#285898" className="hover:cursor-pointer" />
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
            <button className="text-white mt-6 bg-[#4292FD] w-full py-2 rounded-lg hover:cursor-pointer">
              Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
