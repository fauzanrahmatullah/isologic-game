"use client";
import React, { useState, useEffect } from "react";

// Offset Object
const OFFSET_TOMBOL      = -10;
const OFFSET_GATE        = -45;
const OFFSET_PORTAL      = -50;
const OFFSET_ROBOT       = -50;
const OFFSET_WALL_INNER  = -19;
const OFFSET_WALL_T      = -20;
const OFFSET_WALL_OUTER  = -20;

// Grid Size
const TILE_WIDTH = 128;
const TILE_HEIGHT = 76;

interface GameBoardProps {
  level: number;
  onWin: () => void;
}

// Array Level (tapi) Manual
const LEVEL_DATA: Record<number, number[][]> = {
 
  1: [
    [13, 12, 12, 10, 12, 16],
    [11,  0,  0,  6,  0, 11],
    [11,  2,  0,  1,  0, 11],
    [11,  0,  0,  6,  4, 11],
    [15, 12, 12,  9, 12, 14],
  ],

  2: [
    [13, 12, 12, 12, 12, 16],
    [11,  0,  4,  0,  0, 11],
    [11,  0,  0,  0,  0, 11],
    [ 7,  5,  5,  3,  5,  8],
    [11,  2,  0,  0,  0, 11],
    [ 7,  5,  5,  5,  0, 11],
    [11,  0,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 14],
  ],

  3: [
    [13, 12, 12, 12, 12, 12, 12, 12, 16],
    [11, 17,  0,  0,  0,  0,  0,  0, 11],
    [ 7,  5, 25,  5,  5, 20,  0,  0, 11],
    [11,  0, 51,  0,  0, 19, 42,  5,  8],
    [11,  0, 19, 20,  0,  0,  0,  0, 11],
    [11,  0, 32,  6,  0, 21,  5,  5,  8],
    [ 7,  5,  5, 18,  0, 19,  5,  5,  8],
    [11,  0,  0,  0,  0,  0,  0, 31, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 14],
  ],

  4: [
    [13, 12, 12, 12, 10, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  6, 17,  0,  6, 31, 11],
    [11, 32,  6,  0, 24,  5, 41, 23,  0, 11],
    [11,  5, 18,  0,  6,  0,  0,  6,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  6,  0, 11],
    [11,  0, 21,  5, 20,  0,  0, 52,  0, 11],
    [11,  0,  6,  2,  6,  0, 21, 18,  0, 11],
    [11,  0,  0,  0,  6,  0,  6,  2,  0, 11],
    [15, 12,  9, 12,  9, 12,  9, 12, 12, 14],
  ],

  5: [
    [13, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  2,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0, 21, 41,  5, 20, 31, 11],
    [11,  0, 21, 18,  0,  0, 24, 45,  8],
    [11,  0,  6,  0,  0,  0, 52,  0, 11],
    [11,  0,  6, 35, 21,  5, 23,  0, 11],
    [11,  0, 19,  5, 18, 32,  6,  0, 11],
    [11,  0,  0,  0,  0,  0,  6,  4, 11],
    [15, 12, 12, 12, 12, 12,  9, 12, 14],
  ],
 
  6: [
    [13, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0, 21,  5, 25, 42,  5, 20,  0, 11],
    [11,  0,  6, 33,  6,  4,  0,  6,  0, 11],
    [11,  0,  6,  0, 19,  3, 20,  6,  0, 11],
    [11,  0,  6,  0,  0,  0,  6,  6,  0, 11],
    [11,  0,  6, 32,  6,  0,  6,  6,  0, 11],
    [11,  0, 24,  5, 18,  0, 19, 18,  0, 11],
    [11,  0, 51, 31,  0,  0,  0,  0,  0, 11],
    [15, 12,  9, 12, 12, 12, 12, 12, 12, 14],
  ],

  7: [
    [13, 12, 12, 12, 10, 12, 12, 12, 16],
    [11,  0,  0,  0,  6,  0,  0,  0, 11],
    [11,  0,  6,  0,  0,  0, 21, 42,  8],
    [11,  0, 24,  5,  5, 25, 18,  0, 11],
    [11, 33,  6,  0,  0, 53,  0,  0, 11],
    [ 7,  5, 26,  5, 41,  23, 0, 21,  8],
    [11, 32,  6, 17,  0,  6,  0,  6, 11],
    [11,  0, 19,  5,  5, 18,  0, 19,  8],
    [11,  0,  0,  0,  0,  0,  0, 31, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 14],
  ],

  8: [
    [13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14],
  ],

  9: [
    [13, 12, 12, 10, 12, 12, 12, 10, 12, 12, 12, 16],
    [11, 35,  0, 51,  0,  0,  0, 52,  0,  0, 32, 11],
    [11,  5, 25, 22,  5,  5,  0,  6,  0,  0,  0, 11],
    [11,  0, 53,  0,  0,  0,  0, 24,  5, 44,  5,  8],
    [11, 31,  6,  0,  5,  5,  5, 23,  0,  0,  0, 11],
    [ 7,  5, 23,  0,  0,  0,  0, 55,  0,  0, 17, 11],
    [11, 34, 19,  5,  5, 20,  0, 19,  5,  5,  5,  8],
    [11,  0,  0,  0,  0,  6,  0,  0,  0,  0,  0, 11],
    [11,  0,  5, 20,  0, 19,  5,  0, 21,  5,  0, 11],
    [11,  0,  0,  6,  0,  0,  0,  0,  6, 33,  0, 11],
    [15, 12, 12,  9, 12, 12, 12, 12,  9, 12, 12, 14],
  ],
 
  10: [
    [13, 12, 12, 12, 12, 12, 12, 10, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0, 58,  0,  2, 11],
    [11,  0, 21,  5,  5, 20,  0,  6,  0,  0, 11],
    [11,  0,  6, 32,  0, 53,  0, 24, 47,  5,  8],
    [11,  0, 24, 42,  5, 23,  0, 56,  0, 17, 11],
    [11,  0,  6, 34,  0,  6,  0, 19,  5,  5, 22, 16],
    [11, 31,  6,  0,  0,  6,  0,  0,  0,  0,  0, 11],
    [ 7, 44, 22,  5, 41, 22,  5, 25,  5, 20,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  6,  2,  6,  0, 11],
    [15, 12, 12, 12, 12, 20,  0, 55,  0,  6,  0, 11],
    [  ,   ,   ,   ,   ,  6,  0, 19,  5, 18,  0, 11],
    [  ,   ,   ,   ,   ,  6,  0,  0,  0,  0,  0, 11],
    [  ,   ,   ,   ,   , 15, 12, 12, 12, 12, 12, 14],
  ],

 
  11: [
    [13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14],
  ],
 
  12: [
    [13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [15, 12, 12,  9, 12, 12,  9, 12, 12, 12,  9, 12, 12, 14],
  ],
 
  13: [
    [13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14],
  ],
 
  14: [
    [13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14],
  ],
 
  15: [
    [13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14],
  ],
};

// Character Assets
const ROBOT_IMAGES: Record<string, string> = {
  SW: "/assets/character-front.png",
  NE: "/assets/character-back.png",
  SE: "/assets/character-right.png",
  NW: "/assets/character-left.png",
};

export default function GameBoard({ level, onWin }: GameBoardProps) {
  const currentMap = LEVEL_DATA[level] || LEVEL_DATA[1];

  const [pos, setPos] = useState({ x: 1, y: 1 });
  const [facing, setFacing] = useState("SE");
  
  // MULTI-BUTTON Logic
  const [pressedButtons, setPressedButtons] = useState<string[]>([]);
  const totalButtons = currentMap.flat().filter(cell => cell === 2).length;
  const isAllButtonsPressed = totalButtons > 0 && pressedButtons.length === totalButtons;

  // Reset Position
  useEffect(() => { 
    let startX = 1, startY = 1;
    for (let r = 0; r < currentMap.length; r++) {
      for (let c = 0; c < currentMap[r].length; c++) {
        if (currentMap[r][c] === 0) {
          startX = c; startY = r; break;
        }
      }
    }
    setPos({ x: startX, y: startY });
    setFacing("SE");
    setPressedButtons([]);
  }, [level, currentMap]);

  // blokir langkah kalau nabrak penghalang
  const cekBisaJalan = (x: number, y: number) => {
  if (y < 0 || y >= currentMap.length || x < 0 || x >= currentMap[0].length) return false;
  const cell = currentMap[y][x];

  // block semua dinding
  if ((cell >= 5 && cell <= 16) || (cell >= 18 && cell <= 29)) return false; 

  // 2. Gate Global (lama)
  if ((cell === 1 || cell === 3) && !isAllButtonsPressed) return false; 

  // 3. Gate FRONT / Lurus (41-49) : Membutuhkan Tombol 31-39 (cell - 10)
  if (cell >= 41 && cell <= 49) {
    const targetButtonId = cell - 10; 
    const isOpen = pressedButtons.some(id => id.startsWith(`${targetButtonId}-`));
    if (!isOpen) return false;
  }

  // 4. Gate SIDE / Miring (51-59) : Membutuhkan Tombol 31-39 (cell - 20)
  if (cell >= 51 && cell <= 59) {
    const targetButtonId = cell - 20; 
    const isOpen = pressedButtons.some(id => id.startsWith(`${targetButtonId}-`));
    if (!isOpen) return false;
  }
  
  return true;
  };

  // Mekanism Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let { x, y } = pos;
      let newFacing = facing;

      switch (e.key) {
        case "ArrowUp":
        case "w": y -= 1; newFacing = "NE"; break;
        case "ArrowDown":
        case "s": y += 1; newFacing = "SW"; break;
        case "ArrowLeft":
        case "a": x -= 1; newFacing = "NW"; break;
        case "ArrowRight":
        case "d": x += 1; newFacing = "SE"; break;
        default: return;
      }

      setFacing(newFacing);

      if (cekBisaJalan(x, y)) {
        const nextCell = currentMap[y][x];
        
        if (nextCell === 2 || (nextCell >= 31 && nextCell <= 39)) {
          const buttonId = `${nextCell}-${x}-${y}`;
          
          if (!pressedButtons.includes(buttonId)) {
            setPressedButtons(prev => [...prev, buttonId]);
          }
        }

        // jika next adalah portal
        if (nextCell === 4 || nextCell === 17) {
          alert("LEVEL SELESAI!");
          onWin();
          return;
        }

        setPos({ x, y });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pos, facing, pressedButtons, isAllButtonsPressed, level, currentMap]);

  // Auto-Scale
  const baris = currentMap.length;
  const kolom = currentMap[0].length;
  const mapPixelWidth = (kolom + baris) * (TILE_WIDTH / 2);
  const mapPixelHeight = (kolom + baris) * (TILE_HEIGHT / 2);
  const MAX_CONTAINER_WIDTH = 1100;
  const MAX_CONTAINER_HEIGHT = 500;

  let scale = Math.min(
    MAX_CONTAINER_WIDTH / mapPixelWidth,
    MAX_CONTAINER_HEIGHT / mapPixelHeight
  );

  if (scale > 1.2) scale = 1.2;

  const PADDING_ATAS = 50;
  const yCenterOffset = (mapPixelHeight / 2) - PADDING_ATAS;

  return (
    <div className="relative w-[1290px] h-[600px] border border-white/5 bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-2xl overflow-hidden">
      
      <div 
        className="absolute transition-transform duration-500 ease-in-out"
        style={{ 
          left: "50%", 
          top: "50%",
          transform: `scale(${scale}) translateY(-${yCenterOffset}px)` 
        }}
      >
        
        {currentMap.map((row, y) => {
          return row.map((cell, x) => {
            const xIso = (x - y) * (TILE_WIDTH / 2);
            const yIso = (x + y) * (TILE_HEIGHT / 2);

            const isRobotDisini = pos.x === x && pos.y === y;
            const hitungZIndex = (x + y) * 10;
            const isThisButtonPressed = pressedButtons.includes(`${x}-${y}`);

            const isBorderLuar = y === 0 || x === 0 || y === currentMap.length - 1 || x === currentMap[0].length - 1;
            const isOuterWall = cell >= 11 && cell <= 16;
            const isInnerWall = cell >= 5 && cell <= 10;

            // Render lantai hanya jika bukan dinding luar, dan bukan dinding dalam yang nempel di border
            const butuhLantai = !isOuterWall && !(isBorderLuar && isInnerWall);

            return (
              <div
                key={`${x}-${y}`}
                style={{
                  position: "absolute",
                  left: `${xIso}px`,
                  top: `${yIso}px`,
                  transform: "translate(-50%, -50%)",
                  width: `${TILE_WIDTH}px`,
                  height: `${TILE_WIDTH}px`,
                  zIndex: hitungZIndex,
                }}
              >

                {/* Layer 1 = Base Floor */}
                {butuhLantai && (
                  <img
                    src="/assets/normal-tile.png"
                    alt="tile"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ zIndex: 1 }}
                  />
                )}

               {/* Layer 2 & 3 = All Wall */}
                {((cell >= 5 && cell <= 16) || cell >= 18) && (
                  <img
                    src={
                      cell === 5 ? "/assets/inner-wall-straight-se.png" :
                      cell === 6 ? "/assets/inner-wall-straight-sw.png" :
                      cell === 7 ? "/assets/inner-wall-t-south.png" :
                      cell === 8 ? "/assets/inner-wall-t-north.png" :
                      cell === 9 ? "/assets/inner-wall-t-east.png" :
                      cell === 10 ? "/assets/inner-wall-t-west.png" :
                      cell === 11 ? "/assets/wall-side.png" :
                      cell === 12 ? "/assets/wall-front.png" :
                      cell === 13 ? "/assets/wall-corner-top.png" :
                      cell === 14 ? "/assets/wall-corner-bottom.png" :
                      cell === 15 ? "/assets/wall-corner-left.png" :
                      cell === 16 ? "/assets/wall-corner-right.png" :
                      cell === 18 ? "/assets/inner-L-Bottom.png" :
                      cell === 19 ? "/assets/inner-L-Left.png" :
                      cell === 20 ? "/assets/inner-L-Right.png" :
                      cell === 21 ? "/assets/inner-L-Top.png" :
                      cell === 22 ? "/assets/inner-T-E.png" :
                      cell === 23 ? "/assets/inner-T-N.png" :
                      cell === 24 ? "/assets/inner-T-S.png" :
                      cell === 25 ? "/assets/inner-T-W.png" :
                      cell === 26 ? "/assets/inner+.png" : 
                      "/assets/broken-tile.png"
                    }
                    alt="wall"
                    style={{
                      transform: `translateY(${
                        cell === 5 || cell === 6 ? OFFSET_WALL_INNER : 
                        cell >= 7 && cell <= 10 ? OFFSET_WALL_T : 
                        cell >= 11 && cell <= 16 ? OFFSET_WALL_OUTER :
                        cell >= 18 && cell <= 29 ? OFFSET_WALL_INNER :
                        0
                      }px)`,
                      zIndex: 2
                    }}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}

                {/* Layer 4 = Button (Global && ID 31-39) */}
                {(cell === 2 || (cell >= 31 && cell <= 39)) && (
                  <img
                    src={pressedButtons.some(id => id.endsWith(`-${x}-${y}`)) ? "/assets/button-on.png" : "/assets/button-off.png"}
                    alt="button"
                    style={{ transform: `translateY(${OFFSET_TOMBOL}px)`, zIndex: 3 }}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}

                {/* Layer 5 = Gate Front (Global && ID 41-49) */}
                {(cell === 3 || (cell >= 41 && cell <= 49)) && (
                  <img
                    src={
                      cell === 3 ? (isAllButtonsPressed ? "/assets/gate-open-front.png" : "/assets/gate-close-front.png") :
                      // Untuk 41-49 - cari tombol dengan ID: cell dikurangi 10
                      (pressedButtons.some(id => id.startsWith(`${cell - 10}-`)) ? "/assets/gate-open-front.png" : "/assets/gate-close-front.png")
                    }
                    alt="gate-front"
                    style={{ transform: `translateY(${OFFSET_GATE}px)`, zIndex: 4 }}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}

                {/* Layer 5.5 = Gate Side (Global && ID 51-59) */}
                {(cell === 1 || (cell >= 51 && cell <= 59)) && (
                  <img
                    src={
                      cell === 1 ? (isAllButtonsPressed ? "/assets/gate-open-side.png" : "/assets/gate-close-side.png") :
                      // Untuk 51-59 - cari tombol dengan ID: cell dikurangi 20
                      (pressedButtons.some(id => id.startsWith(`${cell - 20}-`)) ? "/assets/gate-open-side.png" : "/assets/gate-close-side.png")
                    }
                    alt="gate-side"
                    style={{ transform: `translateY(${OFFSET_GATE}px)`, zIndex: 4 }}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}

                {/* Layer 6 = Portal Manual */}
            {(cell === 4 || cell === 17) && (
              <img
                src={cell === 4 ? "/assets/portal-front.png" : "/assets/portal-side.png"}
                alt="portal"
                style={{ transform: `translateY(${OFFSET_PORTAL}px)`, zIndex: 5 }}
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}

                {/* LAYER 7: Character */}
                {isRobotDisini && (
                  <img
                    src={ROBOT_IMAGES[facing]}
                    alt="robot"
                    style={{ transform: `translateY(${OFFSET_ROBOT}px)`, zIndex: 100 }}
                    className="absolute inset-0 w-full h-full object-contain transition-all duration-150 ease-out"
                  />
                )}

              </div>
            );
          });
        })}

      </div>
    </div>
  );
}