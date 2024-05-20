import { useMessage } from "@/lib/store/messages";
import { stringToColor } from "@/lib/utils";
import { MouseEvent } from "react";

type CursorProps = {
  x: number | undefined;
  y: number | undefined;
  name: string;
  id: string;
};

const Cursor = (props: CursorProps) => {
  const { x, y, id, name } = props;

  const userColor = useMessage((state) => state.color);

  return (
    <div
      style={{
        color: userColor[id],
        top: y,
        left: x,
        zIndex: 10,
        width: 20,
        height: 20,
        display: "inline-block",
        position: "absolute",
        transition: "all 0.5s ease-in-out",
      }}
    >
      <svg viewBox="0 0 50 50">
        <polyline points="10,50 0,0 50,25 20,25" fill={userColor[id]} />
      </svg>
      <span
        id="cursor-text"
        style={{
          display: " inline-block",
          borderRadius: 16,
          backgroundColor: userColor[id],
          fontSize: 14,
          color: "white",
          fontWeight: "bold",
          padding: "4px 8px",
        }}
      >
        {name}
      </span>
    </div>
  );
};

export default Cursor;
