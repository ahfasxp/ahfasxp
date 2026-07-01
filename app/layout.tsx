import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muchamad Ahfas Fazria - Mobile Developer",
  description: "Full Stack Developer specializing in Flutter mobile development. 4+ years experience building professional mobile and web applications.",
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
