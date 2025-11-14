import { useLoaderData } from "react-router";

export const Sidebar = () => {
  const tryouts = useLoaderData<Tryout[]>();

  return (
    <>
      <div className="flex flex-col items-center px-18  py-4 text-white min-h-screen bg-blue-800">
        <h1 className="font-medium text-lg mb-4">Administration</h1>
        <div className="text-center w-full">
          {tryouts.length ? (
            tryouts.map((t, index) => <p key={index}>{t.name}</p>)
          ) : (
            <p>No tryouts created</p>
          )}
        </div>
      </div>
    </>
  );
};
