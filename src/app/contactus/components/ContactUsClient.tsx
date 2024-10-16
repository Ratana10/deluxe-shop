"use client";

import { ContactUs } from "@/types";
import { Facebook, Instagram, Send } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

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
const DynamicIframe = dynamic(() => import("./MapIFrame"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const ContactUsClient = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mt-6 md:mt-8 px-4 lg:px-8">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold mb-2 lg:mb-4 text-[#660404]"
        >
          Connect With Us
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1 }}
          className="sm:text-lg mt-2 text-gray-600 max-w-3xl mx-auto text-center"
        >
          At our jewelry store, we value building a connection with you. Whether
          you have a question about our products, need assistance, or just want
          to say hello, feel free to contact us through any of the following
          platforms. Our team is always here to assist you.
        </motion.p>
      </div>

      {/* Social Media Links */}
      <div className="flex flex-wrap justify-center gap-8 text-[#AB8529] cursor-pointer mt-4 md:mt-10">
        {contactUs.map((item: ContactUs, index: number) => (
          <a
            key={index}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center transform transition duration-200 hover:scale-110 cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="flex justify-center items-center">
                {item.icon}
              </div>
              <p className="text-lg font-medium mt-4 text-center">
                {item.label}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Text */}
      <div className="space-y-4 mt-6 md:mt-10 px-4 lg:px-8">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center text-3xl  md:text-4xl font-bold mb-2 lg:md4 text-[#660404]"
        >
          Our Store Location
        </motion.h3>

        {/* Location Map */}
        <div className="relative rounded-lg w-full h-[400px]  md:h-[550px] lg:h-[600px] mt-5">
          <DynamicIframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d488.6437269789441!2d104.897564057517!3d11.54110881581258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310950fe8609c59b%3A0x6621ba9a3538b878!2s12%2010MC%2C%20Phnom%20Penh!5e0!3m2!1sen!2skh!4v1729065610133!5m2!1sen!2skh"
            width="100%"
            height="80%"
            style={{ border: 0 }}
          />
        </div>
      </div>
    </div>
  );
};
export default ContactUsClient;
