import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const RegisterModule = () => {
  return (
    <main className="flex bg-[linear-gradient(to_bottom_right,_#FBFBFB_0%,_#FBFBFB_60%,_#FEBD03_200%)]  justify-between items-center min-h-screen">
      <div className="w-1/2 h-screen flex items-center justify-center bg-blue-500">
        INGFO COPYWRITING CO
      </div>
      <div className="w-full  md:px-24 ">
        <Form method="post" className="flex flex-col items-center gap-4 px-8  ">
          <img src="/logo/jitu.png" alt="jitu logo" className="w-40" />
          <div className="flex flex-col w-full gap-4 text-sm ">
            <h2 className="text-xl font-medium  ">Buat Akun</h2>
            <div className="space-y-2">
              <p className="">Nama</p>
              <Input
                type="text"
                name="name"
                placeholder="Name"
                value={"Hakim Nizami"}
                required
                className="px-6 py-6 border-2 rounded-lg w-full"
              />
            </div>

            <div className="space-y-2">
              <p>Email</p>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={"hakimnizami15@gmail.com"}
                required
                className="px-6 py-6 border-2 rounded-lg w-full"
              />
            </div>
            <div className="space-y-2">
              <p>Password</p>
              <Input
                type="password"
                name="password"
                value={"Hakim180105"}
                placeholder="Password"
                required
                className="px-6 py-6 border-2 rounded-lg w-full"
              />
            </div>
            <div className="space-y-2">
              <p>Konfirmasi Password</p>
              <Input
                type="password"
                name="password"
                value={"Hakim180105"}
                placeholder="Password"
                required
                className="px-6 py-6 border-2 rounded-lg w-full"
              />
            </div>
            <div className="w-full gap-2 flex flex-col  items-center justify-center">
              <Button
                variant={"blue"}
                type="submit"
                className="px-12 py-5 text-sm font-bold"
              >
                Daftar
              </Button>
              <p>
                Sudah memiliki akun?{" "}
                <span className="text-blue-500">Masuk</span>
              </p>
            </div>
          </div>
        </Form>
      </div>
    </main>
  );
};
