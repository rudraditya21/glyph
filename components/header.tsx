import ThemeToggle from "./theme-toggle";
import { Lobster } from "next/font/google";

const lobster = Lobster({
  weight: ["400"],
  subsets: ["latin", 'latin-ext']
})

export default function Header() {
  return (
    <header className="border-b-[0.5px] flex flex-row py-2 px-6 items-center justify-between">
      <div className={`${lobster.className} text-2xl`}>Glyph</div>
      <ThemeToggle />
    </header>
  )
}