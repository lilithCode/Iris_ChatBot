"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Info, Code, Activity, Github, Database } from "lucide-react";

export default function RightPanel({
  playSfx,
  history,
  loadSession,
  activeSessionId,
  openAbout,
  isPlaying,
}: any) {
  const [showLinks, setShowLinks] = useState(false);
  const links = [
    {
      name: "GitHub Repo",
      icon: <Github size={14} />,
      url: "https://github.com/lilithCode/Amadeus",
    },
    {
      name: "Kaggle Notebook",
      icon: <Database size={14} />,
      url: "https://www.kaggle.com/code/hamnamubarak/amadeus",
    },
  ];

  return (
    <aside className="w-full h-full flex flex-col gap-4 z-10">
      <div className="cyber-glass neon-border-magenta p-4 lg:p-5 clip-cyber">
        <div className="flex items-center gap-2 text-[9px] font-black text-cyber-magenta opacity-60 uppercase mb-4 italic">
          <Activity size={12} /> neural_sync
        </div>
        <div className="h-10 lg:h-12 flex items-end gap-1">
          {[40, 80, 50, 95, 70, 85, 45, 60, 30, 50].map((h, i) => (
            <motion.div
              key={i}
              animate={
                isPlaying
                  ? { height: [`${h}%`, `${h - 40}%`, `${h}%`] }
                  : { height: "10%" }
              }
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
              className="flex-1 bg-cyber-magenta/80"
            />
          ))}
        </div>
      </div>

      <div className="flex-1 cyber-glass neon-border-cyan p-4 lg:p-5 flex flex-col overflow-hidden clip-cyber">
        <div className="flex items-center gap-2 text-[10px] font-black text-cyber-cyan uppercase mb-6 border-b border-white/10 pb-2 italic">
          <History size={14} /> session_logs
        </div>
        <div className="space-y-2 overflow-y-auto pr-1 scrollbar-hide lg:scrollbar-cyber">
          {history.length === 0 && (
            <div className="text-[9px] text-white/20 italic p-4 text-center">
              NO_LOGS_AVAILABLE
            </div>
          )}
          {history.map((h: any) => (
            <button
              key={h.id}
              onClick={() => loadSession(h)}
              className={`w-full text-left text-[10px] font-bold p-3 border-l-2 transition-all italic flex flex-col gap-1 ${activeSessionId === h.id ? "bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan" : "border-transparent text-white/40 hover:text-white"}`}
            >
              <span className="truncate uppercase">{`> ${h.name}`}</span>
              <span className="text-[8px] opacity-30 font-mono">{h.date}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          openAbout();
          playSfx("send");
        }}
        className="cyber-glass border border-white/20 p-4 flex justify-between items-center group hover:bg-cyber-cyan/10 transition-all clip-chamfer"
      >
        <span className="text-[10px] font-black uppercase text-white/60 group-hover:text-white">
          About_Amadeus
        </span>
        <Info size={16} className="text-cyber-cyan" />
      </button>

      <div className="relative">
        <AnimatePresence>
          {showLinks && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-2 w-full bg-[#0a0a0c] border border-cyber-yellow/30 p-2 space-y-1 z-50"
            >
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 text-[10px] text-white/60 hover:text-cyber-yellow uppercase font-bold"
                >
                  {link.icon} {link.name}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => {
            setShowLinks(!showLinks);
            playSfx("send");
          }}
          className="w-full bg-cyber-yellow p-4 text-black font-black uppercase text-[10px] flex justify-between items-center px-6 hover:brightness-110 clip-chamfer transition-all"
        >
          Source_Code <Code size={16} />
        </button>
      </div>
    </aside>
  );
}
