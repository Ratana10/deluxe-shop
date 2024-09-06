"use client"

import { ContactUs } from "@/types";
import { Facebook, Instagram, Mail, Map, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";

const contactUs: ContactUs[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Facebook size={35} />,
    src: "/img/facebook.png",
  },
  {
    label: "Instagram",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Instagram size={35} />,
    src: "/img/instagram.png",
  },
  {
    label: "Phone",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Phone size={35} />,
    src: "/img/phone.png",
  },
  {
    label: "Telegram",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Send size={35} />,
    src: "/img/telegram.png",
  },
  {
    label: "Mail",
    href: "https://www.facebook.com/ratana.san.79/",
    icon: <Mail size={35} />,
    src: "/img/mail.png",
  },
];

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
         initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 1 }}
        className="sm:text-lg mt-2 text-gray-600 max-w-3xl mx-auto text-center">
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
      <div className="text-center space-y-4 mt-6 md:mt-10 px-4 lg:px-8">
        <h3 className="text-3xl  md:text-4xl font-bold mb-2 lg:md4 text-[#660404]">
          Our Store Location
        </h3>

        <p className=" sm:text-lg mt-2 text-gray-600 max-w-3xl mx-auto text-center">
          Visit our physical store in Phnom Penh for exclusive jewelry
          collections and personalized service. We&apos; love to meet you in
          personal
        </p>

        <a
          href="https://maps.app.goo.gl/f6P5jgj2Fokr9dFs9"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#AB8529] text-white px-3 py-2 rounded-md text-sm hover:bg-opacity-90 transition-all mt-4 lg:mt-6 inline-flex items-center  transform  duration-200 hover:scale-110"
        >
          <Map className="mr-2 h-4 w-4" />
          View on Google Maps
        </a>
      </div>

      {/* Button Section */}

      {/* <div className="mt-12 text-center">
        <h3 className="text-3xl md:text-4xl font-semibold mb-2">
          Our Store Location
        </h3>
        <p className="text-lg mt-2 text-gray-600">Phnom Penh, Cambodia</p> */}
      {/* <p className="text-lg text-gray-600">Open Hours: 10:00 AM - 7:00 PM</p> */}
      {/* </div> */}

      {/* Google Map */}
      {/* <div className="mt-12 grid grid-cols-2">
        <div className="flex justify-center">
          
        </div>
      </div> */}
    </div>
  );
};
export default ContactUsClient;
