"use client";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Biography from "./components/Biography";
import Music from "./components/Music";
import Contacts from "./components/Contacts";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Biography />
      <Music />
      <Contacts />
    </div>
  );
}
