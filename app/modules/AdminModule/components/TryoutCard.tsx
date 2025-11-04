import { Link } from "react-router";
type TryoutCardProps = {
  id: string;
  nama: string;
  tanggalMulai: string;
  tanggalTutup: string;
};

export const TryoutCard = ({
  id,
  nama,
  tanggalMulai,
  tanggalTutup,
}: TryoutCardProps) => {
  return (
    <>
      <div className="shadow-xl w-fit rounded-2xl">
        <div className="w-full bg-[#4292FD] h-10 rounded-t-2xl" />
        <div className="px-4 py-6 text-blue-800">
          <p className="mb-5 font-semibold text-2xl">{nama}</p>
          <div>
            <div className="text-sm font-bold mb-4">
              <p>Jumlah Peserta: jumlah</p>
              <p>
                {tanggalMulai} - {tanggalTutup}
              </p>
            </div>
            <div className="text-sm">
              <p className="text-yellow-500 font-bold text-sm">Skolastik: </p>
              <ul className="list-disc ml-6">
                <li> Penalaran Umum</li>
                <li> Pengetahuan dan Pemahaman Umum</li>
                <li> Pemahaman Bacaan dan Menulis</li>
                <li> Pengetahuan Kuantitatif</li>
              </ul>
              <p className="text-yellow-500 font-bold text-sm">Literasi:</p>
              <ul className="list-disc ml-6">
                <li>Literasi Bahasa Indosia</li>
                <li>Literasi Bahasa Inggris</li>
                <li>Penalaran Matematika</li>
              </ul>
            </div>
            <Link to={`/admin/edit-tryout/${id}`}>
              <button className="text-white mt-6 bg-[#4292FD] w-full py-2 rounded-lg hover:cursor-pointer">
                Detail
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
