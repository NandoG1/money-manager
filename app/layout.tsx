// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "FinTrack",
  description: "Track your financial records in one single web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body className="dark:bg-background"> {/* Anda mungkin ingin mengelola tema di sini atau di dalam Providers */}
        {/* Jika Providers adalah untuk NextAuth v5 SessionProvider dan ThemeProvider */}
        <Providers> 
          {children}
          <Toaster /> {/* Toaster bisa di dalam atau di luar Providers tergantung kebutuhan */}
        </Providers>
      </body>
    </html>
  );
}