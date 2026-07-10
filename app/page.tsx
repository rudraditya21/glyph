import { Lobster } from "next/font/google";
import Link from "next/link";

import ThemeToggle from "@/components/theme-toggle";

const lobster = Lobster({
  weight: ["400"],
  subsets: ["latin", "latin-ext"],
});

export default function Home() {
  return (
    <div className="flex flex-col md:mx-8 lg:mx-12 border-x border-dashed min-h-screen">
      {/* Header */}
      <header className="border-b border-dashed flex flex-row py-2 px-6 items-center justify-between">
        <div className={`${lobster.className} text-2xl`}>Glyph</div>
        <ThemeToggle />
      </header>
      {/* Body */}
      <div className="min-h-[90svh]"></div>
      {/* Footer */}
      <footer className="border-t px-6 border-dashed">
        <Link href="#">Github</Link>
      </footer>
    </div>
  );
}
