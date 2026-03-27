"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Heart,
  Sparkles,
  Github,
  Database,
  Code,
  ExternalLink,
  Smile,
} from "lucide-react";

export default function RightPanel({
  history,
  loadSession,
  activeSessionId,
  openAbout,
  isPlaying,
}: any) {
  const [showLinks, setShowLinks] = useState(false);
  const [vHeights, setVHeights] = useState(Array(10).fill(20));
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setVHeights((prev) =>
          prev.map(() => Math.floor(Math.random() * 70) + 20),
        );
      }, 150);
    } else {
      setVHeights(Array(10).fill(15));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLinks(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    {
      name: "GitHub Repo",
      icon: <Github size={16} />,
      url: "https://github.com/lilithCode/Iris",
      color: "bg-aesthetic-purple",
    },
    {
      name: "Kaggle Notebook",
      icon: <Database size={16} />,
      url: "https://www.kaggle.com/code/hamnamubarak/Iris",
      color: "bg-[#6e3e8e]",
    },
    {
      name: "Hugging Face Space",
      icon: <Smile size={16} />,
      url: "https://huggingface.co/spaces/lilLilith/Iris-RAG/tree/main",
      color: "bg-[#452759]",
    },
  ];

  return (
    <aside className="w-full h-full flex flex-col gap-4 z-10">
      <div className="soft-glass p-5 panel-border !bg-white/40">
        <div className="flex items-center gap-2 text-[10px] font-black text-aesthetic-purple uppercase mb-4 italic tracking-widest">
          <Sparkles size={14} /> beats
        </div>
        <div className="h-16 flex items-end gap-2 px-2 bg-white/20 rounded-2xl p-3">
          {vHeights.map((h, i) => (
            <motion.div
              key={i}
              animate={{ height: `${h}%` }}
              className={`flex-1 rounded-full ${isPlaying ? "bg-aesthetic-purple shadow-[0_0_10px_rgba(177,156,217,0.5)]" : "bg-aesthetic-lavender"}`}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 soft-glass p-5 flex flex-col overflow-hidden panel-border !bg-white/40">
        <div className="flex items-center gap-2 text-[11px] font-bold text-aesthetic-darkPurple uppercase mb-6 border-b-2 border-aesthetic-lavender pb-2">
          <History size={16} /> Memory_Logs
        </div>
        <div className="space-y-2 overflow-y-auto pr-1 scrollbar-cute">
          {history.map((h: any) => (
            <button
              key={h.id}
              onClick={() => loadSession(h)}
              className={`w-full text-left p-4 rounded-2xl transition-all flex flex-col gap-1 border-2 ${activeSessionId === h.id ? "bg-white border-aesthetic-sakura text-aesthetic-darkPurple shadow-md" : "border-transparent text-aesthetic-purple hover:bg-white/50"}`}
            >
              <span className="text-[11px] font-black truncate uppercase tracking-tighter">
                {h.name}
              </span>
              <span className="text-[9px] opacity-60 font-medium">
                {h.date}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div ref={menuRef} className="relative space-y-3">
        <button
          onClick={openAbout}
          className="w-full soft-glass p-4 flex justify-between items-center group hover:bg-white transition-all border-none panel-border shadow-lg"
        >
          <span className="text-[11px] font-black uppercase text-aesthetic-darkPurple">
            About Iris
          </span>
          <Heart
            size={18}
            className="text-aesthetic-sakura fill-aesthetic-sakura group-hover:scale-125 transition-transform"
          />
        </button>

        <AnimatePresence>
          {showLinks && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-3 w-full bg-white border-4 border-aesthetic-lavender rounded-[2rem] p-3 shadow-2xl z-50 space-y-2"
            >
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  className={`flex items-center justify-between p-3 rounded-xl text-white font-bold text-[10px] transition-transform hover:scale-[1.02] ${link.color}`}
                >
                  <div className="flex items-center gap-3">
                    {link.icon} {link.name}
                  </div>
                  <ExternalLink size={12} />
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowLinks(!showLinks)}
          className={`w-full p-4 rounded-[2rem] font-black uppercase text-xs flex justify-between items-center px-8 transition-all shadow-xl border-4 border-white ${
            showLinks
              ? "bg-aesthetic-darkPurple text-white"
              : "bg-aesthetic-purple text-white hover:brightness-105"
          }`}
        >
          Project_Links <Code size={18} />
        </button>
      </div>
    </aside>
  );
}
