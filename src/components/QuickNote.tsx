import { PencilIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

interface QuickNoteProps {
    className?: string;
}

const QuickNote: React.FC<QuickNoteProps> = ({ className }) => {
    const [note, setNote] = useState("Stop Reading my todos 😠");

    return (
        <div className={`w-[292px] h-[232px] mt-4 bg-primary-bg border border-stroke-primary rounded-xl p-2 ${className}`}>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full p-1 bg-secondary-bg">
                    <PencilIcon className="text-primary-red" />
                </div>
                <h5 className="text-white text-xs font-medium tracking-wide">
                    Quick Note
                </h5>
            </div>

            <div className="mt-4 h-[170px]">
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write your quick note here..."
                    className="w-full h-full  text-white text-sm p-3 rounded-lg resize-none outline-none"
                />
            </div>
        </div>
    );
};

export default QuickNote;
