import type { Metadata } from "next";
import "./globals.css";
import { PORTFOLIO } from "@/constants/portfolio";

export const metadata: Metadata = {
  title: `${PORTFOLIO.name} - ${PORTFOLIO.title}`,
  description: PORTFOLIO.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
