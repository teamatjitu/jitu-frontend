import { Pen } from "~/components/icons";
import { TryoutCard } from "./components/TryoutCard";
import { PesertaTable } from "./components/PesertaTable";

export const EditTryoutModule = () => {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <TryoutCard />
      <PesertaTable />
    </main>
  );
};
