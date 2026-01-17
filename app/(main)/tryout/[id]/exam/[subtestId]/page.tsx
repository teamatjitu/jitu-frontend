import TryoutExamModule from "@/modules/TryoutExamModule";

export default function TryoutExamPage() {
  // Tidak fetch di server, karena butuh cookies/session browser + attemptId query.
  return <TryoutExamModule />;
}
