"use client";
import { useState } from "react";
import GameBoard from "../components/GameBoard";

export default function Home() {
  const [gameState, setGameState] = useState<string>("menu");
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const levels = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <main className="w-full h-screen bg-gradient-to-br from-[#121824] to-[#0a0d14] flex flex-col items-center justify-center overflow-hidden select-none text-white font-mono">
      
      {/* 1. Main Menu */}
      {gameState === "menu" && (
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-widest text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            ISOLOGIC GAME
          </h1>
          <p className="text-xs text-slate-500 tracking-wider mb-4">
            Isometric Puzzle Game - Solve the puzzles by moving blocks to their target positions.
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
            <div className="w-12 h-[2px] bg-cyan-500"></div>
          </div>
          
          {/* Grid Tombol Level */}
          <div className="grid grid-cols-5 gap-4 w-full">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevel(lvl);
                  setGameState("game");
                }}
                className="aspect-square border border-slate-700 bg-slate-900/50 flex items-center justify-center text-lg font-bold rounded-lg hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-950/30 transition-all duration-200"
              >
                {String(lvl).padStart(2, "0")}
              </button>
            ))}
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
        <div className="relative flex flex-col items-center gap-4">
          {/* UI Info Atas */}
          <div className="w-full flex justify-between items-center px-2 text-xs text-slate-400 tracking-widest">
            <div>LEVEL : {String(selectedLevel).padStart(2, "0")}</div>
            <button
              onClick={() => setGameState("level-select")}
              className="hover:text-cyan-400 border border-slate-800 px-3 py-1 rounded bg-slate-900/50 transition-all"
            >
              QUIT GAME
            </button>
          </div>

          {/* Render Game Board */}
          <GameBoard level={selectedLevel} onWin={() => setGameState("level-select")} />
        </div>
      )}

    </main>
  );
}