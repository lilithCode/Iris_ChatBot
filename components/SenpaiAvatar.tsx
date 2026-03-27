"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DIALOGUES = [
  "Hi there! I'm Iris-chan! (⸝⸝ᵕᴗᵕ⸝⸝)",
  "I was born from 12,000 WhatsApp messages! ✨",
  "Lilith built me to be your cozy AI companion. nya~ 🐾",
  "Click me again if you want to hear more!",
];

export default function SenpaiAvatar() {
  const [index, setIndex] = useState(0);
  const [showSpeech, setShowSpeech] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setShowSpeech(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => {
    if (!showSpeech) {
      setShowSpeech(true);
    } else {
      setIndex((prev) => (prev + 1) % DIALOGUES.length);
    }
  };

  return (
    <div
      ref={avatarRef}
      className="fixed bottom-8 right-8 z-[200] flex flex-col items-end"
    >
      <AnimatePresence>
        {showSpeech && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            key={index}
            className="mb-4 p-5 bg-white border-4 border-aesthetic-lavender rounded-[2rem] shadow-xl max-w-[220px] text-[13px] font-bold text-aesthetic-darkPurple relative leading-relaxed cursor-pointer"
            onClick={handleClick}
          >
            {DIALOGUES[index]}
            <div className="absolute -bottom-2 right-10 w-4 h-4 bg-white border-r-4 border-b-4 border-aesthetic-lavender rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className="w-24 h-24 relative"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
            <path d="M50 150 L30 20 L80 40 Z" fill="#B19CD9" />
            <path d="M150 150 L170 20 L120 40 Z" fill="#B19CD9" />
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="white"
              stroke="#DCD0FF"
              strokeWidth="6"
            />
            <circle cx="75" cy="95" r="8" fill="#5D54A4" />
            <circle cx="125" cy="95" r="8" fill="#5D54A4" />
            <path
              d="M90 115 Q100 125 110 115"
              stroke="#5D54A4"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="60" cy="110" r="10" fill="#FFD1DC" opacity="0.6" />
            <circle cx="140" cy="110" r="10" fill="#FFD1DC" opacity="0.6" />
            <circle
              cx="70"
              cy="160"
              r="15"
              fill="white"
              stroke="#DCD0FF"
              strokeWidth="4"
            />
            <circle
              cx="130"
              cy="160"
              r="15"
              fill="white"
              stroke="#DCD0FF"
              strokeWidth="4"
            />
          </svg>
        </motion.div>
      </motion.button>
    </div>
  );
}
