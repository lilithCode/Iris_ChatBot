"use client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LoadingScreen({ progress, onInitialize }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F4EEFF] p-6 bg-clouds">
      <div className="w-full max-w-xs space-y-8 relative">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-aesthetic-lavender">
            <Sparkles size={32} className="text-aesthetic-purple" />
          </div>
        </motion.div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-aesthetic-purple uppercase tracking-widest">
              Waking_Up...
            </span>
            <span className="text-xs font-bold text-aesthetic-darkPurple">
              {progress}%
            </span>
          </div>
          <div className="h-4 w-full bg-white rounded-full p-1 border-2 border-aesthetic-lavender overflow-hidden">
            <motion.div
              className="h-full bg-aesthetic-purple rounded-full shadow-inner"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>

        <div className="h-14">
          {progress >= 100 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onInitialize}
              className="w-full py-4 bg-aesthetic-purple text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all active:scale-95"
            >
              Enter My World
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
