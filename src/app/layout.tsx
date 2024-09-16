import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jeremy Blake Net Art",
  description: "An interactive homage to Jeremy Blake's digital art",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="">{children}</main>
        <footer className="fixed bottom-0 right-0 p-2 text-xs text-gray-500">
          <a
            href="https://dev.maxwellyoung.info"
            target="_blank"
            rel="noopener noreferrer"
          >
            dev.maxwellyoung.info
          </a>
        </footer>
      </body>
    </html>
  );
}
