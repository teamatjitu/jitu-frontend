"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Home, Funnel, Play } from "lucide-react";
import { Sidebar } from "~/modules/AdminModule/components/Sidebar";
import { TryoutCard } from "./components/TryoutCard";
import { useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";

type AdminModuleProps = {
  tryouts: Tryout[];
};

export const AdminModule = ({ tryouts }: AdminModuleProps) => {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedTryouts = [...tryouts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sort === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <main className="min-h-screen flex flex-row">
      <div className="flex flex-1 flex-col">
        {/* Title + Actions */}
        <div className="px-20 py-10">
          <div className="w-full flex flex-row justify-between items-center h-fit">
            <h1 className="text-blue-800 text-2xl font-bold">Tryout</h1>

            <div className="flex flex-row gap-6 relative">
              {/* Filter Button */}
              <div ref={filterRef} className="relative">
                <button
                  onClick={() => {
                    setFilterOpen(!filterOpen);
                  }}
                  className="border-2 max-md:text-sm gap-3 flex flex-row items-center rounded-xl border-blue-800 px-4 py-3 text-blue-800 hover:cursor-pointer"
                >
                  <Funnel />
                  Filter
                </button>

                {filterOpen && (
                  <div className="absolute left-0 top-full mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                    <ul className=" text-sm text-gray-700">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 hover:rounded-xl cursor-pointer"
                        onClick={() => {
                          setSort("newest");
                          setFilterOpen(false);
                        }}
                      >
                        Sort by Newest
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-100 hover:rounded-xl cursor-pointer"
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
        <div className="flex items-center flex-col gap-6">
          <div className="px-8 flex flex-wrap justify-center gap-8">
            {sortedTryouts.map((t, index) => {
              const publishedDate = new Date(t.publishedAt).toLocaleDateString(
                "en-GB"
              );
              const closedDate = new Date(t.closedAt).toLocaleDateString(
                "en-GB"
              );

              return (
                <TryoutCard
                  key={index}
                  id={t.id}
                  nama={t.name}
                  tanggalMulai={publishedDate}
                  tanggalTutup={closedDate}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};
