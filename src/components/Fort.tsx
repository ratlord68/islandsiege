import React from "react";
import type { FortGridCell } from "../types";
import { CubeColors } from "../colors";

type FortGridProps = {
  grid: FortGridCell[][];
  view: "hand" | "tableau";
  showLabels?: boolean;
};

export const FortGrid: React.FC<FortGridProps> = ({ grid, view }) => {
  return (
    <div className="inline-block">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${grid[0].length}, 24px)` }}
      >
        {grid.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            let bgColor = "transparent";
            let border = "1px solid #ccc";

            if (cell.type === "cube") {
              if (view === "hand") {
                bgColor = cell.color ? CubeColors[cell.color] : "#f5f5f5"; // empty = light gray
              } else if (view === "tableau") {
                bgColor = cell.color ? CubeColors[cell.color] : "#fff"; // TODO: Empty cell color
              }
            } else {
              border = "none";
            }

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-6 h-6 rounded-sm"
                style={{
                  backgroundColor: bgColor,
                  border,
                }}
                title={`${rowIndex},${colIndex}`}
              />
            );
          }),
        )}
      </div>
    </div>
  );
};
