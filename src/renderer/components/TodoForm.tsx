import React, { useState } from "react";
import { useTodo } from "../contexts/TodoContext";
import { Todo } from "../types";

interface TodoFormProps {
  todo?: Todo;
  onUpdate?: (todo: Todo) => void;
  onCancel?: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, onUpdate, onCancel }) => {
  const { addTodo } = useTodo();
  const [title, setTitle] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    todo?.priority || "medium"
  );
  const [dueDate, setDueDate] = useState(todo?.dueDate?.split("T")[0] || "");
  const [category, setCategory] = useState<"work" | "personal" | undefined>(
    todo?.category
  );
  const [tags, setTags] = useState(todo?.tags?.join(", ") || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      const formattedTags = tags
        ? tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean)
        : undefined;

      const todoData = {
        title,
        description: description || undefined,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        category: category as "work" | "personal" | undefined,
        tags: formattedTags,
      };

      if (todo && onUpdate) {
        onUpdate({
          ...todo,
          ...todoData,
        });
      } else {
        await addTodo(todoData);
      }

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setCategory(undefined);
      setTags("");

      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error("Failed to save todo:", error);
      setError("Failed to save todo. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-secondary p-4 rounded-md"
    >
      {error && (
        <div className="bg-red-500 bg-opacity-20 text-red-500 p-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-secondary-light rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="What needs to be done?"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-24 resize-none bg-secondary-light rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Add some details..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
            className="w-full px-3 py-2 bg-secondary-light rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 bg-secondary-light rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <select
          id="category"
          value={category || ""}
          onChange={(e) =>
            setCategory(
              e.target.value
                ? (e.target.value as "work" | "personal")
                : undefined
            )
          }
          className="w-full px-3 py-2 bg-secondary-light rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">None</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 bg-secondary-light rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. important, meeting, etc."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-secondary-light rounded-md hover:bg-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          {todo ? "Update" : "Add"} Todo
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
