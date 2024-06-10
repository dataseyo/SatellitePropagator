import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import Navbar from "@/components/Nav/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Satellite Propagator",
  description: "A three.js take on astrodynamics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="solar">
      <body className={inter.className}>
        <main className="flex flex-col items-center">
          <Toaster
            position="top-right"
          />
          <Navbar/>
          {children}
        </main>
      </body>
    </html>
  );
}
