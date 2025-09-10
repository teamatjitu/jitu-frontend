import { Form } from "react-router";

export const LoginModule = () => {
  return (
    <main className="flex justify-center items-center min-h-screen">
      <Form
        method="post"
        className="flex flex-col gap-4 p-8 border rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={"hakimnizami15@gmail.com"}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={"Hakim180105"}
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="p-2 bg-amber-500 text-black rounded hover:bg-black hover:text-amber-500 transition duration-300"
        >
          Login
        </button>
      </Form>
    </main>
  );
};
