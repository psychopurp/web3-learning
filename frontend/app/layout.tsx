import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "simplebar-react/dist/simplebar.min.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hello Web3",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
