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
        <Header />
        <div className="mt-24 flex-grow">{children}</div>
        <div className="mt-3">
          <Footer />
        </div>
      </body>
    </html>
  );
}
