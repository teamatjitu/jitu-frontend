"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  getTryoutById,
  getSubtestsByTryout,
  updateTryout,
  Subtest,
} from "@/lib/api/AdminTryoutApi";
import { TryoutFormData } from "@/modules/CreateTryoutModule/interface";
import { TryoutForm } from "@/modules/CreateTryoutModule/components/TryoutForm";
import { SubtestList } from "@/modules/CreateTryoutModule/components/SubtestList";
import { toast } from "sonner"; // Assuming sonner or similar toast is used, or basic alert if not. I'll stick to alert/console for consistency with Create module, or check components.

// Helper to format Date for datetime-local input (YYYY-MM-DDTHH:mm)
const formatDateForInput = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Adjust for timezone offset if needed, but standard datetime-local works best with local time string
  // Here we construct local ISO string
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

interface EditTryoutModuleProps {
  tryoutId: string;
}

const EditTryoutModule: React.FC<EditTryoutModuleProps> = ({ tryoutId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // We treat "createdTryoutId" as simply the current ID for subtest visibility
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const [tryout, subtestsData] = await Promise.all([
          getTryoutById(tryoutId),
          getSubtestsByTryout(tryoutId),
        ]);

        setFormData({
          title: tryout.title,
          description: tryout.description || "",
          solutionPrice: tryout.solutionPrice,
          batch: tryout.batch,
          releaseDate: formatDateForInput(tryout.releaseDate),
          scheduledStart: formatDateForInput(tryout.scheduledStart),
          scheduledEnd: formatDateForInput(tryout.scheduledEnd),
        });

        setSubtests(
          subtestsData.sort((a: Subtest, b: Subtest) => a.order - b.order)
        );
      } catch (error) {
        console.error("Failed to fetch tryout data:", error);
        alert("Gagal memuat data tryout.");
      } finally {
        setIsFetching(false);
      }
    };

    if (tryoutId) {
      fetchData();
    }
  }, [tryoutId]);

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

      await updateTryout(tryoutId, payload);
      // Option: redirect or stay
      // router.push("/admin/tryout");
      toast.success("Tryout berhasil diperbarui!");
    } catch (error) {
      console.error("Failed to update tryout:", error);
      toast.error("Tryout gagal dibuat!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    router.push("/admin/tryout");
  };

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Edit Tryout
          </h1>
          <p className="text-muted-foreground">
            Ubah informasi tryout dan kelola subtest.
          </p>
        </div>
      </div>

      <TryoutForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        createdTryoutId={tryoutId} // In edit mode, ID always exists
        isEdit={true}
      />

      <SubtestList
        subtests={subtests}
        createdTryoutId={tryoutId} // Always show subtests in edit mode
        handleFinish={handleFinish}
      />
    </div>
  );
};

export default EditTryoutModule;
