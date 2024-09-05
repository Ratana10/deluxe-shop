import { Button } from "@/components/ui/button";
import { ContactUs } from "@/types";
import { Facebook, Instagram, Mail, Map, Phone, Send } from "lucide-react";
import Link from "next/link";

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
        <h2 className="text-3xl md:text-4xl font-bold mb-2 lg:mb-4 text-[#660404]">
          Connect With Us
        </h2>

        {/* Description */}
        <p className="sm:text-lg mt-2 text-gray-600 max-w-3xl mx-auto text-center">
          At our jewelry store, we value building a connection with you. Whether
          you have a question about our products, need assistance, or just want
          to say hello, feel free to contact us through any of the following
          platforms. Our team is always here to assist you.
        </p>
      </div>

      {/* Social Media Links */}
      <div className="flex flex-wrap justify-center gap-8 text-[#AB8529] cursor-pointer mt-4 md:mt-10">
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

        <Button
          asChild
          className="bg-[#AB8529] text-white px-3 py-2 rounded-md text-sm hover:bg-opacity-90 transition-all mt-4 lg:mt-6"
        >
          <Link
            href="https://maps.app.goo.gl/f6P5jgj2Fokr9dFs9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <Map className="mr-2 h-4 w-4" />
            View on Google Maps
          </Link>
        </Button>
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
