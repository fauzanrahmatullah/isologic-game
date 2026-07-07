"use client";
import React, { useState, useEffect } from "react";

// Offset Object
const OFFSET_TOMBOL  = -10;
const OFFSET_GATE    = -24;
const OFFSET_PORTAL  = -24;
const OFFSET_ROBOT   = -40;
const OFFSET_WALL_INNER= -40;

// Grid Size
const TILE_WIDTH = 128;
const TILE_HEIGHT = 74;

interface GameBoardProps {
  level: number;
  onWin: () => void;
}

// Array Level
/*  1 = wall
    2 = Button
    3 = Gate
    4 = Portal 
*/
const LEVEL_DATA: Record<number, number[][]> = {
  1: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 2, 1],
    [1, 0, 2, 0, 1], 
    [1, 0, 3, 3, 1], 
    [1, 1, 4, 1, 1], 
  ],
  2: [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 5, 0, 1],
    [1, 2, 0, 3, 0, 1],
    [1, 0, 0, 5, 4, 1],
    [1, 1, 1, 1, 1, 1],
  ],
  3: [
    [1, 1, 1, 1, 1],
    [1, 0, 2, 0, 1],
    [1, 1, 3, 1, 1],
    [1, 4, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  4: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 0, 0, 3, 1],
    [1, 0, 0, 0, 0, 0, 4, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

// 5-30 coming soon
for (let i = 5; i <= 30; i++) {
  LEVEL_DATA[i] = LEVEL_DATA[1];
}

// Mapping Character Assets
const ROBOT_IMAGES: Record<string, string> = {
  SW: "/assets/character-front.png",
  NE: "/assets/character-back.png",
  SE: "/assets/character-right.png",
  NW: "/assets/character-left.png",
};

// Auto-Tiling Wall Logic
function dapatkanGambarDinding(peta: number[][], x: number, y: number) {
  const adaAtas  = peta[y - 1]?.[x] === 1;
  const adaBawah = peta[y + 1]?.[x] === 1;
  const adaKiri  = peta[y]?.[x - 1] === 1;
  const adaKanan = peta[y]?.[x + 1] === 1;

  if (adaBawah && adaKanan && !adaAtas && !adaKiri) return "/assets/wall-corner-top.png";
  if (adaAtas && adaKiri && !adaBawah && !adaKanan) return "/assets/wall-corner-bottom.png";
  if (adaAtas && adaKanan && !adaBawah && !adaKiri) return "/assets/wall-corner-left.png";
  if (adaBawah && adaKiri && !adaAtas && !adaKanan) return "/assets/wall-corner-right.png";

  if (adaKiri || adaKanan) return "/assets/wall-front.png";
  return "/assets/wall-side.png";
}

export default function GameBoard({ level, onWin }: GameBoardProps) {
  const currentMap = LEVEL_DATA[level] || LEVEL_DATA[1];

  const [pos, setPos] = useState({ x: 1, y: 1 });
  const [facing, setFacing] = useState("SE");
  const [isButtonTriggered, setIsButtonTriggered] = useState(false);

  // Reset Position and Facing Direction on Level Change
  useEffect(() => {
    setPos({ x: 1, y: 1 });
    setFacing("SE");
    setIsButtonTriggered(false);
  }, [level]);

  const cekBisaJalan = (x: number, y: number) => {
    if (y < 0 || y >= currentMap.length || x < 0 || x >= currentMap[0].length) return false;
    const cell = currentMap[y][x];

    if (cell === 1 || cell === 5) return false; 
    if (cell === 3 && !isButtonTriggered) return false; 
    return true;
  };

  // Key Control Mechanism
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let { x, y } = pos;
      let newFacing = facing;

      switch (e.key) {
        case "ArrowUp":
        case "w":
          y -= 1;
          newFacing = "NE";
          break;
        case "ArrowDown":
        case "s":
          y += 1;
          newFacing = "SW";
          break;
        case "ArrowLeft":
        case "a":
          x -= 1;
          newFacing = "NW";
          break;
        case "ArrowRight":
        case "d":
          x += 1;
          newFacing = "SE";
          break;
        default:
          return;
      }

      setFacing(newFacing);

      if (cekBisaJalan(x, y)) {
        const nextCell = currentMap[y][x];
        
        if (nextCell === 2) {
          setIsButtonTriggered(true);
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
  }, [pos, facing, isButtonTriggered, level]);

  return (
    <div className="relative w-[1290px] h-[600px] border border-white/5 bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-2xl">
      <div className="absolute top-[30%] left-[50%]">
        
        {currentMap.map((row, y) => {
          return row.map((cell, x) => {
            const xIso = (x - y) * (TILE_WIDTH / 2);
            const yIso = (x + y) * (TILE_HEIGHT / 2);

            const isRobotDisini = pos.x === x && pos.y === y;
            const hitungZIndex = (x + y) * 10;

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
                {cell !== 1 && (
                  <img
                    src="/assets/normal-tile.png"
                    alt="tile"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ zIndex: 1 }}
                  />
                )}

                {/* Layer 2 = Wall */}
                {cell === 1 && (
                <img
                    src={dapatkanGambarDinding(currentMap, x, y)}
                    alt="wall"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ zIndex: 2 }}
                />
                )}

                {/* Layer 3 = Inner-Wall */}
                {cell === 5 && (
                <img
                    src="/assets/wall-front.png"
                    alt="inner-wall"
                    style={{ 
                    transform: `translateY(${OFFSET_WALL_INNER}px)`,
                    zIndex: 2 
                    }}
                    className="absolute inset-0 w-full h-full object-contain"
                />
                )}

                {/* Layer 4 = Button */}
                {cell === 2 && (
                  <img
                    src={isButtonTriggered ? "/assets/button-off.png" : "/assets/button-on.png"}
                    alt="button"
                    style={{ 
                      transform: `translateY(${OFFSET_TOMBOL}px)`,
                      zIndex: 3 
                    }}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}

                {/* Layer 5 = Gate */}
                {cell === 3 && (
                  <img
                    src={isButtonTriggered ? "/assets/gate-open-front.png" : "/assets/gate-close-front.png"}
                    alt="gate"
                    style={{ 
                      transform: `translateY(${OFFSET_GATE}px)`,
                      zIndex: 4 
                    }}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}

                {/* Layer 6 = Portal */}
                {cell === 4 && (
                  <img
                    src="/assets/portal-front.png"
                    alt="portal"
                    style={{ 
                      transform: `translateY(${OFFSET_PORTAL}px)`,
                      zIndex: 5 
                    }}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}

                {/* LAYER 7: Character */}
                {isRobotDisini && (
                  <img
                    src={ROBOT_IMAGES[facing]}
                    alt="robot"
                    style={{ 
                      transform: `translateY(${OFFSET_ROBOT}px)`,
                      zIndex: 100 
                    }}
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