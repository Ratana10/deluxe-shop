import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-red-950 text-white py-6">
      <div className="container mx-auto flex flex-col sm:flex-row sm:justify-between items-center sm:items-start">
        <div className="mb-4 sm:mb-0 sm:w-1/3 text-center sm:text-left">
          <p className="text-sm"></p>
        </div>

        <div className="mb-4 sm:mb-0 sm:w-1/3 text-center">
          <p className="text-sm">
            © Copyright 2023 Website. All Rights Reserved.
          </p>
        </div>

        <div className="flex space-x-4 sm:w-1/3 justify-center sm:justify-end">
          <Link href="https://facebook.com" aria-label="Facebook">
            <Facebook className="w-6 h-6 hover:text-gray-400" />
          </Link>
          <Link href="https://twitter.com" aria-label="Twitter">
            <Twitter className="w-6 h-6 hover:text-gray-400" />
          </Link>
          <Link href="https://instagram.com" aria-label="Instagram">
            <Instagram className="w-6 h-6 hover:text-gray-400" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
