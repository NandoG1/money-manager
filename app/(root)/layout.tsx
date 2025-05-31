import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/lib/AuthProvider";

import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import MobileNav from "@/components/navigation/MobileNav";
import { Toaster } from "@/components/ui/toaster";
import FloatingActions from "@/components/action/FloatingActions";
import ChatBotWrapper from "@/components/chat/ChatBotWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";

export const metadata: Metadata = {
  title: "FinTrack",
  description: "Track your financial records in one single web application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: any = await getServerSession(authOptions);

  return (
    <main className="relative mx-auto flex max-w-[1920px] min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] opacity-20"></div>
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] -z-10"></div>
      
      <Sidebar />
      <div className="w-full lg:ml-[200px] xl:ml-[250px] relative z-10">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <div className="md:mx-6 md:mt-4">
              <Header data={session} />
              <MobileNav />
              <div className="mt-6 px-2 md:px-4">{children}</div>
              <Toaster />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </div>
      <div className="fixed bottom-5 right-5 z-50">
        <FloatingActions />
      </div>
      <ChatBotWrapper />
    </main>
  );
}
