"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { theme } from "../utils/theme";
import { songs } from "@/app/data/songs";

function Music() {
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  const handlePlay = (index: number) => {
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== index) audio.pause();
    });
    setCurrentSongIndex(index);
    audioRefs.current[index]?.play();
  };

  return (
    <section
      id="Музыка"
      className="min-h-screen p-10 pt-24"
      style={{
        background: `linear-gradient(
          to bottom left,
          ${theme.colors.heroGradientStart},
          ${theme.colors.heroGradientMiddle},
          ${theme.colors.heroGradientEnd}
        )`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: theme.animation.fadeDuration }}
        className="max-w-6xl mx-auto"
      >
        <h2
          className="text-4xl font-bold mb-6"
          style={{ color: theme.colors.textPrimary }}
        >
          Музыка
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {songs.map((song, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: theme.animation.fadeDuration }}
              className="p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl hover:scale-105 transition-transform"
              style={{
                background: `linear-gradient(to right, ${theme.colors.card}, ${theme.colors.secondary})`,
                borderRadius: theme.borderRadius,
              }}
            >
              <h3
                className="font-semibold text-xl mb-4"
                style={{ color: theme.colors.textPrimary }}
              >
                {song.title}
              </h3>

              <audio
                ref={(el) => {
                  audioRefs.current[index] = el;
                }}
                src={song.file}
                controls
                className="w-full rounded-lg overflow-hidden bg-gray-200"
                onPlay={() => handlePlay(index)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Music;
