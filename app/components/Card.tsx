import { useState, useRef, useEffect } from "react";
import { Tile } from "../types/tile";

export default function Card(props: Tile) {
  const identifier = [props.x, props.y].join("");

  // useEffect(() => {

  // }, [props.stage]);

  return (
    <div
      key={identifier}
      id={identifier}
      className="border-gray-200 border border-double w-20 border-4 h-20 justify-center items-center flex"
    >
      <p className="text-4xl font-mono">{props.stage[0].toUpperCase()}</p>
    </div>
  );
}
