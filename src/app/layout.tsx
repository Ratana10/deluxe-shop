import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const lora = Lora({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deluxe",
  description: "Deluxe shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/sun.png" />
        <meta name="theme-color" content="#360505" />
      </head>
      <body className={`${lora.className} flex flex-col min-h-screen`}>
        {/* Header should stay at the top */}
        <Header />

        {/* Main content area grows to fill available space, ensuring the footer stays at the bottom */}
        <main className="flex-grow mt-24">{children}</main>

        {/* Footer with proper spacing */}
        <footer className="mt-3">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
