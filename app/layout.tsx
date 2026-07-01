import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ahfas - Mobile & Web Developer",
  description: "Mobile & Web Developer with 4+ years experience. Specializing in Flutter, Swift, & Laravel for building professional mobile & web applications.",
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
