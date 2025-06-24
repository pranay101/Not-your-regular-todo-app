import React, { useRef, useState } from "react";
import { Modal, Select } from "./UI";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useOutsideClick } from "../hooks";
import { isValidString } from "../utils";

interface CreateNewTodoModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  id: string;
  onTodoCreated?: () => void;
}

const CreateNewTodoModal: React.FC<CreateNewTodoModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  id,
  onTodoCreated,
}) => {
  const datePickerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    date: new Date(),
    status: "pending",
    description: "",
    priority: "medium",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, priority: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date });
      setShowDatePicker(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = async () => {
    if (!isValidString(formData.title)) return;

    try {
      setIsSubmitting(true);
      await window.ipcRenderer.invoke("todos:add", {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
      });

      // Reset form
      setFormData({
        title: "",
        date: new Date(),
        status: "pending",
        description: "",
        priority: "medium",
      });

      // Close modal and notify parent
      setIsModalOpen(false);
      onTodoCreated?.();
    } catch (error) {
      console.error("Failed to create todo:", error);
      alert("Failed to create todo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useOutsideClick(datePickerRef, () => setShowDatePicker(false));

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={setIsModalOpen.bind(null, false)}
      size="lg"
      title="Add Todo"
      closeOnBackdropClick={true}
      closeOnEscape={true}
      showCloseButton={true}
    >
      <div>
        <label className="block text-text-primary text-xs mb-1">
          Title <span className="text-primary-red text-base">*</span>
        </label>
        <input
          className="text-sm p-2 px-4 border border-stroke-primary w-full rounded-sm text-text-primary focus:outline-none"
          type="text"
          placeholder="Todo"
          value={formData.title}
          onChange={handleInputChange}
        />
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="relative">
            <label className="block text-text-primary text-xs mb-1">
              Due Date
            </label>
            <div
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="p-2 border border-stroke-primary rounded-sm text-text-primary text-sm cursor-pointer"
            >
              {formatDate(formData.date)}
            </div>
            {showDatePicker && (
              <div
                ref={datePickerRef}
                className="absolute top-full left-0 z-50 bg-primary-bg border border-stroke-primary rounded-md mt-1 p-2"
              >
                <DayPicker
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateChange}
                  className="bg-primary-bg text-white add-todo"
                  styles={{
                    caption: { color: "#fff" },
                    head_cell: { color: "#fff" },
                    cell: { color: "#fff" },
                    nav_button: { color: "#fff" },
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-text-primary text-xs mb-1">
              Priority
            </label>
            <Select
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
              value={formData.priority}
              onChange={handleSelectChange}
              placeholder="Priority"
            />
          </div>
          <div>
            <label className="block text-text-primary text-xs mb-1">
              Status
            </label>
            <Select
              options={[
                { value: "pending", label: "Pending" },
                { value: "done", label: "Completed" },
              ]}
              value={formData.status}
              onChange={handleStatusChange}
              placeholder="Status"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-text-primary text-xs mb-1">
            Description
          </label>
          <textarea
            className="max-h-[280px] h-36 p-2 border border-stroke-primary w-full text-sm rounded-sm text-text-primary outline-none"
            placeholder="Description"
            value={formData.description}
            onChange={handleDescriptionChange}
          />
        </div>

        <div className="flex grid-cols-2 gap-2 mt-4">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="border border-primary-red text-primary-red px-4 py-2 rounded-sm text-sm w-full font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValidString(formData.title) || isSubmitting}
            className="bg-primary-red text-white px-4 py-2 rounded-sm text-sm w-full font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Todo"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateNewTodoModal;
