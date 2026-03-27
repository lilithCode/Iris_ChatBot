"use client";
import React, { useEffect, useRef } from "react";
import { Play, Pause, Disc } from "lucide-react";
import { TRACKS } from "./playlistData";

export default function LeftPanel({
  isPlaying,
  setIsPlaying,
  currentTrack,
  setCurrentTrack,
  playSfx,
}: any) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
     audioRef.current.volume = 0.1;
    audioRef.current.src = `/sfx/Playlist/${TRACKS[currentTrack].file}`;
    if (isPlaying) audioRef.current.play().catch(() => {});
  }, [currentTrack]);

  const togglePlay = () => {
    isPlaying ? audioRef.current?.pause() : audioRef.current?.play();
    setIsPlaying(!isPlaying);
    playSfx?.("send");
  };

  return (
    <aside className="w-full h-full flex flex-col gap-4 z-10">
      <div className="flex-1 cyber-glass neon-border-cyan clip-cyber p-4 lg:p-6 flex flex-col items-center overflow-hidden">
        <div className="w-full flex justify-between items-center mb-6 lg:mb-10 border-b border-cyber-cyan/20 pb-2">
          <Disc
            className={`text-cyber-cyan ${isPlaying ? "animate-spin" : ""}`}
            size={14}
          />
          <h3 className="text-[8px] lg:text-[10px] text-cyber-cyan font-black tracking-[0.4em] uppercase italic">
            Audio_Space
          </h3>
        </div>

        <div
          className="relative mb-8 lg:mb-12 cursor-pointer group"
          onClick={togglePlay}
        >
          <div
            className={`w-40 h-40 rounded-full border-2 border-white/20 overflow-hidden relative ${isPlaying ? "animate-spin-slow" : ""}`}
          >
            <img
              src={TRACKS[currentTrack].cover}
              className="w-full h-full object-cover"
              alt="cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="absolute -bottom-1 -right-1 p-3 bg-cyber-cyan text-black rounded-full shadow-[0_0_20px_#00f3ff]">
            {isPlaying ? (
              <Pause size={18} fill="black" />
            ) : (
              <Play size={18} fill="black" />
            )}
          </div>
        </div>

        <div className="w-full flex-1 space-y-1 overflow-y-auto pr-1 scrollbar-hide lg:scrollbar-cyber">
          {TRACKS.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentTrack(i);
                setIsPlaying(true);
                playSfx?.("send");
              }}
              className={`w-full text-left text-[9px] lg:text-[10px] font-bold p-3 transition-all flex items-center gap-3 ${currentTrack === i ? "text-cyber-cyan bg-cyber-cyan/10 border-l-2 border-cyber-cyan" : "text-white/30 hover:text-white"}`}
            >
              <span className="opacity-20">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="truncate uppercase">{t.name}</span>
            </button>
          ))}
        </div>
      </div>
      <audio ref={audioRef} loop />
    </aside>
  );
}
