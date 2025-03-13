import React, { useState } from "react";
import { useSettings } from "../contexts/SettingsContext";

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const [pomodoroLength, setPomodoroLength] = useState(settings.pomodoroLength);
  const [shortBreakLength, setShortBreakLength] = useState(
    settings.shortBreakLength
  );
  const [longBreakLength, setLongBreakLength] = useState(
    settings.longBreakLength
  );
  const [longBreakInterval, setLongBreakInterval] = useState(
    settings.longBreakInterval
  );
  const [autoStartBreaks, setAutoStartBreaks] = useState(
    settings.autoStartBreaks
  );
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(
    settings.autoStartPomodoros
  );
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");

    try {
      await updateSettings({
        pomodoroLength,
        shortBreakLength,
        longBreakLength,
        longBreakInterval,
        autoStartBreaks,
        autoStartPomodoros,
        darkMode,
      });

      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveMessage("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Timer Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Timer Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="pomodoroLength"
                className="block text-sm font-medium mb-1"
              >
                Pomodoro Length (minutes)
              </label>
              <input
                id="pomodoroLength"
                type="number"
                min="1"
                max="60"
                value={pomodoroLength}
                onChange={(e) => setPomodoroLength(parseInt(e.target.value))}
                className="input w-full"
              />
            </div>

            <div>
              <label
                htmlFor="shortBreakLength"
                className="block text-sm font-medium mb-1"
              >
                Short Break Length (minutes)
              </label>
              <input
                id="shortBreakLength"
                type="number"
                min="1"
                max="30"
                value={shortBreakLength}
                onChange={(e) => setShortBreakLength(parseInt(e.target.value))}
                className="input w-full"
              />
            </div>

            <div>
              <label
                htmlFor="longBreakLength"
                className="block text-sm font-medium mb-1"
              >
                Long Break Length (minutes)
              </label>
              <input
                id="longBreakLength"
                type="number"
                min="1"
                max="60"
                value={longBreakLength}
                onChange={(e) => setLongBreakLength(parseInt(e.target.value))}
                className="input w-full"
              />
            </div>

            <div>
              <label
                htmlFor="longBreakInterval"
                className="block text-sm font-medium mb-1"
              >
                Long Break Interval (pomodoros)
              </label>
              <input
                id="longBreakInterval"
                type="number"
                min="1"
                max="10"
                value={longBreakInterval}
                onChange={(e) => setLongBreakInterval(parseInt(e.target.value))}
                className="input w-full"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <input
                id="autoStartBreaks"
                type="checkbox"
                checked={autoStartBreaks}
                onChange={(e) => setAutoStartBreaks(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="autoStartBreaks" className="ml-2 block text-sm">
                Auto-start breaks
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="autoStartPomodoros"
                type="checkbox"
                checked={autoStartPomodoros}
                onChange={(e) => setAutoStartPomodoros(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="autoStartPomodoros"
                className="ml-2 block text-sm"
              >
                Auto-start pomodoros
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>

          <div className="flex items-center">
            <input
              id="darkMode"
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="darkMode" className="ml-2 block text-sm">
              Dark Mode
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div>
            {saveMessage && (
              <p
                className={`text-sm ${
                  saveMessage.includes("Failed")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {saveMessage}
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>

      {/* About Section */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-400">Not the Regular Todo App v1.0.0</p>
        <p className="text-gray-400 mt-2">
          A feature-rich todo tracker with Pomodoro functionality.
        </p>
      </div>
    </div>
  );
};

export default Settings;
