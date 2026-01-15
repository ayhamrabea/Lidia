"use client";

import React from "react";
import { motion } from "framer-motion";
import { theme } from "../utils/theme";
import { FaTelegramPlane, FaInstagram, FaVk } from "react-icons/fa";
import { MdEmail } from "react-icons/md";


function HeroSection() {

    const socialIcons = [
    { icon: <FaTelegramPlane />, label: "Telegram", url: "https://t.me/lidia_ante_official" },
    { icon: <FaInstagram />, label: "Instagram", url: "https://instagram.com/lidia_ante_" },
    { icon: <FaVk />, label: "VK", url: "https://vk.com/id641653386" },
    { icon: <MdEmail />, label: "Email", url: "https://mail.ru/l_ante@mail.ru" }, 
  ];

  return (
    <section
      className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(
          to bottom right,
          ${theme.colors.heroGradientStart},
          ${theme.colors.heroGradientMiddle},
          ${theme.colors.heroGradientEnd}
        )`,
      }}
    >
      {/* BLURRED ORBS */}
      <motion.div
        className="absolute top-20 left-10 w-60 h-60 rounded-full blur-[120px]"
        style={{ backgroundColor: theme.colors.heroOrb1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: theme.animation.fadeDuration }}
      />
      <motion.div
        className="absolute bottom-10 right-16 w-72 h-72 rounded-full blur-[140px]"
        style={{ backgroundColor: theme.colors.heroOrb2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: theme.animation.fadeDuration + 0.2 }}
      />

      {/* CONTENT */}
      <div className="relative max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 p-6 md:p-12">
        {/* LEFT TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: theme.animation.fadeDuration }}
          className="mt-8 text-center md:mt-0 flex flex-col justify-center"
        >
          <h1
            className="text-5xl md:text-7xl font-extrabold leading-tight "
            style={{ color: theme.colors.textPrimary  }}
          >
            Лидия Анте
          </h1>
          <p
            className="text-2xl "
            style={{ 
              color: theme.colors.textSecondary,
              fontFamily: "Helvetica Neue"
            }}
          >
            Автор и исполнитель песен
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-4 justify-center">
            {socialIcons.map((social, index) => (
                <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full hover:scale-110 transition-transform"
                style={{
                    // backgroundColor: theme.colors.card,  белый фон
                    color: theme.colors.textPrimary,   // черная иконка
                }}
                title={social.label}
                >
                <span className="text-3xl">{social.icon}</span>
                </a>
            ))}
        </div>

        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
  initial={{ opacity: 0, scale: 0.85 }}
  whileInView={{ opacity: 1, scale: 1 }}
  whileHover={{ scale: 1.05 }}
  viewport={{ once: true }}
  transition={{ duration: theme.animation.hoverDuration }}
  className="flex justify-center md:justify-end"
>
  <div className="relative w-72 md:w-96">
    <img
      src="/lidia.png"
      alt="Lidia"
      className="w-full rounded-3xl object-cover"
    />

  </div>
</motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
