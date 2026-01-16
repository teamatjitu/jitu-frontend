import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileModule from "@/modules/ProfileModule";

export default async function ProfilePage() {
  // CONFIG: Sesuai main.ts backend Anda (Port 3000)
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  
  // 1. Ambil Cookie Session dari Browser
  const headersList = await headers();
  const cookie = headersList.get("cookie") || "";

  // 2. Cek Session (Hit ke endpoint better-auth)
  // URL: http://localhost:3000/api/auth/get-session
  let session = null;
  try {
    const sessionRes = await fetch(`${BASE_URL}/api/auth/get-session`, {
      headers: { Cookie: cookie },
      cache: "no-store",
    });

    if (sessionRes.ok) {
      session = await sessionRes.json();
    }
  } catch (error) {
    console.error("Session check failed:", error);
  }

  // Redirect jika belum login
  if (!session) {
    redirect("/login");
  }

  // 3. Fetch Data Profile
  // URL: http://localhost:3000/api/profile
  let profileData = null;
  try {
    const res = await fetch(`${BASE_URL}/profile`, {
      method: "GET",
      headers: {
        Cookie: cookie,
        "x-user-id": session.user.id, // Fallback ID
      },
      cache: "no-store",
    });

    if (res.ok) {
      profileData = await res.json();
    } else {
      const errorBody = await res.text(); 
      console.error("Gagal ambil profile. Status:", res.status, "Body:", errorBody);    }
  } catch (error) {
    console.error("Fetch profile error:", error);
  }

  return <ProfileModule data={profileData} session={session} />;
}
