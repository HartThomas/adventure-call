import React, { useState } from "react";

interface TileState {
  _containing: string;
  _x: number;
  _y: number;
}

class Tile extends React.Component<{}, TileState> {
  _containing: string;
  _x: number;
  _y: number;

  //   const [containing, setContaining] = useState(_containing)

  constructor(props: any) {
    super(props);
    this._containing = props.ground;
    this._x = props.x;
    this._y = props.y;
  }
}

export default Tile;
