"use client";

import React from "react";
import { theme } from "../utils/theme";
import { FaTelegramPlane, FaInstagram, FaVk } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const socialIcons = [
  { icon: <FaTelegramPlane />, label: "Telegram", value: "lidia_ante_official", url: "https://t.me/lidia_ante_official" },
  { icon: <FaInstagram />, label: "Instagram", value: "lidia_ante_", url: "https://instagram.com/lidia_ante_" },
  { icon: <FaVk />, label: "VK", value: "id641653386", url: "https://vk.com/id641653386" },
  { icon: <MdEmail />, label: "Email", value: "l_ante@mail.ru", url: "mailto:l_ante@mail.ru" },
];

function Contacts() {
  return (
    <section
      id="Контакты"
      className="min-h-screen p-10 pt-24 flex flex-col items-start"
      style={{
        background: `linear-gradient(
          to bottom right,
          ${theme.colors.heroGradientEnd},
          ${theme.colors.heroGradientMiddle},
          ${theme.colors.heroGradientStart}
        )`,
      }}
    >
      <h2 className="text-3xl font-bold mb-8" style={{ color: theme.colors.textPrimary }}>
        Контакты
      </h2>

      <div className="flex flex-col gap-6">
        {socialIcons.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 hover:scale-105 transition-transform"
          >
            {/* دائرة الأيقونة */}
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full shadow-md"
              style={{ backgroundColor: theme.colors.card }}
            >
              <span className="text-xl" style={{ color: theme.colors.textPrimary }}>
                {social.icon}
              </span>
            </div>
            {/* النص */}
            <div className="text-lg" style={{ color: theme.colors.textSecondary }}>
              <span className="font-semibold">{social.label}:</span> {social.value}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Contacts;
