import {
  BriefcaseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  SunIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

interface WorkModeProps {
  isWorkMode: boolean;
  onToggle: (active: boolean) => void;
}

// Custom Marquee Component
const CustomMarquee: React.FC<{
  children: React.ReactNode;
  speed?: number;
}> = ({ children, speed = 30 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const animate = () => {
      if (isHovered) return;

      if (content.offsetLeft <= -content.offsetWidth) {
        content.style.left = container.offsetWidth + "px";
      } else {
        content.style.left = content.offsetLeft - speed / 60 + "px";
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isHovered, speed]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={contentRef} className="inline-block" style={{ left: "100%" }}>
        {children}
      </div>
    </div>
  );
};

const WorkMode = ({ isWorkMode, onToggle }: WorkModeProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(25 * 60); // 25 minutes in seconds
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const timerRef = React.useRef<NodeJS.Timeout>();

  // Focus music playlist URLs (lo-fi, ambient, nature sounds)
  const focusMusicUrls = [
    "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&loop=1",
    "https://www.youtube.com/embed/rUxyKA_-grg?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&loop=1",
    "https://www.youtube.com/embed/lTRiuFIWV54?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&loop=1",
    "https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&loop=1",
  ];

  const [currentMusicIndex, setCurrentMusicIndex] = React.useState(0);

  React.useEffect(() => {
    if (isWorkMode) {
      enableDnd();
      startFocusMusic();
      startTimer();
    } else {
      stopFocusMusic();
      stopTimer();
      setTimeLeft(25 * 60); // Reset timer when work mode is disabled
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isWorkMode]);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const enableDnd = async () => {
    try {
      // Request notification permission if not granted
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }

      // Set system to Do Not Disturb mode
      if ("setAppBadge" in navigator) {
        // This is a simplified approach - in a real app you'd use proper DND APIs
        console.log("DND mode enabled");
      }

      // Show notification that DND is enabled
      if (Notification.permission === "granted") {
        new Notification("Work Mode Activated", {
          body: "Do Not Disturb mode is now enabled. Focus on your work!",
          icon: "/Icon.svg",
          silent: true,
        });
      }
    } catch (error) {
      console.error("Failed to enable DND:", error);
    }
  };

  const startFocusMusic = () => {
    setIsPlaying(true);
    if (iframeRef.current) {
      iframeRef.current.src = focusMusicUrls[currentMusicIndex];
    }
  };

  const stopFocusMusic = () => {
    setIsPlaying(false);
    if (iframeRef.current) {
      iframeRef.current.src = "";
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopFocusMusic();
    } else {
      startFocusMusic();
    }
  };

  const handleToggleWorkMode = () => {
    onToggle(!isWorkMode);
  };

  const musicTitles = [
    "Lofi Girl - Beats to Study/Relax",
    "Chillhop Music - Lofi Hip Hop",
    "Ambient Worlds - Nature Sounds",
    "Lofi Girl - Coding Night",
  ];

  return (
    <div className="component-card w-[160px] h-48 bg-primary-bg border border-stroke-primary rounded-xl p-2 flex flex-col justify-between">
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
          onClick={handleToggleWorkMode}
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
          >
            {isWorkMode ? (
              <BriefcaseIcon className="w-6 h-6 text-primary-red" />
            ) : (
              <SunIcon className="w-6 h-6 text-yellow-500" />
            )}
          </motion.div>
          {isWorkMode && (
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-sm font-medium">
              {formatTime(timeLeft)}
            </span>
          )}
        </motion.button>
      </div>

      <div className="flex items-center justify-center gap-2">
        <CustomMarquee speed={30}>
          <div className="w-full overflow-hidden whitespace-nowrap">
            {isPlaying && (
              <div className="animate-marquee inline-block">
                <span className="text-xs text-text-primary">
                  {musicTitles[currentMusicIndex]}
                </span>
              </div>
            )}
          </div>
        </CustomMarquee>
        <button onClick={toggleMusic}>
          {isPlaying ? (
            <PauseIcon className="w-6 h-6 text-text-primary bg-secondary-bg rounded-full p-1" />
          ) : (
            <PlayIcon className="w-6 h-6 text-text-primary bg-secondary-bg rounded-full p-1" />
          )}
        </button>
      </div>

      <iframe
        ref={iframeRef}
        className="hidden"
        allow="autoplay"
        title="Focus Music"
      />
    </div>
  );
};

export default WorkMode;
