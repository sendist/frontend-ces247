import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ces247",
  description: "A full-stack Blog / Content Management System built to demonstrate authentication, CRUD operations, role-based access control, REST API integration, and clean frontend & backend architecture.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') || '';
  return (
    <html lang="en">
    {/* Passing nonce to Head ensures inline styles are allowed without 'unsafe-inline' */}
      <head nonce={nonce} />
      <body>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
