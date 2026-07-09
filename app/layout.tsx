import type { Metadata } from "next";
import Header from "@/components/header";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"]
})

export const metadata: Metadata = {
  title: "Glyph",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} h-full antialiased`} >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
