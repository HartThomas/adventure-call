import Card from "./Card";
import { Tile } from "../types/tile";
import { useEffect } from "react";

export default function PlayingField(props: {
  playingField: Array<Array<Tile>>;
}) {
  // useEffect(() => {

  // }, [props.playingField]);

  return (
    <ul className="grid grid-cols-7 gap-y-2">
      {props.playingField.map((tileArray) => {
        return tileArray.map((ele: Tile) => {
          return <Card {...ele} key={+(ele.x.toString() + ele.y.toString())} />;
        });
      })}
    </ul>
  );
}
