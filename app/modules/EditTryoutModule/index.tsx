import { TryoutCard } from "./components/TryoutCard";
import { PesertaTable } from "./components/PesertaTable";
import { ArrowLeft1 } from "~/components/icons";
import { Link } from "react-router";

type EditTryoutModuleProps = {
  tryout: Tryout;
};

export const EditTryoutModule = ({ tryout }: EditTryoutModuleProps) => {
  return (
    <main className="min-h-screen ">
      <Link to={"/admin"}>
        <div className="flex flex-row items-center mt-10 ml-10">
          <button className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft1 className="w-8 h-8" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-medium">Kembali Ke Menu Tryout</h1>
        </div>
      </Link>
      <div className="items-center px-5 flex flex-col">
        <TryoutCard tryout={tryout} />
        <PesertaTable />
      </div>
    </main>
  );
};
