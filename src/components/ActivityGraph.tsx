import { ChartPieIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Todo } from "../config";

const WEEKS = 52;
const DAYS = 7;
const STARTING_DAY = moment().subtract(363, "days");

function generateMonthLabels(
  startDate: moment.Moment,
  weeks: number
): string[] {
  const labels: string[] = [];
  let previousMonth = "";

  for (let week = 0; week < weeks; week++) {
    const date = moment(startDate).add(week * 7, "days");
    const currentMonth = date.format("MMM");
    if (currentMonth !== previousMonth) {
      labels.push(currentMonth);
      previousMonth = currentMonth;
    } else {
      labels.push(""); // spacer
    }
  }
  return labels;
}

const WEEK_DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function getColorClass(count: number): string {
  const border = "border border-[#2a2a2e]";
  if (count === 0) return `border border-[#2a2a2e] bg-[rgb(24,24,28)]`;
  if (count === 1) return `bg-[#6B3631] ${border}`;
  if (count === 2) return `bg-[#93463E] ${border}`;
  if (count === 3 || count === 4) return `bg-[#C15051] ${border}`;
  return `bg-[#E86355] ${border}`;
}

interface CustomTooltipProps {
  children: React.ReactNode;
  content: string;
  align?: "left" | "center" | "right";
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  children,
  content,
  align = "center",
}) => {
  const [show, setShow] = useState(false);
  let tooltipClass =
    "absolute bottom-full mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10";
  let arrowClass = "absolute bottom-[-4px] w-2 h-2 bg-gray-800 rotate-45";
  if (align === "left") {
    tooltipClass += " left-0";
    arrowClass += " left-2";
  } else if (align === "right") {
    tooltipClass += " right-0";
    arrowClass += " right-2";
  } else {
    tooltipClass += " left-1/2 transform -translate-x-1/2";
    arrowClass += " left-1/2 transform -translate-x-1/2";
  }
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
};

interface Activity {
  date: string;
  activity: number;
}

interface ActivityGraphProps {
  todos: Todo[];
}

const ActivityGraph = ({ todos }: ActivityGraphProps) => {
  const [activityMap, setActivityMap] = useState<Activity[]>([]);
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.scrollLeft = graphRef.current.scrollWidth;
    }
    const today = moment().weekday();
    const todalBoxes = 51 * 7 + today + 1;

    const map = Array.from({ length: todalBoxes }, (_, index) => {
      const date = moment().subtract(index, "days").format("YYYY-MM-DD");
      const activity = todos.filter(
        (todo: any) => todo.date === date && todo.status === "done"
      ).length;
      return { date, activity };
    });

    setActivityMap(map.reverse());
  }, [todos]);

  const monthLabels = generateMonthLabels(STARTING_DAY, WEEKS);

  function splitArrayToChunks<T>(arr: T[]): T[][] {
    const chunks: T[][] = [];
    const fullChunkSize = 7;
    const fullChunks = arr.length / 7;

    for (let i = 0; i < fullChunks * fullChunkSize; i += fullChunkSize) {
      chunks.push(arr.slice(i, i + fullChunkSize));
    }

    // Push the remaining 2 elements (if any)
    if (arr.length > fullChunks * fullChunkSize) {
      chunks.push(arr.slice(fullChunks * fullChunkSize));
    }

    return chunks;
  }

  // Build a 2D array: weeks x days
  const grid: Activity[][] = splitArrayToChunks(activityMap);

  console.log(grid, activityMap, "grid");

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
      <div ref={graphRef} className=" w-full overflow-x-auto py-2">
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
                const date = moment(STARTING_DAY)
                  .add(weekIdx * DAYS + dayIdx, "days")
                  .format("YYYY-MM-DD");
                const tooltipContent = `${count.activity} Completed on ${moment(
                  count.date
                ).format("MMM Do YY")}`;
                // Determine tooltip alignment
                let align: "left" | "center" | "right" = "center";
                if (weekIdx < 2) align = "left";
                else if (weekIdx > WEEKS - 3) align = "right";
                return (
                  <div key={`${weekIdx}-${dayIdx}`}>
                    <CustomTooltip content={tooltipContent} align={align}>
                      <div
                        className={twMerge(
                          getColorClass(count.activity),
                          " text-white aspect-square w-3 h-3 rounded-xs"
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
        <p>No Activity</p>
        <div className="flex items-center justify-center gap-[2px]">
          <div className="w-3 h-3 border border-[#2a2a2e] bg-[rgb(24,24,28)] rounded-sm" />
          <div className="w-3 h-3 border border-[#2a2a2e] bg-[rgb(255,156,154)] rounded-sm" />
          <div className="w-3 h-3 border border-[#2a2a2e] bg-[rgb(242,84,79)] rounded-sm" />
          <div className="w-3 h-3 border border-[#2a2a2e] bg-[rgb(213,63,61)] rounded-sm" />
          <div className="w-3 h-3 border border-[#2a2a2e] bg-[rgb(153,30,28)] rounded-sm" />
        </div>
        <p>5+ Activity</p>
      </div>
    </div>
  );
};

export default ActivityGraph;
