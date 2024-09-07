"use client";

import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navbar, { navbars } from "./Navbar";
import CartSheet from "@/components/CartSheet";

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
              <Bars3Icon className="h-6 w-6 text-gray-700" aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-6 bg-white">
            <nav>
              <ul className="space-y-4">
                {navbars.map((nav) => (
                  <li key={nav.id}>
                    <Link href={nav.href} className="text-gray-700 text-lg" onClick={() => setOpen(false)}>
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
        <Link href="/" className="text-2xl lg:text-3xl font-bold text-[#660404]">
          Deluxe
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
