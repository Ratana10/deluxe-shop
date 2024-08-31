"use client";
import { useState } from "react";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface Navbar {
  id: number;
  title: string;
}
const navbars: Navbar[] = [
  {
    id: 1,
    title: "Products",
  },
  {
    id: 2,
    title: "Contact Us",
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <Image
              alt="logo"
              src="/img/logo.png"
              width={150}
              height={80}
              className="w-36 h-auto"
            />
          </Link>
        </div>

        {/* Hamburger */}
        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-white p-6 sm:ring-1 sm:ring-gray-900/10"
            >
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <Link href="/" className="-m-1.5 p-1.5">
                    <Image
                      alt="logo"
                      src="/img/logo.png"
                      width={150}
                      height={80}
                    />
                  </Link>
                </div>
              </SheetHeader>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navbars.map((nav: Navbar) => (
                      <Link
                        href="/"
                        key={nav.id}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setOpen(false)} 
                      >
                        {nav.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Navbar */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {navbars.map((nav: Navbar) => (
            <Link
              href="/"
              key={nav.id}
              className="text-lg font-medium leading-6 text-gray-900"
            >
              {nav.title}
            </Link>
          ))}
        </PopoverGroup>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-3"></div>
      </nav>
    </header>
  );
}
