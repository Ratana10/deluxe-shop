import Link from "next/link";
import { Facebook, Twitter, Instagram, Phone, Send, Mail } from "lucide-react";
import { ContactUs } from "@/types";

const contactUs: ContactUs[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Facebook size={25} />,
    src: "/img/facebook.png",
  },
  {
    label: "Instagram",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Instagram size={25} />,
    src: "/img/instagram.png",
  },
  {
    label: "Phone",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Phone size={25} />,
    src: "/img/phone.png",
  },
  {
    label: "Telegram",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Send size={25} />,
    src: "/img/telegram.png",
  },
  {
    label: "Mail",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Mail size={25} />,
    src: "/img/mail.png",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#660404] text-white py-6">
      <div className="container mx-auto flex flex-col sm:flex-row sm:justify-between items-center sm:items-start">
        <div className="mb-4 sm:mb-0 sm:w-1/3 text-center sm:text-left">
          <p className="text-sm"></p>
        </div>

        <div className="mb-4 sm:mb-0 sm:w-1/3 text-center">
          <p className="text-sm">© Copyright Deluxe. All Rights Reserved.</p>
        </div>

        <div className="flex space-x-4 sm:w-1/3 justify-center sm:justify-end">
          {contactUs.map((item: ContactUs, index: number) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              className="text-lg font-medium  flex flex-col items-center transform transition duration-200 hover:scale-125"
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
