import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import localFont from 'next/font/local'

const newDos = localFont({
  src: '../public/font/NewDOS.ttf',
  variable: '--font-newdos'
})

export const metadata: Metadata = {
  title: "Agentic Ethereum",
  description: "Agentic Ethereum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${newDos.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
