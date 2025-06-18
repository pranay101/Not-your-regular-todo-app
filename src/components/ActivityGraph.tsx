import { twMerge } from "tailwind-merge";
import { WEEKDAY } from "../config";
import moment from "moment";
import { ChartBarIcon } from "@heroicons/react/24/outline";

const WEEKS = 52;
const STARTING_DAY = "2025-06-15";

function generateMonthLabels(startDate: string, weeks: number): string[] {
  const labels: string[] = [];
  let previousMonth = "";

  for (let week = 0; week < weeks; week++) {
    const date = moment(startDate).add(week * 7, "days");
    const currentMonth = date.format("MMM");

    console.log("be", currentMonth, previousMonth, startDate);
    if (currentMonth !== previousMonth) {
      labels.push(currentMonth);
      previousMonth = currentMonth;
      console.log("af", currentMonth, previousMonth, startDate);
    } else {
      labels.push(""); // spacer
    }
  }

  return labels;
}

const WEEK_DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function getColorClass(count: number): string {
  const border = "border border-[#2a2a2e]";

  if (count === 0) return `bg-[#432525] ${border}`;
  if (count === 1) return `bg-[#6B3631] ${border}`;
  if (count === 2) return `bg-[#93463E] ${border}`;
  if (count === 3 || count === 4) return `bg-[#C15051] ${border}`;
  return `bg-[#E86355] ${border}`;
}

const ActivityGraph = () => {
  const monthLabels = generateMonthLabels(STARTING_DAY, WEEKS);
  console.log(monthLabels);
  return (
    <div className="bg-primary-bg border border-gray-800 rounded-xl p-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
          <ChartBarIcon className="fill-primary-red outline-none border-none" />{" "}
        </div>
        <h5 className="text-white text-xs font-medium tracking-wide">
          Pomodoro Activity
        </h5>
      </div>
      <div className=" w-full overflow-x-auto py-2">
        <div className="flex text-[10px] text-gray-400 font-medium mb-1 gap-[4px] ml-6">
          {monthLabels.map((month, index) => (
            <div key={index} className="min-w-3 text-center">
              {month}
            </div>
          ))}
        </div>

        <div className="flex items-start gap-1 relative">
          <div className="sticky top-0 left-0 text-[10px] min-w-6 leading-0 text-gray-400 bg-[rgb(26,27,28)] font-medium flex flex-col gap-1 justify-center ">
            {WEEK_DAY_LABELS.map((e) => (
              <p className="min-h-3 w-fit flex items-center justify-center">
                {e}
              </p>
            ))}
          </div>
          {Array.from({ length: WEEKS })
            .fill(0)
            .map((week, index) => (
              <div className="flex flex-col items-start justify-center gap-1 bg-transparent">
                {Array.from({ length: 7 }).map((day, i) => {
                  const randomNumber = Math.floor(Math.random() * 4);
                  return (
                    <div
                      key={`${index}-${i}`}
                      title={`${randomNumber} Contributions on ${moment(
                        STARTING_DAY
                      )
                        .add(index, "weeks")
                        .add(i, "days")
                        .format("MMM Do YY")}`}
                      className={twMerge(
                        getColorClass(randomNumber),
                        " text-white aspect-square w-3 h-3 rounded-xs"
                      )}
                    />
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
