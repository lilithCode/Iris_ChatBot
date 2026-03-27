"use client";
import React, { useEffect, useRef } from "react";
import { Play, Pause, Music2, Disc } from "lucide-react";
import { TRACKS } from "./playlistData";

export default function LeftPanel({
  isPlaying,
  setIsPlaying,
  currentTrack,
  setCurrentTrack,
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
  };

  return (
    <aside className="w-full h-full flex flex-col gap-4 z-10">
      <div className="flex-1 soft-glass p-6 flex flex-col items-center overflow-hidden panel-border">
        <div className="w-full flex justify-between items-center mb-8 border-b-2 border-aesthetic-lavender pb-3">
          <div className="flex items-center gap-2">
            <Music2 className="text-aesthetic-purple" size={18} />
            <h3 className="text-[10px] text-aesthetic-darkPurple font-black tracking-[0.2em] uppercase">
              radio station
            </h3>
          </div>
          {isPlaying && (
            <Disc className="animate-spin text-aesthetic-sakura" size={16} />
          )}
        </div>

        <div
          className="relative mb-8 cursor-pointer group"
          onClick={togglePlay}
        >
          <div
            className={`w-44 h-44 rounded-full border-[10px] border-white shadow-2xl overflow-hidden relative transition-transform duration-500 ${isPlaying ? "rotate-12 scale-105" : ""}`}
          >
            <img
              src={TRACKS[currentTrack].cover}
              className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? "animate-[spin_20s_linear_infinite]" : "grayscale-[0.5]"}`}
              alt="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-aesthetic-purple/20 to-transparent mix-blend-overlay" />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border-4 border-aesthetic-lavender shadow-inner flex items-center justify-center">
            <div className="w-2 h-2 bg-aesthetic-purple rounded-full" />
          </div>

          <div className="absolute -bottom-2 -right-2 p-5 bg-gradient-to-br from-aesthetic-purple to-aesthetic-darkPurple text-white rounded-full shadow-xl group-hover:scale-110 transition-transform">
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </div>
        </div>

        <div className="w-full flex-1 space-y-2 overflow-y-auto pr-2 scrollbar-cute">
          {TRACKS.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentTrack(i);
                setIsPlaying(true);
              }}
              className={`w-full text-left text-[11px] font-bold p-3 rounded-2xl transition-all flex items-center gap-3 border-2 ${
                currentTrack === i
                  ? "bg-white border-aesthetic-purple text-aesthetic-darkPurple shadow-md"
                  : "border-transparent text-aesthetic-darkPurple/60 hover:bg-white/40"
              }`}
            >
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full text-[9px] ${currentTrack === i ? "bg-aesthetic-purple text-white" : "bg-aesthetic-lavender/30"}`}
              >
                {i + 1}
              </span>
              <span className="truncate">{t.name}</span>
            </button>
          ))}
        </div>
      </div>
      <audio ref={audioRef} loop />
    </aside>
  );
}
