"use client";
import { useEffect, useState } from "react";
import PlayingField from "./components/PlayingField";
import { Tile } from "./types/tile";

type SetStageInput = {
  newStage: Stage;
  x: number;
  y: number;
};

type Stage = "grass" | "hero" | "enemy" | "teleport";

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
  const [showEnemyTooltip, setShowEnemyTooltip] = useState(false);
  const [showTeleportTooltip, setShowTeleportTooltip] = useState(false);
  const [canSpawnTeleport, setCanSpawnTeleport] = useState(true);
  const [lifeTotal, setLifeTotal] = useState(3);

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

  function moveEnemy() {
    const hPosition: Position = find("hero");
    const ePosition: Position = find("enemy");
    if (ePosition.x !== 8) {
      const xDiff: number = ePosition.x - hPosition.x;
      const yDiff: number = ePosition.y - hPosition.y;
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        const nextTile: Tile = look({
          x: xDiff > 0 ? ePosition.x - 1 : ePosition.x + 1,
          y: ePosition.y,
        });
        console.log(nextTile);
        if (nextTile.stage === "teleport") {
          setCanSpawnTeleport((prevBool) => !prevBool);
          setStage([
            { newStage: "grass", x: ePosition.x, y: ePosition.y },
            {
              newStage: "grass",
              x: nextTile.y,
              y: nextTile.x,
            },
            {
              newStage: "enemy",
              x: nextTile.x,
              y: nextTile.y,
            },
          ]);
        } else if (nextTile.stage === "hero") {
          setLifeTotal((lifeTotal) => lifeTotal - 1);
        } else {
          setStage([
            { newStage: "grass", x: ePosition.x, y: ePosition.y },
            {
              newStage: "enemy",
              x: xDiff > 0 ? ePosition.x - 1 : ePosition.x + 1,
              y: ePosition.y,
            },
          ]);
        }
      }
      if (Math.abs(xDiff) < Math.abs(yDiff)) {
        const nextTile: Tile = look({
          x: ePosition.x,
          y: yDiff > 0 ? ePosition.y - 1 : ePosition.y + 1,
        });
        console.log(nextTile);
        if (nextTile.stage === "teleport") {
          setCanSpawnTeleport((prevBool) => !prevBool);
          setStage([
            { newStage: "grass", x: ePosition.x, y: ePosition.y },
            {
              newStage: "grass",
              x: nextTile.y,
              y: nextTile.x,
            },
            {
              newStage: "enemy",
              x: nextTile.x,
              y: nextTile.y,
            },
          ]);
        } else if (nextTile.stage === "hero") {
          setLifeTotal((lifeTotal) => lifeTotal - 1);
        } else {
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
      if (Math.abs(xDiff) === Math.abs(yDiff)) {
        const randomNumber = Math.random();
        const nextTile: Tile = look({
          x:
            randomNumber <= 0.5
              ? ePosition.x
              : xDiff > 0
              ? ePosition.x - 1
              : ePosition.x + 1,
          y:
            randomNumber > 0.5
              ? ePosition.y
              : yDiff > 0
              ? ePosition.y - 1
              : ePosition.y + 1,
        });
        console.log(nextTile);
        if (nextTile.stage === "teleport") {
          setCanSpawnTeleport((prevBool) => !prevBool);
          setStage([
            { newStage: "grass", x: ePosition.x, y: ePosition.y },
            {
              newStage: "grass",
              x: nextTile.y,
              y: nextTile.x,
            },
            {
              newStage: "enemy",
              x: nextTile.x,
              y: nextTile.y,
            },
          ]);
        } else if (nextTile.stage === "hero") {
          setLifeTotal((lifeTotal) => lifeTotal - 1);
        } else {
          setStage([
            { newStage: "grass", x: ePosition.x, y: ePosition.y },
            {
              newStage: "enemy",
              x:
                randomNumber <= 0.5
                  ? ePosition.x
                  : xDiff > 0
                  ? ePosition.x - 1
                  : ePosition.x + 1,
              y:
                randomNumber > 0.5
                  ? ePosition.y
                  : yDiff > 0
                  ? ePosition.y - 1
                  : ePosition.y + 1,
            },
          ]);
        }
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

  function look(input: Position) {
    return playingField[input.x][input.y];
  }

  const [moveCount, setMoveCount] = useState(0);

  function checkTeleportPositions(
    hPosition: Position,
    ePosition: Position,
    potentialTeleportTile: Position
  ) {
    if (
      (hPosition.x === potentialTeleportTile.x &&
        hPosition.y === potentialTeleportTile.y) ||
      (hPosition.x === potentialTeleportTile.y &&
        hPosition.y === potentialTeleportTile.x)
    ) {
      return false;
    } else if (
      (ePosition.x === potentialTeleportTile.x &&
        ePosition.y === potentialTeleportTile.y) ||
      (ePosition.x === potentialTeleportTile.y &&
        ePosition.y === potentialTeleportTile.x)
    ) {
      return false;
    } else {
      return true;
    }
  }

  useEffect(() => {
    if (moveCount === 3) {
      setShowEnemyTooltip(!showEnemyTooltip);
      return setStage([{ newStage: "enemy", x: 6, y: 3 }]);
    }
    if (moveCount % 7 === 0 && moveCount !== 0) {
      const hPosition = find("hero");
      const ePosition = find("enemy");
      const potentialTeleportTile: Position = {
        x: Math.floor(Math.random() * 7),
        y: Math.floor(Math.random() * 7),
      };
      if (potentialTeleportTile.x === potentialTeleportTile.y) {
        const newRandomNumber = Math.random();
        potentialTeleportTile.x =
          newRandomNumber >= 0.5
            ? potentialTeleportTile.x
            : potentialTeleportTile.x + 1;
        potentialTeleportTile.y =
          newRandomNumber < 0.5
            ? potentialTeleportTile.y
            : potentialTeleportTile.y + 1;
      }

      if (
        checkTeleportPositions(hPosition, ePosition, potentialTeleportTile) &&
        canSpawnTeleport
      ) {
        setShowTeleportTooltip(true);
        setCanSpawnTeleport((prevBool) => !prevBool);
        return setStage([
          {
            newStage: "teleport",
            x: potentialTeleportTile.x,
            y: potentialTeleportTile.y,
          },
          {
            newStage: "teleport",
            x: potentialTeleportTile.y,
            y: potentialTeleportTile.x,
          },
        ]);
      } else {
        setMoveCount((prevCount) => prevCount - 1);
      }
    }
  }, [moveCount]);

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  function comparePositions( // compares movement(key) from first position to second
    firstPosition: Position,
    secondPosition: Position,
    key: String
  ) {
    if (key === "d") {
      return !(
        firstPosition.y === secondPosition.y &&
        firstPosition.x + 1 === secondPosition.x
      );
    }
    if (key === "s") {
      return !(
        firstPosition.y + 1 === secondPosition.y &&
        firstPosition.x === secondPosition.x
      );
    }
    if (key === "a") {
      return !(
        firstPosition.y === secondPosition.y &&
        firstPosition.x - 1 === secondPosition.x
      );
    }
    if (key === "w") {
      return !(
        firstPosition.y - 1 === secondPosition.y &&
        firstPosition.x === secondPosition.x
      );
    }
  }

  async function HandleKeyPress(e: KeyboardEvent) {
    if (e.key === "w") {
      const hPosition = find("hero");
      const ePosition = find("enemy");
      const nextTile: Tile = look({ x: hPosition.x, y: hPosition.y - 1 });
      if (hPosition.y !== 0 && comparePositions(hPosition, ePosition, e.key)) {
        if (nextTile.stage === "teleport") {
          setCanSpawnTeleport((prevBool) => !prevBool);
          setStage([
            { newStage: "grass", x: hPosition.x, y: hPosition.y },
            {
              newStage: "grass",
              x: nextTile.y,
              y: nextTile.x,
            },
            {
              newStage: "hero",
              x: nextTile.x,
              y: nextTile.y,
            },
          ]);
        } else {
          setStage([
            { newStage: "grass", x: hPosition.x, y: hPosition.y },
            { newStage: "hero", x: hPosition.x, y: hPosition.y - 1 },
          ]);
        }
        setMoveCount((prevCount) => prevCount + 1);
        await timeout(500);
        moveEnemy();
      }
    }
    if (e.key === "a") {
      const hPosition = find("hero");
      const ePosition = find("enemy");
      const nextTile = look({ x: hPosition.x - 1, y: hPosition.y });
      if (hPosition.x !== 0 && comparePositions(hPosition, ePosition, e.key)) {
        if (nextTile.stage === "teleport") {
          setStage([
            { newStage: "grass", x: hPosition.x, y: hPosition.y },
            {
              newStage: "grass",
              x: nextTile.y,
              y: nextTile.x,
            },
            {
              newStage: "hero",
              x: nextTile.x,
              y: nextTile.y,
            },
          ]);
          setCanSpawnTeleport((prevBool) => !prevBool);
        } else {
          setStage([
            { newStage: "grass", x: hPosition.x, y: hPosition.y },
            { newStage: "hero", x: hPosition.x - 1, y: hPosition.y },
          ]);
        }
        setMoveCount((prevCount) => prevCount + 1);
        await timeout(500);
        moveEnemy();
      }
    }
    if (e.key === "s") {
      const hPosition = find("hero");
      const ePosition = find("enemy");
      const nextTile = look({ x: hPosition.x, y: hPosition.y + 1 });
      if (hPosition.y !== 6 && comparePositions(hPosition, ePosition, e.key)) {
        if (nextTile.stage === "teleport") {
          setCanSpawnTeleport((prevBool) => !prevBool);
          setStage([
            { newStage: "grass", x: hPosition.x, y: hPosition.y },
            {
              newStage: "grass",
              x: nextTile.y,
              y: nextTile.x,
            },
            {
              newStage: "hero",
              x: nextTile.x,
              y: nextTile.y,
            },
          ]);
        } else {
          setStage([
            { newStage: "grass", x: hPosition.x, y: hPosition.y },
            { newStage: "hero", x: hPosition.x, y: hPosition.y + 1 },
          ]);
        }
        setMoveCount((prevCount) => prevCount + 1);
        await timeout(500);
        moveEnemy();
      }
    }
    if (e.key === "d") {
      const hPosition = find("hero");
      const ePosition = find("enemy");

      const nextTile = look({ x: hPosition.x + 1, y: hPosition.y });
      if (hPosition.x !== 6 && comparePositions(hPosition, ePosition, e.key)) {
        if (nextTile.stage === "teleport") {
          setCanSpawnTeleport((prevBool) => !prevBool);
          setStage([
            { newStage: "grass", x: hPosition.x, y: hPosition.y },
            {
              newStage: "grass",
              x: nextTile.y,
              y: nextTile.x,
            },
            {
              newStage: "hero",
              x: nextTile.x,
              y: nextTile.y,
            },
          ]);
        } else {
          setStage([
            { newStage: "grass", x: hPosition.x, y: hPosition.y },
            { newStage: "hero", x: hPosition.x + 1, y: hPosition.y },
          ]);
        }
        setMoveCount((prevCount) => prevCount + 1);
        await timeout(500);
        moveEnemy();
      }
    }
  }

  return (
    <main className="flex justify-left pl-20 pt-20 ">
      {lifeTotal <= 0 ? (
        <div className="text-orange-900 text-4xl font-mono">D is for Death</div>
      ) : (
        <>
          <div className="w-[600px] justify-center items-center text-center">
            <PlayingField playingField={playingField} />
            <div className="flex pt-10 pl-64">
              {lifeTotal > 0 ? <p>❤️</p> : null}
              {lifeTotal > 1 ? <p>❤️</p> : null}
              {lifeTotal > 2 ? <p>❤️</p> : null}
            </div>
          </div>
          <div className="flex flex-col justify-left w-max">
            <button
              name="hero"
              onClick={() => {
                setStage([{ newStage: "hero", x: 3, y: 3 }]);
              }}
              className="p-5 ml-2 bg-yellow-200 rounded-lg shadow-md border-gray-200 border border-4 text-orange-900 text-4xl font-mono w-fit h-20"
            >
              H is for Hero
            </button>
            {showEnemyTooltip ? (
              <div className="p-5 m-2 bg-yellow-200 rounded-lg shadow-md border-gray-200 border border-4 text-orange-900 text-4xl font-mono w-fit h-20">
                E is for Enemy
              </div>
            ) : null}
            {showTeleportTooltip ? (
              <div className="p-5 m-2 bg-yellow-200 rounded-lg shadow-md border-gray-200 border border-4 text-orange-900 text-4xl font-mono animate-spin w-fit h-20">
                T is for Teleport
              </div>
            ) : null}
          </div>{" "}
        </>
      )}
    </main>
  );
}
