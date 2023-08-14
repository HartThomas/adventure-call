import { Tile } from "../types/tile";

export default function Card(props: Tile) {
  const identifier = [props.x, props.y].join("");

  // useEffect(() => {

  // }, [props.stage]);

  return (
    <div
      key={identifier}
      id={identifier}
      className={`border-gray-200 border w-20 border-4 h-20 justify-center items-center flex rounded-lg shadow-md bg-green-100`}
    >
      <p
        className={`text-4xl font-mono text-orange-900 ${
          props.stage === "grass"
            ? "animate-none"
            : props.stage === "teleport"
            ? "animate-spin"
            : "animate-none"
        }`}
      >
        {props.stage === "grass" ? " " : props.stage[0].toUpperCase()}
      </p>
    </div>
  );
}
