"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Send,
  Heart,
  Menu,
  History as HistoryIcon,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";

export default function ChatPanel({
  messages,
  input,
  setInput,
  handleSend,
  startNewChat,
  isLoading,
  onToggleLeft,
  onToggleRight,
}: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <section className="flex-1 flex flex-col h-full soft-glass overflow-hidden panel-border !bg-white/30">
      <div className="bg-white/60 p-4 md:p-5 border-b-2 border-aesthetic-lavender flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLeft}
            className="xl:hidden p-2 bg-white text-aesthetic-purple rounded-full shadow-sm"
          >
            <Menu size={20} />
          </button>

          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-tr from-aesthetic-purple to-aesthetic-sakura rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-white shadow-xl overflow-hidden shrink-0 transform group-hover:scale-105 transition-transform">
              <img
                src="/profile.jpg"
                className="w-full h-full object-cover"
                alt="Iris HD Profile"
              />
            </div>
          </div>

          <div>
            <h2 className="font-black text-xl md:text-2xl tracking-tighter bg-gradient-to-r from-aesthetic-darkPurple via-aesthetic-purple to-aesthetic-sakura bg-clip-text text-transparent flex items-center gap-2 ">
              Iris <span className="text-aesthetic-sakura not-italic"></span>
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aesthetic-sakura opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-aesthetic-purple"></span>
              </span>
              <p className="text-[10px] font-black text-aesthetic-purple uppercase tracking-[0.2em]">
                Online
              </p>
            </div>
          </div>

          <div className="hidden xs:block">
            <h2 className="font-black text-aesthetic-darkPurple text-sm md:text-lg flex items-center gap-2">
              <span style={{ color: "#FFD1DC" }}>Iris</span>
              <span style={{ fontSize: "0.8em", color: "#B19CD9" }}>_v1.0</span>
              <Sparkles size={14} className="text-aesthetic-purple" />
            </h2>
            <p className="text-[9px] font-bold text-aesthetic-purple uppercase tracking-widest">
              System Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startNewChat}
            className="p-3 bg-aesthetic-sakura text-white rounded-2xl shadow-sm hover:scale-105 transition-transform"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={onToggleRight}
            className="lg:hidden p-3 bg-white text-aesthetic-purple rounded-2xl shadow-sm"
          >
            <HistoryIcon size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-cute bg-clouds/30">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-40 text-center space-y-4">
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-aesthetic-purple flex items-center justify-center">
              <Heart size={32} className="text-aesthetic-purple" />
            </div>
            <p className="font-black uppercase text-xs tracking-tighter">
              Initialize conversation sequence...
            </p>
          </div>
        )}

        {messages.map((msg: any, i: number) => (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-6 py-3.5 max-w-[85%] text-sm font-bold tracking-tight shadow-lg ${msg.role === "user" ? "msg-bubble-user" : "msg-bubble-bot"}`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="msg-bubble-bot px-6 py-3 flex gap-1">
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-1.5 h-1.5 bg-aesthetic-purple rounded-full"
              />
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                className="w-1.5 h-1.5 bg-aesthetic-purple rounded-full"
              />
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                className="w-1.5 h-1.5 bg-aesthetic-purple rounded-full"
              />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 md:p-6 bg-white/80 border-t-2 border-aesthetic-lavender flex gap-3 backdrop-blur-md">
        <div className="flex-1 bg-white border-2 border-aesthetic-lavender rounded-3xl px-6 flex items-center shadow-inner">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Send a thought..."
            className="w-full py-4 bg-transparent outline-none text-aesthetic-darkPurple font-bold text-sm placeholder:text-aesthetic-purple/40"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="w-14 h-14 bg-gradient-to-br from-aesthetic-purple to-aesthetic-darkPurple text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
        >
          <Send size={22} />
        </button>
      </div>
    </section>
  );
}
