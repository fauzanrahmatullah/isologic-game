"use client";
import { useState, useEffect } from "react";
import GameBoard from "../components/GameBoard";
import ParticlesBackground from "../components/ParticlesBackground";

export default function Home() {
  const [gameState, setGameState] = useState<string>("menu");
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);

  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  // Load unlocked level form localStorage when first time open page
  useEffect(() => {
    const savedProgress = localStorage.getItem("isologic-unlockedLevel");
    if (savedProgress) {
      setUnlockedLevel(parseInt(savedProgress, 10));
    }
  }, []);

  // win level handler
  const handleWin = () => {
    const nextLvl = selectedLevel + 1;

    // Update unlocked level if next level is greater than current unlocked level
    //ganti kalau soon mau smpe lvl 15
    if (nextLvl > unlockedLevel && nextLvl <= 10) {
      setUnlockedLevel(nextLvl);
      localStorage.setItem("isologic-unlockedLevel", nextLvl.toString());
    }

    // move to next level or show win message if all levels completed
    //ganti kalo soon smpe lv 15
    if (nextLvl <= 10) {
      setSelectedLevel(nextLvl);
    } else {
      alert("Yes, My Dear. YOU WIN ALL LEVELS!!!");
      setGameState("level-select");
    }
  };

  return (
    <main className="w-full h-screen bg-[#060608] flex flex-col items-center justify-center overflow-hidden select-none text-white font-mono relative">
     <ParticlesBackground />

      <div className="relative z-10 flex flex-col items-center"></div>
      {/* 1. Main Menu */}
      {gameState === "menu" && (
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            ISOLOGIC GAME
          </h1>
          <p className="text-xs text-slate-500 tracking-wider mb-4">
            Solve the puzzles by moving blocks to their target positions
          </p>
          <button
            onClick={() => setGameState("level-select")}
            className="px-8 py-3 border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 rounded-md hover:bg-cyan-400 hover:text-black transition-all duration-300 tracking-widest font-bold shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
          >
            START GAME
          </button>
        </div>
      )}

      {/* 2. Select Level */}
      {gameState === "level-select" && (
        <div className="flex flex-col items-center gap-8 max-w-xl w-full px-6">
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-xl tracking-widest text-slate-400">SELECT LEVEL</h2>
          </div>
          
          {/* Grid Level Button */}
          <div className="grid grid-cols-5 gap-4 w-full">
            {levels.map((lvl) => {
              const isUnlocked = lvl <= unlockedLevel;

              return (
                <button
                  key={lvl}
                  disabled={!isUnlocked}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setGameState("game");
                  }}
                  className={`aspect-square border flex items-center justify-center text-lg font-bold rounded-lg transition-all duration-200 ${
                    isUnlocked
                      ? "border-slate-700 bg-slate-900/100 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-950/100 cursor-pointer"
                      : "border-slate-800/50 bg-slate-950/100 text-slate-600 cursor-not-allowed opacity-100"
                  }`}
                >
                  {isUnlocked ? String(lvl).padStart(2, "0") : "🔒"}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setGameState("menu")}
            className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4 tracking-wider mt-4"
          >
            BACK TO MENU
          </button>
        </div>
      )}

        {/* 3. TAMPILAN SAAT GAMEPLAY AKTIF */}
    {gameState === "game" && (
      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen p-4">
        {/* UI Info Atas */}
        <div className="w-full max-w-[1290px] flex justify-between items-center px-2 mb-2 text-xs text-slate-400 tracking-widest">
          <div>LEVEL : {String(selectedLevel).padStart(2, "0")}</div>
          <button
            onClick={() => setGameState("level-select")}
            className="hover:text-cyan-400 border border-slate-800 px-3 py-1 rounded bg-slate-900/50 transition-all cursor-pointer"
          >
            QUIT GAME
          </button>
        </div>

        {/* Render Game Board */}
        <GameBoard level={selectedLevel} onWin={handleWin} />

        {/* D-Pad phone screen */}
        <div className="flex flex-col items-center gap-2 mt-2 select-none touch:flex pointer-coarse:flex md:pointer-fine:hidden">
          {/* ArrowUp */}
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }))}
            className="w-12 h-12 bg-slate-800/80 border border-cyan-500/30 text-cyan-400 active:bg-cyan-500 active:text-black rounded-xl font-bold text-lg flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            ▲
          </button>
          
          <div className="flex gap-3">
            {/* Left, Down, Right */}
            <button onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }))} className="w-12 h-12 bg-slate-800/80 border border-cyan-500/30 text-cyan-400 active:bg-cyan-500 active:text-black rounded-xl font-bold text-lg flex items-center justify-center shadow-lg active:scale-95 transition-all">◀</button>
            <button onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }))} className="w-12 h-12 bg-slate-800/80 border border-cyan-500/30 text-cyan-400 active:bg-cyan-500 active:text-black rounded-xl font-bold text-lg flex items-center justify-center shadow-lg active:scale-95 transition-all">▼</button>
            <button onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }))} className="w-12 h-12 bg-slate-800/80 border border-cyan-500/30 text-cyan-400 active:bg-cyan-500 active:text-black rounded-xl font-bold text-lg flex items-center justify-center shadow-lg active:scale-95 transition-all">▶</button>
          </div>
        </div>

        {/* Rotate Phone Message */}
        {/* Tapi malah eror kalo di HP posisi landscape */}
        {/*
        <div className="block sm:hidden text-center text-[10px] text-amber-400/80 bg-amber-950/30 border border-amber-500/20 px-3 py-1 rounded-full mb-2">
          🔄 Rotate Your Phone For Better Experience
        </div>
        */}
      </div>
    )}

    </main>
  );
}