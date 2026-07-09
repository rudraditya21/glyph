import ThemeToggle from "@/components/theme-toggle"
import { Lobster } from "next/font/google"

const lobster = Lobster({
  weight: ['400'],
  subsets: ['latin', 'latin-ext']
})

export default function Home() {
  return (
    <div className="flex flex-col md:mx-8 lg:mx-12 border-x border-dotted min-h-screen">
      <header className="border-b border-dotted flex flex-row py-2 px-6 items-center justify-between">
        <div className={`${lobster.className} text-2xl`}>Glyph</div>
        <ThemeToggle />
      </header>
    </div>
  )
}