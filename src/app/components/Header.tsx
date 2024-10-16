"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navbar, { navbars } from "./Navbar";
import CartSheet from "@/components/CartSheet";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
      >
        {/* Mobile: Hamburger Menu */}
        <div className="flex items-center lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-6 bg-white">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-center">
                  <Link href="/" className="">
                    <Image
                      src="/img/logo.png"
                      alt="Logo"
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </Link>
                </SheetTitle>
                <SheetDescription className="mb-4 text-gray-500"></SheetDescription>
              </SheetHeader>
              <nav className="mt-10">
                <ul className="space-y-6">
                  {navbars.map((nav) => (
                    <li key={nav.id}>
                      <Link
                        href={nav.href}
                        className="text-lg font-medium leading-6"
                        onClick={() => setOpen(false)}
                      >
                        {nav.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="">
            <Image
              src="/img/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Desktop: Navigation Links */}
        <div className="hidden lg:flex lg:gap-x-12">
          <Navbar />
        </div>

        {/* Cart Button */}
        <div className="flex items-center">
          <CartSheet />
        </div>
      </nav>
    </header>
  );
}
