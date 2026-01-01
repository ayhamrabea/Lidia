"use client";

import React from "react";
import { motion } from "framer-motion";
import { theme } from "../utils/theme";

function Biography() {
  return (
    <section
      id="Биография"
      className="min-h-screen p-10 pt-24 flex items-center"
      style={{
              background: `linear-gradient(
                to bottom right,
                ${theme.colors.heroGradientEnd},
                ${theme.colors.heroGradientMiddle},
                ${theme.colors.heroGradientStart}
              )`,
            }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: theme.animation.fadeDuration }}
        className="max-w-4xl mx-auto"
      >
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: theme.colors.textPrimary  }}
        >
          Обо мне
        </h2>
        <p
          className="text-lg leading-relaxed"
          style={{
            color: "#222222",
            fontWeight: 600,
            textShadow: "0 0 3px rgba(0,0,0,0.20)"
          }}
        >
          Родилась и живу в Москве. С детства настроена на творческую волну.
          Виолончель — первая серьезная любовь. С тех пор неразлучны.
          Саксофон — чтобы соседи не скучали. 
          В свободное время сочиняю песни. Восхищаюсь этим миром, где есть место и лёгкости, и грусти, и всем оттенкам, из которых состоит жизнь. Хочу поделиться с вами его отражением в своем творчестве.
        </p>
      </motion.div>
    </section>
  );
}

export default Biography;
