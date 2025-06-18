import { format } from "date-fns";

interface CalendarProps {
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ className }) => {
  const today = new Date();
  const day = format(today, "d");
  const month = format(today, "MMM");
  const year = format(today, "yyyy");

  return (
    <div
      className={`flex flex-col items-center rounded-lg border border-stroke-primary bg-primary-bg p-4 text-white shadow-lg ${
        className || ""
      }`}
    >
      <div className="flex flex-col items-center">
        <span className="text-4xl font-bold">{day}</span>
        <div className="flex flex-col items-center">
          <span className="text-sm uppercase tracking-wider">{month}</span>
          <span className="text-xs text-slate-400">{year}</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
