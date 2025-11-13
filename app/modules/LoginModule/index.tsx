"use client";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Form, useActionData } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export const LoginModule = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const actionData = useActionData<{ error?: "string" }>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

    if (name === "email") {
      localStorage.setItem(name, value);
    }
  };

  useEffect(() => {
    setLoginForm((prev) => ({
      ...prev,
      email: localStorage.getItem("email") || "",
    }));
  }, []);

  return (
    <main className="flex p-4 md:p-6 relative bg-blue-500 max-lg:justify-center justify-between max-lg:items-center min-h-screen">
      <div className="font-semibold flex mt-32 ml-12 text-white max-lg:hidden flex-col">
        <h1 className="text-4xl">Masuk ke Akun Anda</h1>
        <p className="text-2xl">Raih kampus impianmu bersama JituPTN</p>
      </div>
      <img
        src={"/pattern_login.webp"}
        alt="bg-wallpaper"
        className="object-cover absolute left-0 h-screen"
      />
      <div className="min-w-1/2 rounded-3xl max-md:h-1/2 px-2 py-16  md:p-20 h-screen justify-center flex items-center bg-white md:px-24 ">
        <Form
          method="post"
          className="flex  z-50 flex-col w-full items-start gap-4 px-8  "
        >
          <img src="/logo/jitu.png" alt="jitu logo" className=" w-20 md:w-40" />
          <div className="flex flex-col w-full gap-4 text-sm ">
            {actionData?.error && (
              <div className="bg-red-400/50 text-center rounded-sm py-1 items-center flex justify-center w-full ">
                <p className="text-black text-sm ">{actionData.error}</p>
              </div>
            )}
            <h2 className=" text-lg font-medium md:text-xl md:font-semibold  ">
              Masuk
            </h2>

            <div className="space-y-2">
              <p className="text-sm md:text-lg font-medium">Email</p>

              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={handleChange}
                required
                className="p-1.5 md:p-6 border-2 border-gray-300 rounded-lg w-full"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm md:text-lg font-medium">Password</p>
              <Input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="p-1.5 md:p-6 border-2 border-gray-300 rounded-lg w-full"
              />
              <Link to={"#"}>
                <span className="text-blue-500">Lupa password?</span>
              </Link>
            </div>

            <div className="w-full gap-2 flex flex-col  items-center justify-center">
              <Button
                variant={"blue"}
                type="submit"
                className="px-12 py-5 bg-blue-500 z-1 text-sm font-bold"
              >
                Daftar
              </Button>
              <p className="font-medium text-sm">
                Belum memiliki akun?{" "}
                <Link to={"/register"}>
                  <span className="text-blue-500">Daftar</span>
                </Link>
              </p>
            </div>
          </div>
        </Form>
      </div>
    </main>
  );
};
