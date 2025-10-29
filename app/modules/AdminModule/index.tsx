import { useEffect, useState } from "react";
import { Home, Funnel, Play } from "lucide-react";
import { Sidebar } from "~/modules/AdminModule/components/Sidebar";
import { TryoutCard } from "./components/TryoutCard";
import { useLoaderData } from "react-router";

type Tryout = {
  id: string;
  name: string;
  year: number;
  duration: number;
  publishedAt: string;
  closedAt: string;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
};

export const AdminModule = () => {
  const tryouts = useLoaderData<Tryout[]>();
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    console.log(filterOpen);
  }, [filterOpen]);

  const sortedTryouts = [...tryouts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sort === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <main className="min-h-screen flex flex-row">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="w-full h-fit px-4 py-2 border-b-2 border-blue-800 text-gray-300">
          <div className="flex flex-row gap-3">
            <div className="flex flex-row gap-2">
              <Home />
              <div className="h-full border-r-2" />
            </div>
            <p className="text-lg">Dashboard &gt; Tryout</p>
          </div>
        </div>

        {/* Title + Actions */}
        <div className="px-8 py-10">
          <div className="w-full flex flex-row justify-between items-center h-fit">
            <h1 className="text-blue-800 text-2xl font-bold">Tryout</h1>

            <div className="flex flex-row gap-6 relative">
              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="border-2 max-md:text-sm gap-3 flex flex-row items-center rounded-xl border-blue-800 px-4 py-3 text-blue-800 hover:cursor-pointer"
                >
                  <Funnel />
                  Filter
                </button>

                {filterOpen && (
                  <div className="absolute left-0 top-full mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                    <ul className="py-1 text-sm text-gray-700">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSort("newest");
                          setFilterOpen(false);
                        }}
                      >
                        Sort by Newest
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSort("oldest");
                          setFilterOpen(false);
                        }}
                      >
                        Sort by Oldest
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Add Button */}
              <button className="border-2 gap-3 max-md:text-sm flex flex-row rounded-xl border-white bg-blue-500 px-4 py-3 text-white hover:cursor-pointer">
                <Play />
                Tambah TO
              </button>
            </div>
          </div>
        </div>

        {/* Tryout Cards */}
        <div className="px-8 flex flex-wrap justify-center gap-8">
          {sortedTryouts.map((t, index) => {
            const publishedDate = new Date(t.publishedAt).toLocaleDateString(
              "en-GB"
            );
            const closedDate = new Date(t.closedAt).toLocaleDateString("en-GB");

            return (
              <TryoutCard
                key={index}
                nama={t.name}
                tanggalMulai={publishedDate}
                tanggalTutup={closedDate}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
};
