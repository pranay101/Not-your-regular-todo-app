import { ChartPieIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import React, { useMemo, useEffect, memo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Todo } from "../config";

const WEEKS = 52;
const DAYS = 7;
const STARTING_DAY = moment().subtract(363, "days");
const WEEK_DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

// Memoize month label generation since it only depends on static values
const monthLabels = (() => {
  const labels: string[] = [];
  let previousMonth = "";

  for (let week = 0; week < WEEKS; week++) {
    const date = moment(STARTING_DAY).add(week * 7, "days");
    const currentMonth = date.format("MMM");
    if (currentMonth !== previousMonth) {
      labels.push(currentMonth);
      previousMonth = currentMonth;
    } else {
      labels.push("");
    }
  }
  return labels;
})();

function calculateActivityThresholds(todos: Todo[]): number[] {
  const tasksByDay = todos.reduce((acc: { [key: string]: number }, todo) => {
    if (todo.status === "done") {
      acc[todo.date] = (acc[todo.date] || 0) + 1;
    }
    return acc;
  }, {});

  const activeDays = Object.keys(tasksByDay).length || 1;
  const avgTasksPerDay =
    Object.values(tasksByDay).reduce((sum, count) => sum + count, 0) /
    activeDays;

  return [0.5, 1, 1.5, 2, 2.5].map((multiplier) => avgTasksPerDay * multiplier);
}

const CustomTooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  align?: "left" | "center" | "right";
}> = memo(({ children, content, align = "center" }) => {
  const [show, setShow] = useState(false);

  const tooltipClass = useMemo(() => {
    let base =
      "absolute bottom-full mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10";
    if (align === "left") return `${base} left-0`;
    if (align === "right") return `${base} right-0`;
    return `${base} left-1/2 transform -translate-x-1/2`;
  }, [align]);

  const arrowClass = useMemo(() => {
    let base = "absolute bottom-[-4px] w-2 h-2 bg-gray-800 rotate-45";
    if (align === "left") return `${base} left-2`;
    if (align === "right") return `${base} right-2`;
    return `${base} left-1/2 transform -translate-x-1/2`;
  }, [align]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={tooltipClass}>
          {content}
          <div className={arrowClass}></div>
        </div>
      )}
    </div>
  );
});

interface Activity {
  date: string;
  activity: number;
}

const ActivityGraph = memo(({ todos }: { todos: Todo[] }) => {
  const [activityMap, setActivityMap] = useState<Activity[]>([]);
  const graphRef = useRef<HTMLDivElement>(null);
  const [activityThresholds, setActivityThresholds] = useState<number[]>([]);

  const getColorClass = useMemo(
    () =>
      (count: number, thresholds: number[]): string => {
        const border = "border border-[#2a2a2e]";
        if (count === 0) return `${border} bg-[rgb(24,24,28)]`;
        if (count < thresholds[0]) return `bg-[#6B3631] ${border}`;
        if (count < thresholds[1]) return `bg-[#93463E] ${border}`;
        if (count < thresholds[2]) return `bg-[#C15051] ${border}`;
        if (count < thresholds[3]) return `bg-[#E86355] ${border}`;
        return `bg-[#E86355] ${border}`;
      },
    []
  );

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.scrollLeft = graphRef.current.scrollWidth;
    }

    const today = moment().weekday();
    const totalBoxes = 51 * 7 + today + 1;

    const map = Array.from({ length: totalBoxes }, (_, index) => {
      const date = moment().subtract(index, "days").format("YYYY-MM-DD");
      const activity = todos.filter(
        (todo) => todo.date === date && todo.status === "done"
      ).length;
      return { date, activity };
    }).reverse();

    setActivityMap(map);
    setActivityThresholds(calculateActivityThresholds(todos));
  }, [todos]);

  const grid = useMemo(() => {
    const chunks: Activity[][] = [];
    for (let i = 0; i < activityMap.length; i += DAYS) {
      chunks.push(activityMap.slice(i, i + DAYS));
    }
    return chunks;
  }, [activityMap]);

  return (
    <div className="component-card bg-primary-bg border border-gray-800 rounded-xl p-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
          <ChartPieIcon className="text-primary-red" />
        </div>
        <h5 className="text-white text-xs font-medium tracking-wide">
          Pomodoro Activity
        </h5>
      </div>
      <div ref={graphRef} className="w-full overflow-x-auto py-2">
        <div className="flex text-[10px] text-gray-400 font-medium mb-1 gap-[4px] ml-6">
          {monthLabels.map((month, index) => (
            <div key={index} className="min-w-3 text-center">
              {month}
            </div>
          ))}
        </div>
        <div className="flex items-start gap-1 relative">
          <div className="sticky top-0 left-0 text-[10px] min-w-6 leading-0 text-gray-400 bg-[rgb(26,27,28)] font-medium flex flex-col gap-1 justify-center z-20">
            {WEEK_DAY_LABELS.map((e, i) => (
              <p
                key={i}
                className="min-h-3 w-fit flex items-center justify-center"
              >
                {e}
              </p>
            ))}
          </div>
          {grid.map((week, weekIdx) => (
            <div
              key={weekIdx}
              className="flex flex-col items-start justify-center gap-1 bg-transparent"
            >
              {week.map((count, dayIdx) => {
                const tooltipContent = `${count.activity} Completed on ${moment(
                  count.date
                ).format("MMM Do YY")}`;
                const align =
                  weekIdx < 2
                    ? "left"
                    : weekIdx > WEEKS - 3
                    ? "right"
                    : "center";

                return (
                  <div key={`${weekIdx}-${dayIdx}`}>
                    <CustomTooltip content={tooltipContent} align={align}>
                      <div
                        className={twMerge(
                          getColorClass(count.activity, activityThresholds),
                          "text-white aspect-square w-3 h-3 rounded-xs"
                        )}
                      />
                    </CustomTooltip>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end text-xs font-medium text-white gap-2 mt-2">
        <p>Less</p>
        <div className="flex items-center justify-center gap-[2px]">
          {["[rgb(24,24,28)]", "#6B3631", "#93463E", "#C15051", "#E86355"].map(
            (color, i) => (
              <div
                key={i}
                className={`w-3 h-3 border border-[#2a2a2e] bg-${color} rounded-sm`}
              />
            )
          )}
        </div>
        <p>More</p>
      </div>
    </div>
  );
});

export default ActivityGraph;
