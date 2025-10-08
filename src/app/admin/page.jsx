"use client";
import FormContent from "./components/FormContent";
import MobilePreview from "./components/MobilePreview";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

export default function AdminPage() {
 

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session load
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className="p-7">
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#064A6E] transition-colors shadow-md"
        >
          <BarChart3 className="w-5 h-5" />
          Analytics Dashboard
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Left side: Form content */}
        <div className="col-span-2">
          <FormContent />
        </div>
        {/* Right side: Mobile preview */}
        <div>
          <MobilePreview />
        </div>
      </div>
    </div>
  );
}
