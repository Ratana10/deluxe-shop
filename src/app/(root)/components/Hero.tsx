"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-119px)]">
      <img src="/img/hero1.jpg" alt="" className="w-full h-full object-cover" />
      <div className="flex flex-col justify-center items-start p-8">
        <h1 className="text-5xl font-bold text-[#660404] mb-4">
          Timeless Elegance
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover a world where luxury meets craftsmanship. Our collection
          offers meticulously crafted jewelry that embodies elegance and
          sophistication. Each piece tells a unique story, designed to bring out
          the best in you.
        </p>
        <button className="btn-primary">Explore the Collection</button>
      </div>
    </div>
  );
};

export default Hero;
