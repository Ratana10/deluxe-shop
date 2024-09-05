"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

export interface Navbar {
  id: number;
  title: string;
  href: string;
}
export const navbars: Navbar[] = [
  {
    id: 1,
    title: "Home",
    href: "/",
  },
  {
    id: 2,
    title: "Products",
    href: "/products",
  },
  {
    id: 3,
    title: "Contact Us",
    href: "/contactus",
  },
];


const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:gap-x-12">
      {navbars.map((nav: Navbar) => (
        <Link
          href={nav.href}
          key={nav.id}
          className={`text-lg font-medium leading-6 text-gray-900 ${
            pathname === nav.href ? "border-b-2 border-[#AB8529]" : ""
          }`}
        >
          {nav.title}
        </Link>
      ))}
    </div>
  );
}

export default Navbar
