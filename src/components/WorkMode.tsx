import {
  BriefcaseIcon,
  BuildingLibraryIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { SilverBadge } from "../assets/StreakBadge";
import { motion } from "framer-motion";

interface WorkModeProps {
  onModeChange?: (isWorkMode: boolean) => void;
}

const WorkMode: React.FC<WorkModeProps> = ({ onModeChange }) => {
  const [isWorkMode, setIsWorkMode] = useState(true);

  const toggleMode = () => {
    const newMode = !isWorkMode;
    setIsWorkMode(newMode);
    onModeChange?.(newMode);
  };

  return (
    <div className="w-[160px] h-36 bg-primary-bg border border-stroke-primary rounded-xl p-2 flex flex-col justify-between">
      <div className="flex items-center gap-2">
        <span className="rounded-full p-1 bg-secondary-bg">
          {isWorkMode ? (
            <BriefcaseIcon className="w-4 h-4 text-primary-red" />
          ) : (
            <SunIcon className="w-4 h-4 text-yellow-500" />
          )}
        </span>
        <h5 className="text-white text-xs font-medium tracking-wide">
          {isWorkMode ? "Work Mode" : "Break Mode"}
        </h5>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 flex-1 mt-4 px-4 text-text-primary text-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleMode}
          className={`w-[136px] h-[60px] rounded-full relative transition-colors duration-300 ${
            isWorkMode ? "bg-primary-red" : "bg-yellow-500"
          }`}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`absolute w-[48px] h-[48px] bg-white flex items-center justify-center rounded-full top-1/2 -translate-y-1/2 ${
              isWorkMode ? "left-1" : "left-[132px] -translate-x-full"
            }`}
          > {isWorkMode ? (
            <BriefcaseIcon className="w-6 h-6 text-primary-red" />
          ) : (
            <SunIcon className="w-6 h-6 text-yellow-500" />
          )}</motion.div>
        </motion.button>
      </div>
    </div>
  );
};

export default WorkMode;
