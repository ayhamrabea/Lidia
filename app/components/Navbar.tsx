"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { theme } from "../utils/theme";
import Link from "next/link";

const links = [
  { label: "Обо мне", href: "#Биография", type: "anchor" },
  { label: "Музыка", href: "#Музыка", type: "anchor" },
  { label: "Контакты", href: "#Контакты", type: "anchor" },
];


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "shadow-sm" : ""
        }`}
        style={{
          backgroundColor: scrolled ? `${theme.colors.background}/80` : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          fontFamily: "Helvetica Neue",
        }}
      >
        <div className="max-w-6xl mx-auto flex justify-end p-4">
          <button onClick={() => setIsOpen(true)}>
            <Menu size={30} />
          </button>
        </div>
      </nav>

      {/* FULLSCREEN OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-md z-[60] transition-opacity duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* FULLSCREEN MENU PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] sm:w-[60%] md:w-[40%] bg-white/20 
        backdrop-blur-xl border-l border-white/30 shadow-2xl z-[70]
        transition-transform duration-500 ease-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ fontFamily: "Helvetica Neue" }}
      >
        {/* Close Button */}
        <div className="flex justify-end p-5">
          <button onClick={() => setIsOpen(false)}>
            <X size={34} className="text-white" />
          </button>
        </div>

        {/* Links with animation */}
        <div className="flex flex-col gap-8 mt-10 px-10">
          {links.map((link, index) => (
              link.type === "page" ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-light tracking-wide text-white opacity-0 translate-x-6 animate-slideIn"
                  style={{
                    animationDelay: `${0.15 * index}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-light tracking-wide text-white opacity-0 translate-x-6 animate-slideIn"
                  style={{
                    animationDelay: `${0.15 * index}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  {link.label}
                </a>
              )
            ))}
        </div>
      </div>

      {/* Animation for sliding links */}
      <style jsx>{`
        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }
      `}</style>
    </>
  );
}

export default Navbar;
