import type { Metadata } from "next";

import { headers } from 'next/headers' // added
import './globals.css';
import ContextProvider from '@/context'
import Navbar from "@/components/navbar";
import localFont from 'next/font/local'

const newDos = localFont({
  src: '/font/NewDOS.ttf',
  variable: '--font-newdos'
})

export const metadata: Metadata = {
  title: "AppKit in Next.js + wagmi",
  description: "AppKit example dApp",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get('cookie');

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href={newDos.style.fontFamily} rel="stylesheet" />
      </head>
      <body className={`${newDos.variable} font-newdos antialiased`}>
        <ContextProvider cookies={cookies}>
          <Navbar />
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
