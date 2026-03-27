"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import LeftPanel from "@/components/LeftPanel";
import ChatPanel from "@/components/ChatPanel";
import RightPanel from "@/components/RightPanel";
import AboutModal from "@/components/AboutModal";
import SenpaiAvatar from "@/components/SenpaiAvatar";

export default function Home() {
  const [bootProgress, setBootProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [activeMobilePanel, setActiveMobilePanel] = useState<
    "chat" | "left" | "right"
  >("chat");
  const [messages, setMessages] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const savedHistory = localStorage.getItem("Iris_sessions");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0)
      localStorage.setItem("Iris_sessions", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (bootProgress < 100) {
      const timer = setTimeout(() => setBootProgress((p) => p + 4), 30);
      return () => clearTimeout(timer);
    }
  }, [bootProgress]);

  const initializeSystem = () => {
    setIsInitialized(true);
    setIsPlaying(true);
  };

  const playSfx = (type: string) => {
    const audio = new Audio(`/sfx/${type}.mp3`);
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  const loadSession = (session: any) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    playSfx("receive");
    setActiveMobilePanel("chat");
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input;
    const userMsg = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    playSfx("send");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await response.json();
      const assistantMsg = {
        role: "assistant",
        content: data.reply || "SYSTEM_OFFLINE",
      };
      setMessages((prev) => [...prev, assistantMsg]);
      playSfx("receive");

      if (!activeSessionId) {
        const newId = Date.now().toString();
        setActiveSessionId(newId);
        setHistory((prev) => [
          {
            id: newId,
            name: userText.substring(0, 20),
            messages: [...messages, userMsg, assistantMsg],
            date: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      } else {
        setHistory((prev) =>
          prev.map((s) =>
            s.id === activeSessionId
              ? { ...s, messages: [...messages, userMsg, assistantMsg] }
              : s,
          ),
        );
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "[SYSTEM_ERROR]" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative h-screen w-screen bg-[#F4EEFF] bg-clouds overflow-hidden">
      <AnimatePresence mode="wait">
        {!isInitialized ? (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100]"
          >
            <LoadingScreen
              progress={bootProgress}
              onInitialize={initializeSystem}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex h-full w-full gap-4 md:gap-6 p-4 md:p-6 max-w-[1600px] mx-auto"
          >
            {/* Mobile Overlay for blurring background */}
            {activeMobilePanel !== "chat" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setActiveMobilePanel("chat")}
                className="fixed inset-0 bg-aesthetic-darkPurple/20 backdrop-blur-md z-[55] xl:hidden"
              />
            )}

            {/* Left Panel */}
            <div
              className={`
              ${activeMobilePanel === "left" ? "fixed inset-y-4 left-4 z-[60] flex w-[280px]" : "hidden"} 
              xl:relative xl:flex xl:w-80 xl:bg-transparent xl:p-0
            `}
            >
              <div className="w-full h-full relative">
                <LeftPanel
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentTrack={currentTrack}
                  setCurrentTrack={(i: number) => {
                    setCurrentTrack(i);
                    if (window.innerWidth < 1280) setActiveMobilePanel("chat");
                  }}
                />
              </div>
            </div>

            {/* Main Chat */}
            <div
              className={`flex-1 min-w-0 ${activeMobilePanel !== "chat" ? "hidden md:flex" : "flex"}`}
            >
              <ChatPanel
                messages={messages}
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                startNewChat={() => {
                  setMessages([]);
                  setActiveSessionId(null);
                }}
                isLoading={isLoading}
                onToggleLeft={() =>
                  setActiveMobilePanel(
                    activeMobilePanel === "left" ? "chat" : "left",
                  )
                }
                onToggleRight={() =>
                  setActiveMobilePanel(
                    activeMobilePanel === "right" ? "chat" : "right",
                  )
                }
              />
            </div>

            {/* Right Panel */}
            <div
              className={`
              ${activeMobilePanel === "right" ? "fixed inset-y-4 right-4 z-[60] flex w-[280px]" : "hidden"} 
              lg:relative lg:flex lg:w-80 lg:bg-transparent lg:p-0
            `}
            >
              <div className="w-full h-full relative">
                <RightPanel
                  history={history}
                  activeSessionId={activeSessionId}
                  loadSession={(s: any) => {
                    loadSession(s);
                    setActiveMobilePanel("chat");
                  }}
                  openAbout={() => setShowAbout(true)}
                  isPlaying={isPlaying}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SenpaiAvatar />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </main>
  );
}
