"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative h-[calc(100vh-119px)]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/img/hero1.jpg"
          alt="product"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center items-start h-full p-8 text-white">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-[#FFFBF2] mb-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Timeless Elegance
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-100 mb-6 max-w-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          Discover a world where luxury meets craftsmanship. Our collection
          offers meticulously crafted jewelry that embodies elegance and
          sophistication. Each piece tells a unique story, designed to bring out
          the best in you.
        </motion.p>

        <Link href="/products">
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            View other Products
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
