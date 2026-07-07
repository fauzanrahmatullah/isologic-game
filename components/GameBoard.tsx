"use client";
import React, { useState, useEffect } from "react";

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
    [11,  0,  4,  0, 0,  11],
    [11,  0,  0,  0, 0, 11],
    [7,  5,  5,  3, 5, 8],
    [11,  2,  0,  0, 0, 11],
    [7,  5,  5,  5, 0, 11],
    [11,  0,  0,  0, 0, 11],
    [15, 12,  12, 12, 12, 14],
  ],

  3: [
    [13, 12, 10, 12, 16],
    [11,  0,  0,  0, 11],
    [ 7,  0,  0, 12, 11],
    [11,  0,  0,  0, 11],
    [15, 12, 12, 12, 14],
  ],
 
  4: [
    [13, 12, 12, 12, 12, 16],
    [11,  0,  0,  5,  0, 11],
    [11,  0,  2,  0,  0, 11],
    [11,  0,  0,  3,  0, 11],
    [11,  0,  0,  0,  4, 11],
    [15, 12, 12, 12, 12, 14],
  ],
 
  5: [
    [13, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0, 11],
    [11,  0,  7,  0,  8,  0, 11],
    [11,  0,  0,  2,  0,  0, 11],
    [11,  0,  9,  3, 10,  0, 11],
    [15, 12, 12,  4, 12, 12, 14],
  ],
 
  6: [
    [13, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0, 11],
    [11,  2,  0,  0,  0,  2, 11],
    [11,  0,  7,  0,  8,  0, 11],
    [11,  3,  0,  0,  0,  3, 11],
    [11,  0,  0,  4,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 14],
  ],
 
  7: [
    [13, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  7,  0,  0,  8,  0, 11],
    [11,  0,  0,  9, 10,  0,  0, 11],
    [11,  0,  2,  0,  0,  3,  0, 11],
    [11,  0,  0,  0,  0,  0,  4, 11],
    [15, 12, 12, 12, 12, 12, 12, 14],
  ],
 
  8: [
    [13, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  2,  0,  0,  2,  0, 11],
    [11,  0,  0,  0,  0,  0,  0, 11],
    [11,  9,  0,  0,  0,  0, 10, 11],
    [11,  0,  0,  2,  0,  0,  0, 11],
    [11,  0,  3,  3,  3,  0,  0, 11],
    [11,  0,  0,  4,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 14],
  ],
 
  9: [
    [13, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  7,  0,  0,  0, 11],
    [11,  2,  0,  0,  3,  0,  0,  2, 11],
    [11,  0,  0,  0,  3,  0,  0,  0, 11],
    [11,  0,  5,  0,  0,  0,  6,  0, 11],
    [11,  0,  0,  0,  8,  0,  0,  0, 11],
    [11,  0,  0,  0,  4,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 14],
  ],
 
  10: [
    [13, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  5,  6,  0,  5,  6,  0, 11],
    [11,  0,  0,  0,  2,  0,  0,  0, 11],
    [11,  9,  0,  7,  3,  8,  0, 10, 11],
    [11,  0,  0,  0,  3,  0,  0,  0, 11],
    [11,  0,  0,  0,  2,  0,  0,  0, 11],
    [11,  0,  0,  0,  4,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 14],
  ],
 
  11: [
    [13, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  4,  0,  0,  0,  0,  4,  0, 11],
    [11,  0,  0,  0,  7,  8,  0,  0,  0, 11],
    [11,  2,  0,  9,  0,  0, 10,  0,  2, 11],
    [11,  0,  0,  0,  3,  3,  0,  0,  0, 11],
    [11,  0,  5,  0,  0,  0,  6,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 12, 14],
  ],
 
  12: [
    [13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  5,  6,  0,  7,  0,  5,  6,  0, 11],
    [11,  0,  0,  0,  0,  8,  0,  0,  0,  0, 11],
    [11,  9,  0,  2,  0,  0,  0,  2,  0, 10, 11],
    [11,  0,  0,  0,  3,  3,  3,  0,  0,  0, 11],
    [11,  0,  6,  5,  0,  0,  0,  6,  5,  0, 11],
    [11,  0,  0,  0, 10,  0,  9,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  4,  0,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14],
  ],
 
  13: [
    [13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  7,  0,  0,  0,  0,  8,  0,  0, 11],
    [11,  0,  0,  0,  0,  3,  3,  0,  0,  0,  0, 11],
    [11,  0,  5,  0,  0,  0,  0,  0,  0,  6,  0, 11],
    [11,  0,  0,  0,  9,  0,  0, 10,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  2,  2,  0,  0,  0,  0, 11],
    [11,  0,  6,  0,  0,  0,  0,  0,  0,  5,  0, 11],
    [11,  0,  0,  0,  0,  3,  3,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  4,  0,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14],
  ],
 
  14: [
    [13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  5,  6,  0,  7,  0,  7,  0,  5,  6,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  9,  0,  2,  0, 10,  0,  9,  0,  2,  0, 10, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  3,  3,  3,  0,  0,  3,  3,  3,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  6,  5,  0,  8,  0,  8,  0,  6,  5,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  0,  0,  0,  0,  4,  0,  0,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14],
  ],
 
  15: [
    [13, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 16],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  4,  0,  5,  6,  0,  0,  5,  6,  0,  4,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  9,  0,  7,  0,  2,  0,  0,  2,  0,  8,  0, 10, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  3,  3,  0,  0,  9, 10,  0,  0,  3,  3,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  2,  0,  7,  0,  0,  0,  0,  8,  0,  2,  0, 11],
    [11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 11],
    [11,  0,  5,  6,  0,  0,  3,  3,  0,  0,  5,  6,  0, 11],
    [11,  0,  0,  0,  0,  0,  4,  4,  0,  0,  0,  0,  0, 11],
    [15, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14],
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
  
  // LOGIKA MULTI-BUTTON
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

    if (cell >= 5 && cell <= 16) return false; 
    if (cell === 3 && !isAllButtonsPressed) return false; 
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
        
        if (nextCell === 2) {
          const buttonId = `${x}-${y}`;
          if (!pressedButtons.includes(buttonId)) {
            setPressedButtons(prev => [...prev, buttonId]);
          }
        }

        if (nextCell === 4) {
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

  // Kalkulasi Auto-Scale
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
                {(isOuterWall || isInnerWall) && (
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
                      "/assets/wall-corner-right.png"
                    }
                    alt="wall"
                    style={{
                      transform: `translateY(${
                        cell <= 6 ? OFFSET_WALL_INNER : 
                        cell <= 10 ? OFFSET_WALL_T : 
                        OFFSET_WALL_OUTER
                      }px)`,
                      zIndex: 2 
                    }}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}

                {/* Layer 4 = Button */}
                {cell === 2 && (
                  <img
                    src={isThisButtonPressed ? "/assets/button-on.png" : "/assets/button-off.png"}
                    alt="button"
                    style={{ transform: `translateY(${OFFSET_TOMBOL}px)`, zIndex: 3 }}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}

                {/* Layer 5 = Gate */}
                {cell === 3 && (
                  <img
                    src={isAllButtonsPressed ? "/assets/gate-open-front.png" : "/assets/gate-close-front.png"}
                    alt="gate"
                    style={{ transform: `translateY(${OFFSET_GATE}px)`, zIndex: 4 }}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}
                {cell === 1 && (
                  <img
                    src={isAllButtonsPressed ? "/assets/gate-open-side.png" : "/assets/gate-close-side.png"}
                    alt="gate"
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