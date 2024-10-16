import { ContactUs } from "@/types";
import { setting } from "@/db/setting";
import { Facebook, Instagram, Send } from "lucide-react";

export const contactUs: ContactUs[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61561814585184",
    icon: <Facebook size={25} />,
    src: "/img/facebook.png",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/de.luxeglam0ur?igsh=cWkzcW5pa2w4bHBs&utm_source=qr",
    icon: <Instagram size={25} />,
    src: "/img/instagram.png",
  },
  {
    label: "Telegram",
    href: "https://t.me/chanminea_sarann",
    icon: <Send size={25} />,
    src: "/img/telegram.png",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#660404] text-white py-4">
      <div className="container mx-auto flex flex-col sm:flex-row sm:justify-between items-center sm:items-start">
        <div className="mb-4 sm:mb-0 sm:w-1/3 text-center sm:text-left">
          <p className="text-sm"></p>
        </div>

        <div className="mb-4 sm:mb-0 sm:w-1/3 text-center">
          <p className="text-sm">
            © Copyright {setting.logoName}. All Rights Reserved.
          </p>
        </div>

        <div className="flex space-x-4 sm:w-1/3 justify-center sm:justify-end">
          {contactUs.map((item: ContactUs, index: number) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
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
