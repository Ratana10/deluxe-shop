import type { Metadata } from "next";
import { Lora } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import "leaflet/dist/leaflet.css";

const lora = Lora({
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  weight: ["400", "700"],
  style: "normal",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Deluxe",
    template: "%s - Deluxe",
  },
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
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="afterInteractive"
        />
        <Toaster />
        {/* Header should stay at the top */}
        <CartProvider>
          <Header />

          {/* Main content area grows to fill available space, ensuring the footer stays at the bottom */}
          <main className="flex-grow mt-14">{children}</main>

          {/* Footer with proper spacing */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
