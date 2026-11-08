import "./globals.css";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import ThemeSync from "@/components/theme-sync";

const poppins = Poppins({
  variable: "--font-instrument-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Glyph",
  description: "",
};

const themeScript = `
(() => {
  const storageKey = "theme";
  const storedTheme = window.localStorage.getItem(storageKey);
  const mode =
    storedTheme === "light" || storedTheme === "dark" ? storedTheme : "system";
  const dark =
    mode === "dark" ||
    (mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", dark);
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
