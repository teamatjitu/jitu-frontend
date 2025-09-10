import { Form } from "react-router";

export const RegisterModule = () => {
  return (
    <main className="flex justify-center items-center min-h-screen">
      <Form
        method="post"
        className="flex flex-col gap-4 p-8 border rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={"Hakim Nizami"}
          required
          className="p-2 border rounded"
        />
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
          value={"Hakim180105"}
          placeholder="Password"
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="p-2 bg-amber-500 text-black rounded hover:bg-black hover:text-amber-500 transition duration-300"
        >
          Register
        </button>
      </Form>
    </main>
  );
};
