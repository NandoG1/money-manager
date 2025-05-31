"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/form/LoginForm";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <LoginForm />
    </main>
  );
}
