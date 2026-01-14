import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import { TryoutFormData } from "../interface";

interface TryoutFormProps {
  formData: TryoutFormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  createdTryoutId: string | null;
  isEdit?: boolean;
}

export const TryoutForm: React.FC<TryoutFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  createdTryoutId,
  isEdit = false,
}) => {
  return (
    <Card
      className={`border-border/50 shadow-sm transition-opacity duration-300 ${
        !isEdit && createdTryoutId ? "opacity-75" : "opacity-100"
      }`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>
              {isEdit ? "Edit Informasi Tryout" : "Informasi Tryout"}
            </CardTitle>
            <CardDescription>
              {isEdit
                ? "Ubah detail tryout di bawah ini."
                : "Masukkan detail lengkap mengenai tryout yang akan dibuat."}
            </CardDescription>
          </div>
          {!isEdit && createdTryoutId && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Tersimpan
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset
            disabled={!isEdit && !!createdTryoutId}
            className="space-y-6 group-disabled:opacity-50"
          >
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Nama Tryout
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Contoh: Tryout Akbar SNBT 2026"
                required
                value={formData.title}
                onChange={handleChange}
                className="px-3"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Deskripsi (Opsional)
              </label>
              <textarea
                id="description"
                name="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Deskripsi singkat mengenai tryout ini..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="batch"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Kategori (Batch)
                </label>
                <div className="relative">
                  <select
                    id="batch"
                    name="batch"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                    value={formData.batch}
                    onChange={handleChange}
                  >
                    <option value="SNBT">SNBT</option>
                    <option value="MANDIRI">MANDIRI</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="solutionPrice"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Harga Tryout (Token)
                </label>
                <Input
                  id="solutionPrice"
                  name="solutionPrice"
                  type="number"
                  min="0"
                  required
                  value={formData.solutionPrice}
                  onChange={handleChange}
                  className="px-3"
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  Masukkan 0 untuk gratis.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="releaseDate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Tanggal Rilis
                </label>
                <Input
                  id="releaseDate"
                  name="releaseDate"
                  type="datetime-local"
                  required
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="px-3"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="scheduledStart"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Jadwal Mulai
                </label>
                <Input
                  id="scheduledStart"
                  name="scheduledStart"
                  type="datetime-local"
                  required
                  value={formData.scheduledStart}
                  onChange={handleChange}
                  className="px-3"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="scheduledEnd"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Jadwal Selesai
                </label>
                <Input
                  id="scheduledEnd"
                  name="scheduledEnd"
                  type="datetime-local"
                  required
                  value={formData.scheduledEnd}
                  onChange={handleChange}
                  className="px-3"
                />
              </div>
            </div>
          </fieldset>

          {(!createdTryoutId || isEdit) && (
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEdit ? "Simpan Perubahan" : "Simpan & Buat Subtest"}
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
