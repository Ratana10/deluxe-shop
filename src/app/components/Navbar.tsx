"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

export interface Navbar {
  id: number;
  title: string;
  href: string;
}
export const navbars: Navbar[] = [
  {
    id: 1,
    title: "Home",
    href: "/home",
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="hidden lg:flex lg:gap-x-12"
    >
      {navbars.map((nav: Navbar) => {
        let isActive = false;
        if (nav.href === "/") {
          // Only match exactly for the Home route
          isActive = pathname === "/";
        } else {
          // For other routes, use startsWith to match sub-routes
          isActive = pathname.startsWith(nav.href);
        }
        return (
          <motion.div  key={nav.id} className="relative group">
            <Link
              href={nav.href}
              className={`text-lg font-medium leading-6 ${
                isActive ? "text-[#AB8529]" : "text-gray-900"
              } hover:text-[#AB8529] transition-colors duration-200`}
            >
              {nav.title}
            </Link>

            {/* Animated underline */}
            {isActive && (
              <motion.div
                className="absolute left-0 bottom-0 h-[2px] bg-[#AB8529]"
                layoutId="underline"
                style={{ width: "100%" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default Navbar;
