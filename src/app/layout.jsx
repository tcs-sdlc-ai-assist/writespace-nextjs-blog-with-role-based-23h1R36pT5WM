import { Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "WriteSpace",
  description:
    "A modern, distraction-free writing platform. Create, share, and discover stories — all saved right in your browser.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-surface-50 text-surface-900 dark:bg-surface-900 dark:text-surface-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}