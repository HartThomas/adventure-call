"use client";
import { useEffect, useState } from "react";
import PlayingField from "./components/PlayingField";
import { Tile } from "./types/tile";

type SetStageInput = {
  newStage: Stage;
  x: number;
  y: number;
};

type Stage = "grass" | "hero" | "enemy";

type Position = { x: number; y: number };

export default function Home() {
  const field: Array<Array<Tile>> = Array(7);

  for (let i = 0; i < field.length; i++) {
    field[i] = Array<Tile>(7);
    for (let j = 0; j < field.length; j++) {
      field[i][j] = {
        stage: "grass",
        x: j,
        y: i,
      } as Tile;
    }
  }

  const [playingField, setPlayingField] = useState(field);

  const setStage = (value: Array<SetStageInput>) => {
    const newPlayingField = [...playingField];
    for (let i = 0; i < value.length; i++) {
      newPlayingField[value[i].y][value[i].x].stage = value[i].newStage;
    }
    setPlayingField(newPlayingField);
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      HandleKeyPress(e);
    });
    return () => {
      window.removeEventListener("keydown", (e) => {
        HandleKeyPress(e);
      });
    };
  }, []);

  function moveEnemy(hPosition: Position, ePosition: Position) {
    if (ePosition.x !== 8) {
      const xDiff: number = ePosition.x - hPosition.x;
      const yDiff: number = ePosition.y - hPosition.y;
      if (Math.abs(xDiff) >= Math.abs(yDiff)) {
        setStage([
          { newStage: "grass", x: ePosition.x, y: ePosition.y },
          {
            newStage: "enemy",
            x: xDiff > 0 ? ePosition.x - 1 : ePosition.x + 1,
            y: ePosition.y,
          },
        ]);
      }
      if (Math.abs(xDiff) < Math.abs(yDiff)) {
        setStage([
          { newStage: "grass", x: ePosition.x, y: ePosition.y },
          {
            newStage: "enemy",
            x: ePosition.x,
            y: yDiff > 0 ? ePosition.y - 1 : ePosition.y + 1,
          },
        ]);
      }
    }
  }

  function find(input: Stage) {
    for (let i = 0; i < playingField.length; i++) {
      for (let j = 0; j < playingField[i].length; j++) {
        if (playingField[i][j].stage === input) {
          return { x: j, y: i };
        }
      }
    }
    return { x: 8, y: 8 };
  }

  const [moveCount, setMoveCount] = useState(0);

  useEffect(() => {
    console.log({ moveCount });
    if (moveCount === 3) {
      return setStage([{ newStage: "enemy", x: 6, y: 3 }]);
    }
  }, [moveCount]);

  function comparePositions( // compares movement(key) from first position to second
    firstPosition: Position,
    secondPosition: Position,
    key: String
  ) {
    if (key === "d") {
      if (
        firstPosition.y === secondPosition.y &&
        firstPosition.x + 1 === secondPosition.x
      ) {
        return false;
      } else {
        return true;
      }
    }
    if (key === "s") {
      if (
        firstPosition.y + 1 === secondPosition.y &&
        firstPosition.x === secondPosition.x
      ) {
        return false;
      } else {
        return true;
      }
    }
    if (key === "a") {
      if (
        firstPosition.y === secondPosition.y &&
        firstPosition.x - 1 === secondPosition.x
      ) {
        return false;
      } else {
        return true;
      }
    }
    if (key === "w") {
      if (
        firstPosition.y - 1 === secondPosition.y &&
        firstPosition.x === secondPosition.x
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  function HandleKeyPress(e: KeyboardEvent) {
    if (e.key === "w") {
      const hPosition = find("hero");
      const ePosition = find("enemy");
      if (hPosition.y !== 0 && comparePositions(hPosition, ePosition, e.key)) {
        setStage([
          { newStage: "grass", x: hPosition.x, y: hPosition.y },
          { newStage: "hero", x: hPosition.x, y: hPosition.y - 1 },
        ]);
        setMoveCount((prevCount) => prevCount + 1);
        moveEnemy(hPosition, ePosition);
      }
    }
    if (e.key === "a") {
      const hPosition = find("hero");
      const ePosition = find("enemy");
      if (hPosition.x !== 0 && comparePositions(hPosition, ePosition, e.key)) {
        setStage([
          { newStage: "grass", x: hPosition.x, y: hPosition.y },
          { newStage: "hero", x: hPosition.x - 1, y: hPosition.y },
        ]);
        setMoveCount((prevCount) => prevCount + 1);
        moveEnemy(hPosition, ePosition);
      }
    }
    if (e.key === "s") {
      const hPosition = find("hero");
      const ePosition = find("enemy");
      if (hPosition.y !== 6 && comparePositions(hPosition, ePosition, e.key)) {
        setStage([
          { newStage: "grass", x: hPosition.x, y: hPosition.y },
          { newStage: "hero", x: hPosition.x, y: hPosition.y + 1 },
        ]);
        setMoveCount((prevCount) => prevCount + 1);
        moveEnemy(hPosition, ePosition);
      }
    }
    if (e.key === "d") {
      const hPosition = find("hero");
      const ePosition = find("enemy");

      if (hPosition.x !== 6 && comparePositions(hPosition, ePosition, e.key)) {
        setStage([
          { newStage: "grass", x: hPosition.x, y: hPosition.y },
          { newStage: "hero", x: hPosition.x + 1, y: hPosition.y },
        ]);
        setMoveCount((prevCount) => prevCount + 1);
        moveEnemy(hPosition, ePosition);
      }
    }
  }

  return (
    <main className="flex justify-center items-center pt-20">
      <div className="w-[600px] justify-center items-center text-center">
        <PlayingField playingField={playingField} />
      </div>
      <button
        name="hero"
        onClick={() => {
          setStage([{ newStage: "hero", x: 3, y: 3 }]);
        }}
      >
        H is for Hero
      </button>
    </main>
  );
}
