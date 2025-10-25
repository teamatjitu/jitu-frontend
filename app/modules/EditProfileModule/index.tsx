import { Button } from "~/components/ui/button";

export const EditProfileModule = () => {
  return (
    <main className="min-h-screen">
      <div className="px-16 py-12">
        <div className="bg-blue-50 gap-7 rounded-2xl flex max-md:flex-col flex-row px-16 py-14">
          <div className="flex flex-col md:w-screen ">
            <p className="text-blue-800 text-4xl font-semibold mb-7">
              Data Diri
            </p>
            <form action="POST" className="space-y-7">
              <div className="flex flex-col gap-2">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="border-2 border-gray-300 rounded-xl p-3 bg-gray-0 outline-none"
                  placeholder="Lorem Ipsum"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="namaLengkap">Nama Lengkap</label>
                <input
                  id="namaLengkap"
                  name="namaLengkap"
                  type="text"
                  className="border-2 border-gray-300 rounded-xl p-3 bg-gray-0 outline-none"
                  placeholder="Lorem Ipsum"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  className="border-2 border-gray-300 rounded-xl p-3 bg-gray-0 outline-none"
                  placeholder="lorem@gmail.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="nomorTelepon">Nomor Telepon</label>
                <input
                  id="nomorTelepon"
                  name="nomorTelepon"
                  type="text"
                  className="border-2 border-gray-300 rounded-xl p-3 bg-gray-0 outline-none"
                  placeholder="+62 xxxxxxxx"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="jenisKelamin">Jenis Kelamin</label>

                <select
                  name="jenisKelamin"
                  id="jenisKelamin"
                  className="border-2 border-gray-300 rounded-xl p-3 bg-gray-0 outline-none"
                >
                  <option value="" disabled hidden>
                    Pilih
                  </option>
                  <option value="pria">Pria</option>
                  <option value="wanita">Wanita</option>
                </select>
              </div>
            </form>
          </div>

          <div className=" max-md:border-t-1 md:border-r-1 border-black"></div>

          <div className="flex flex-col md:w-screen ">
            <p className="text-blue-800 text-4xl font-semibold mb-7">
              Data Sekolah
            </p>
            <form action="POST" className="space-y-7">
              <div className="flex flex-col gap-2">
                <label htmlFor="kelas">Kelas</label>
                <input
                  id="kelas"
                  name="kelas"
                  type="text"
                  className="border-2 border-gray-300 rounded-xl p-3 bg-gray-0 outline-none"
                  placeholder="Lorem Ipsum"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="provinsi">Provinsi</label>
                <input
                  id="provinsi"
                  name="provinsi"
                  type="text"
                  className="border-2 border-gray-300 rounded-xl p-3 bg-gray-0 outline-none"
                  placeholder="Lorem Ipsum"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="kota">Kota</label>
                <input
                  id="kota"
                  name="kota"
                  type="text"
                  className="border-2 border-gray-300 rounded-xl p-3 bg-gray-0 outline-none"
                  placeholder="Lorem Ipsum"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="sekolah">Sekolah</label>
                <input
                  id="sekolah"
                  name="sekolah"
                  type="text"
                  className="border-2 border-gray-300 rounded-xl p-3 bg-gray-0 outline-none"
                  placeholder="Lorem Ipsum"
                />
              </div>
            </form>
            <div className="flex justify-end mt-5">
              <Button
                className="rounded-md w-40 h-10 text-lg font-bold hover:cursor-pointer"
                variant={"blue"}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
