export const pesertaData = [
  {
    nama: "Raka Saputra",
    PU: 82,
    PPU: 77,
    PBM: 90,
    PK: 88,
    LBI: 85,
    LBE: 79,
    PM: 84,
  },
  {
    nama: "Nadia Pratama",
    PU: 91,
    PPU: 80,
    PBM: 83,
    PK: 87,
    LBI: 88,
    LBE: 92,
    PM: 89,
  },
  {
    nama: "Farhan Iqbal",
    PU: 70,
    PPU: 74,
    PBM: 78,
    PK: 72,
    LBI: 69,
    LBE: 75,
    PM: 73,
  },
  {
    nama: "Alya Wibowo",
    PU: 95,
    PPU: 93,
    PBM: 90,
    PK: 94,
    LBI: 91,
    LBE: 89,
    PM: 92,
  },
  {
    nama: "Bagas Pradipta",
    PU: 68,
    PPU: 71,
    PBM: 70,
    PK: 73,
    LBI: 67,
    LBE: 69,
    PM: 72,
  },
  {
    nama: "Dewi Anggraini",
    PU: 86,
    PPU: 84,
    PBM: 85,
    PK: 83,
    LBI: 88,
    LBE: 87,
    PM: 84,
  },
  {
    nama: "Ilham Rizky",
    PU: 79,
    PPU: 81,
    PBM: 80,
    PK: 78,
    LBI: 77,
    LBE: 82,
    PM: 80,
  },
  {
    nama: "Citra Lestari",
    PU: 90,
    PPU: 88,
    PBM: 91,
    PK: 92,
    LBI: 90,
    LBE: 93,
    PM: 89,
  },
  {
    nama: "Yoga Aditya",
    PU: 85,
    PPU: 82,
    PBM: 84,
    PK: 83,
    LBI: 80,
    LBE: 81,
    PM: 85,
  },
  {
    nama: "Tasya Marlina",
    PU: 92,
    PPU: 90,
    PBM: 88,
    PK: 91,
    LBI: 93,
    LBE: 94,
    PM: 90,
  },
];

export const PesertaTable = () => {
  return (
    <div className=" shadow-xl overflow-x-auto max-w-full mt-12">
      <table className="w-full max-w-[90rem] overflow-hidden rounded-2xl text-sm text-center border-collapse">
        <thead>
          <tr className="bg-blue-500  text-white font-bold">
            <th className="px-4 py-3 rounded-l-xl">Nama Lengkap</th>
            <th className="px-4 py-3">PENALARAN UMUM</th>
            <th className="px-4 py-3">PENGETAHUAN DAN PEMAHAMAN UMUM</th>
            <th className="px-4 py-3">PEMAHAMAN BACA DAN MENULIS</th>
            <th className="px-4 py-3">PENGETAHUAN KUANTITATIF</th>
            <th className="px-4 py-3">LITERASI BAHASA INDONESIA</th>
            <th className="px-4 py-3">LITERASI BAHASA INGGRIS</th>
            <th className="px-4 py-3">PENALARAN MATEMATIKA</th>
            <th className="px-4 py-3 rounded-r-xl">Rata Rata</th>
          </tr>
        </thead>
        <tbody>
          {pesertaData.map((p, i) => {
            const avg = (
              (p.PU + p.PPU + p.PBM + p.PK + p.LBI + p.LBE + p.PM) /
              7
            ).toFixed(1);

            return (
              <tr
                key={i}
                className="odd:bg-white even:bg-gray-100 hover:bg-blue-50 transition"
              >
                <td className="px-4 py-3 font-medium">{p.nama}</td>
                <td className="px-4 py-3">{p.PU}</td>
                <td className="px-4 py-3">{p.PPU}</td>
                <td className="px-4 py-3">{p.PBM}</td>
                <td className="px-4 py-3">{p.PK}</td>
                <td className="px-4 py-3">{p.LBI}</td>
                <td className="px-4 py-3">{p.LBE}</td>
                <td className="px-4 py-3">{p.PM}</td>
                <td className="px-4 py-3 font-semibold text-blue-700">{avg}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
