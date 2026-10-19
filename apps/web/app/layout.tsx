import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { QuickCapture } from "./components/quick-capture";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import { SignOutButton } from "./components/sign-out-button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ATOM — Personal Workspace",
  description: "Everything that makes your day work. Notes, tasks, and time.",
};

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/notes", label: "Notes" },
  { href: "/tasks", label: "Tasks" },
  { href: "/time", label: "Time" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <ThemeProvider>
          <header className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto flex h-14 w-full max-w-4xl items-center gap-6 px-4">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-emerald-600 font-mono text-sm font-bold text-white">
                  At
                </span>
                ATOM
              </Link>
              <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                <SignOutButton />
              </div>
            </div>
          </header>
          {children}
          <QuickCapture />
        </ThemeProvider>
      </body>
    </html>
  );
}
