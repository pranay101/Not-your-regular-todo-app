import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { twMerge } from "tailwind-merge";
import { OnBoarding } from "../assets";

interface OnboardingProps {
  onComplete: () => void;
  className?: string;
}

interface UserData {
  name: string;
  email: string;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, className }) => {
  const [step, setStep] = React.useState(1);
  const [userData, setUserData] = React.useState<UserData>({
    name: "",
    email: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
    if (step === 3) {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!userData.name.trim()) {
      return; // Don't complete if name is empty
    }

    setLoading(true);
    try {
      // Create user in database
      const user = await window.ipcRenderer.invoke("user:create", userData);

      // Mark onboarding as completed
      await window.ipcRenderer.invoke("user:update", user.id, {
        onboarding_completed: 1,
      });

      onComplete();
    } catch (error) {
      console.error("Failed to create user:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Begin Your Journey to Success! ✨",
      subtitle: "We're excited to help you unlock your full potential",
      content: (
        <div className="space-y-6">
          <div className="w-48 mx-auto">
            <OnBoarding />
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Begin Your Journey to Success! ✨
            </h2>
            <p className="text-text-primary">
              Together, we'll create a personalized experience that helps you
              shine and achieve amazing things. Let's make every day count!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Let's Get to Know You! 👋",
      subtitle: "Your name is the first step in making this space truly yours",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your name"
                className="w-full p-4 bg-bg-secondary border text-text-primary outline-none border-stroke-primary rounded-sm"
                autoFocus
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Stay Connected! 📧",
      subtitle: "We'll keep you updated on your amazing progress",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email (optional)"
                className="w-full p-4 bg-bg-secondary border text-text-primary outline-none border-stroke-primary rounded-sm"
                autoFocus
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step - 1];

  const getNextButtonText = () => {
    if (step === 1) {
      return "Next";
    }

    if (step === 2) {
      return "Next";
    }

    if (step === 3) {
      return loading ? "Setting up..." : "Get Started";
    }
    return "Get Started 🚀";
  };

  const isNextButtonDisabled = () => {
    if (step === 2) {
      return !userData.name.trim();
    }
    return loading;
  };

  return (
    <div
      className={twMerge(
        "fixed inset-0 z-50 bg-primary-bg/50 flex items-center justify-center p-4 backdrop-blur-sm",
        className
      )}
    >
      <div className="w-full max-w-md bg-bg-secondary bg-primary-bg rounded-xl p-6 border border-stroke-primary">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-text-primary">
              Step {step} of {steps.length}
            </span>
            <span className="text-xs text-text-primary">
              {Math.round((step / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-stroke-primary rounded-full h-2">
            <div
              className="bg-primary-red h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-xl font-bold text-white mb-2">
              {currentStep.title}
            </h2>
            <p className="text-text-primary text-sm mb-6">
              {currentStep.subtitle}
            </p>
            {currentStep.content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleNext}
            disabled={isNextButtonDisabled()}
            className={twMerge(
              "px-6 py-2 w-full bg-primary-red text-white rounded-lg hover:bg-primary-red/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            )}
          >
            {getNextButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
