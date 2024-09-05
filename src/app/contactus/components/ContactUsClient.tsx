import { ContactUs } from "@/types";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  Send,
} from "lucide-react";
import Image from "next/image";

const contactUs: ContactUs[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Facebook size={40} />,
    src: "/img/facebook.png",
  },
  {
    label: "Instagram",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Instagram size={40} />,
    src: "/img/instagram.png",
  },
  {
    label: "Phone",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Phone size={40} />,
    src: "/img/phone.png",
  },
  {
    label: "Telegram",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Send size={40} />,
    src: "/img/telegram.png",
  },
  {
    label: "Mail",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Mail size={40} />,
    src: "/img/mail.png",
  },
];

const ContactUsClient = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <h2 className="text-4xl font-bold text-center mb-10 text-[#660404]">
        Connect With Us
      </h2>

      {/* Description */}
      <p className="text-center mb-10 max-w-2xl mx-auto text-gray-600">
        At our jewelry store, we value building a connection with you. Whether
        you have a question about our products, need assistance, or just want to
        say hello, feel free to contact us through any of the following
        platforms. Our team is always here to assist you.
      </p>

      {/* Social Media Links */}
      <div className="flex flex-wrap justify-center gap-8 text-[#AB8529] cursor-pointer">
        {contactUs.map((item: ContactUs, index: number) => (
          <div
            key={index}
            className="flex flex-col items-center transform transition duration-200 hover:scale-110"
          >
            {item.icon}
            <a
              href={item.href}
              target="_blank"
              className="text-lg font-medium mt-4"
            >
              {item.label}
            </a>
          </div>
        ))}
      </div>

      {/* Address Section */}
      <div className="mt-12 text-center">
        <h3 className="text-3xl md:text-4xl font-semibold mb-2">Our Store Location</h3>
        <p className="text-lg mt-2 text-gray-600">Phnom Penh, Cambodia</p>
        {/* <p className="text-lg text-gray-600">Open Hours: 10:00 AM - 7:00 PM</p> */}
      </div>
    </div>
  );
};
export default ContactUsClient;
