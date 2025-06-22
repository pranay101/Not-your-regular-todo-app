import { PresentationChartBarIcon } from "@heroicons/react/24/outline";

interface PomodoroTodayProps {
    className?: string;
    totalTasks: number;
    completedTasks: number;
}

const PomodoroToday: React.FC<PomodoroTodayProps> = ({  totalTasks = 10, completedTasks = 5 }) => {
    const percentage = (completedTasks / totalTasks) * 100;
    const circumference = 2 * Math.PI * 40; // radius = 40
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="component-card w-[292px] h-[260px] bg-primary-bg border border-stroke-primary rounded-xl p-2">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
                    <PresentationChartBarIcon className="text-primary-red" />{" "}
                </div>
                <h5 className="text-white text-xs font-medium tracking-wide">
                    Pomodoro Today
                </h5>
            </div>

            <div className="flex flex-col items-center justify-center mt-4">
                <div className="relative w-full h-[120px]">
                    {/* SVG viewBox is 160x160 to match our circle dimensions */}
                    {/* Setting width and height to 120px for the circle size */}
                    <svg className="w-[120px] h-[120px] transform -rotate-90 absolute left-1/2 -translate-x-1/2" viewBox="0 0 80 80">
                        {/* Background circle */}
                        {/* cx and cy = 40 positions circle in center (80/2 = 40) */}
                        {/* r=35 defines circle radius, making it slightly smaller than viewBox */}
                        <circle
                            cx="40"
                            cy="40"
                            r="35"
                            stroke="#2a2a2e"
                            strokeWidth="4"
                            fill="none"
                        />
                        {/* Progress circle */}
                        {/* Uses same dimensions as background circle */}
                        {/* strokeDasharray and strokeDashoffset create the progress effect */}
                        <circle
                            cx="40"
                            cy="40"
                            r="35"
                            stroke="#d63f3d"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-500 ease-in-out"
                        />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-white">
                        <span className="text font-bold">{completedTasks}/{totalTasks}</span>
                    </div>
                </div>
            </div>

    
        </div>
    );
};

export default PomodoroToday;