"use client";
import React, { useState, useEffect } from "react";
import { CASES } from "../data/cases";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const shouldShow = event.clientY <= 80;
      setIsVisible(shouldShow);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <nav
      className={`fixed top-5 left-0 right-0 rounded-full w-[95vw] mx-auto bg-white/20 backdrop-blur-md border transition-all duration-300 ease-in-out z-50 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"} ${
        pathname.includes("trip") ? "text-white border-white/50" : "text-black border-black/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between font-medium">
          {CASES.map((c) => (
            <Link href={`/case/${c.slug}`} key={c.slug}>
              {c.purpose}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
