import { TrophyIcon } from "@heroicons/react/24/outline";
import React, { memo, useEffect } from "react";
import { BronzeBadge, GoldBadge, SilverBadge } from "../assets/StreakBadge";
import { Todo } from "../config";

interface PositionProps {
  className?: string;
  yearActivity: Todo[];
}

const getPosition = (score: number) => {
  if (score >= 20) return "Gold";
  if (score >= 10) return "Silver";
  if (score >= 5) return "Bronze";
  return score;
};

const Position = ({ yearActivity }: PositionProps) => {
  const [currentScore, setCurrentScore] = React.useState(0);

  // Calculate average completed tasks from last year
  const calculateYearlyAverage = () => {
    const completedTasks = yearActivity.filter(
      (todo) => todo.status === "done"
    ).length;
    return Math.round(completedTasks / 365); // Average per day
  };

  useEffect(() => {
    const yearlyAverage = calculateYearlyAverage();
    setCurrentScore(yearlyAverage);
  }, [yearActivity]);

  return (
    <div className="component-card w-[140px] h-48 bg-primary-bg border border-stroke-primary rounded-xl p-2 flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-2">
        <span className="rounded-full p-1 bg-secondary-bg">
          <TrophyIcon className="w-4 h-4 text-primary-red" />
        </span>
        <h5 className="text-white text-xs font-medium tracking-wide">
          Position
        </h5>
      </div>
      <div className="flex flex-col text-sm font-medium items-center justify-center gap-2 flex-1 px-4  text-text-primary text-center">
        {getPosition(currentScore) === "Gold" && <GoldBadge className="w-10" />}
        {getPosition(currentScore) === "Silver" && (
          <SilverBadge className="w-10" />
        )}
        {getPosition(currentScore) === "Bronze" && (
          <BronzeBadge className="w-10" />
        )}
        <p>{currentScore} Points.</p>
      </div>
    </div>
  );
};

export default memo(Position);
