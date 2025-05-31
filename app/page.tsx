"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/landing");
    }
  }, [session, router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
}
