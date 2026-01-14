"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  createTryout,
  createUtbkSubtests,
  getSubtestsByTryout,
  Subtest,
} from "@/lib/api/AdminTryoutApi";
import { TryoutFormData } from "./interface";
import { TryoutForm } from "./components/TryoutForm";
import { SubtestList } from "./components/SubtestList";

const CreateTryoutModule = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [createdTryoutId, setCreatedTryoutId] = useState<string | null>(null);
  const [subtests, setSubtests] = useState<Subtest[]>([]);
  const [formData, setFormData] = useState<TryoutFormData>({
    title: "",
    description: "",
    solutionPrice: 0,
    batch: "SNBT",
    releaseDate: "",
    scheduledStart: "",
    scheduledEnd: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "solutionPrice"
          ? value === ""
            ? ""
            : parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createdTryoutId) return; // Prevent double submission if already created

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        solutionPrice:
          formData.solutionPrice === "" ? 0 : Number(formData.solutionPrice),
        releaseDate: new Date(formData.releaseDate).toISOString(),
        scheduledStart: new Date(formData.scheduledStart).toISOString(),
        scheduledEnd: new Date(formData.scheduledEnd).toISOString(),
      };

      // 1. Create Tryout
      const tryout = await createTryout(payload);

      if (tryout && tryout.id) {
        setCreatedTryoutId(tryout.id);

        // 2. Create Default Subtests
        await createUtbkSubtests(tryout.id);

        // 3. Fetch Subtests to display
        const subtestsData = await getSubtestsByTryout(tryout.id);
        // Sort by order
        setSubtests(subtestsData.sort((a, b) => a.order - b.order));
        toast.success("Tryout berhasil dibuat!");
      }
    } catch (error) {
      console.error("Failed to process tryout creation:", error);
      toast.error("Gagal membuat tryout. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    router.push("/admin/tryout");
  };

  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Buat Tryout Baru
          </h1>
          <p className="text-muted-foreground">
            Isi formulir di bawah ini untuk membuat tryout UTBK baru.
          </p>
        </div>
      </div>

      <TryoutForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        createdTryoutId={createdTryoutId}
      />

      <SubtestList
        subtests={subtests}
        createdTryoutId={createdTryoutId}
        handleFinish={handleFinish}
      />
    </div>
  );
};

export default CreateTryoutModule;
