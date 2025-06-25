import {
    PaperAirplaneIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Note {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

interface QuickNoteProps {
  className?: string;
}

interface NoteContent {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

const QuickNote: React.FC<QuickNoteProps> = ({ className }) => {
  const [note, setNote] = useState<NoteContent[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load the most recent note from database
  const loadNote = async () => {
    try {
      setLoading(true);
      const notesData: Note[] = await window.ipcRenderer.invoke("notes:getAll");

      if (notesData.length > 0) {
        // Get the most recent note
        const sortedNotes = notesData.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setNote(sortedNotes);
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to load note:", error);
      setNote([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save functionality
  const saveNote = async () => {
    try {
      setSaving(true);
      await window.ipcRenderer.invoke("notes:add", content);

      // Update local state
      const updatedNote = {
        ...note,
        content,
        updated_at: new Date().toISOString(),
      };
      setNote([updatedNote, ...note]);
      setHasChanges(false);
      setContent("");
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && content.trim() !== "") {
      e.preventDefault();
      saveNote();
    }
  };

  const handleDeleteNote = (id: number) => {
    window.ipcRenderer.invoke("notes:delete", id);
    setNote(note.filter((note) => note.id !== id));
  };

  useEffect(() => {
    loadNote();
  }, []);

  if (loading) {
    return (
      <div
        className={twMerge(
          "component-card w-[292px] h-[260px] bg-primary-bg border border-stroke-primary rounded-xl p-4",
          className
        )}
      >
        <div className="animate-pulse">
          <div className="h-4 bg-secondary-bg rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-secondary-bg rounded"></div>
            <div className="h-3 bg-secondary-bg rounded"></div>
            <div className="h-3 bg-secondary-bg rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        "component-card w-[292px] h-[260px] bg-primary-bg border border-stroke-primary rounded-xl  flex flex-col",
        className
      )}
    >
      <div className="flex items-center gap-2 flex-shrink-0 p-2">
        <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
          <PencilIcon className="w-4 h-4 text-primary-red" />
        </div>
        <h5 className="text-white text-xs font-medium tracking-wide">
          Quick Notes
        </h5>
        {saving && (
          <span className="text-xs text-text-secondary">Saving...</span>
        )}
        {hasChanges && !saving && (
          <span className="text-xs text-yellow-400">•</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto text-white p-2">
        {note.length > 0 ? (
          <ul className="text-xs space-y-2">
            {note.map((note, i) => (
              <li key={i} className="point-default group">
                <span>{note.content}</span>

                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="ml-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <TrashIcon className="w-[12px] h-[12px] text-primary-red" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-text-secondary">No notes found.</div>
        )}
      </div>

      <div className="mt-2 flex-shrink-0 flex items-center gap-2 bg-transparent border-t border-stroke-primary px-2">
        <input
          type="text"
          value={content}
          onKeyDown={handleKeyDown}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a new note..."
          className="w-full h-10 text-xs  p-2 text-text-primary outline-none"
        />
        <PaperAirplaneIcon className="w-4 h-4 text-primary-red" />
      </div>
    </div>
  );
};

export default QuickNote;
