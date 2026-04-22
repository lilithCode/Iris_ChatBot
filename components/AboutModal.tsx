"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Coffee, Sparkles, Github, Database } from "lucide-react";

export default function AboutModal({ isOpen, onClose }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-aesthetic-purple/20 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-white"
          >
            <div className="bg-aesthetic-sakura/30 p-6 flex justify-between items-center border-b-4 border-white">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-aesthetic-darkPurple" />
                <span className="text-xs font-black uppercase tracking-widest text-aesthetic-darkPurple">
                  Project: Iris
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <X size={24} className="text-aesthetic-darkPurple" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-[2rem] border-4 border-aesthetic-lavender overflow-hidden shadow-lg rotate-3">
                  <img
                    src="/profile.jpg"
                    alt="Creator"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-aesthetic-darkPurple tracking-tighter italic">
                    LILITH
                  </h2>
                </div>
              </div>

              <div className="bg-aesthetic-cloud p-6 rounded-[2rem] border-2 border-aesthetic-lavender relative">
                <p className="text-sm text-aesthetic-darkPurple leading-relaxed font-semibold italic">
                  I named this project{" "}
                  <span className="text-[#b895d0]">Iris</span> because of
                  Steins;Gate. In the anime, Iris is the AI that carries Kurisu
                  Makise’s memories and personality, which I always thought was
                  such a cool and fascinating idea. It made AI feel less like
                  just code and more like something meaningful. So this project
                  is kind of my own tribute to that concept. I tried to recreate
                  a small piece of that world and build something that feels a
                  bit more human than a typical program, like a presence living
                  inside the system.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://github.com/lilithCode/Iris_ChatBot"
                  target="_blank"
                  className="flex items-center justify-center gap-2 p-4 bg-aesthetic-darkPurple text-white rounded-2xl font-bold text-xs hover:scale-105 transition-transform"
                >
                  <Github size={16} /> GitHub
                </a>
                <a
                  href="https://www.kaggle.com/code/hamnamubarak/iris-model/edit"
                  target="_blank"
                  className="flex items-center justify-center gap-2 p-4 bg-[#20BEFF] text-white rounded-2xl font-bold text-xs hover:scale-105 transition-transform"
                >
                  <Database size={16} /> Kaggle
                </a>
              </div>

              <div className="flex justify-center gap-6 text-aesthetic-purple border-t-2 border-aesthetic-lavender pt-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <Coffee size={14} /> Stay Hydrate Friends
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
