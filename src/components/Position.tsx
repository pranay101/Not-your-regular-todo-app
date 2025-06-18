import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import React from "react";
import { SilverBadge } from "../assets/StreakBadge";

interface PositionProps {}

const Position: React.FC<PositionProps> = () => {
  return (
    <div className="w-[140px] h-48 bg-primary-bg border border-stroke-primary rounded-xl p-2 flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-2">
        <span className="rounded-full p-1 bg-secondary-bg">
          <BuildingLibraryIcon className="w-4 h-4 text-gold" />
        </span>
        <h5 className="text-white text-xs font-medium tracking-wide">
          Position
        </h5>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 flex-1 px-4 mt-4 text-text-primary text-center">
        <SilverBadge className="w-10" />
        <p>259 Points Rank 2 of 17</p>
      </div>
    </div>
  );
};

export default Position;
