import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { WorkoutTask } from "../types/workout";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WorkoutDialogProps {
  task: WorkoutTask | null;
  onClose: () => void;
  onSave: (task: WorkoutTask) => void;
  isOpen: boolean;
}

export function WorkoutDialog({
  task,
  onClose,
  onSave,
  isOpen,
}: WorkoutDialogProps) {
  const emptyTask: WorkoutTask = {
    id: "",
    name: "",
    sets: 0,
    reps: 0,
    description: "",
  };

  const [editedTask, setEditedTask] = useState<WorkoutTask>(emptyTask);

  useEffect(() => {
    if (isOpen && task) {
      setEditedTask(task);
    } else {
      setEditedTask(emptyTask);
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const button = e.currentTarget.querySelector('button[type="submit"]');
    if (button) {
      button.classList.add("animate-success");
      await new Promise((resolve) => setTimeout(resolve, 500));
      button.classList.remove("animate-success");
    }
    if (task?.id) {
      onSave({ ...editedTask, id: task.id });
    } else {
      onSave({ ...editedTask, id: crypto.randomUUID() });
    }
  };

  const handleClose = () => {
    setEditedTask(emptyTask);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          <Dialog.Panel className="w-full max-w-md p-8 text-left align-middle bg-white shadow-xl rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-2xl font-semibold text-secondary-800">
                {task?.id ? "Edit Exercise" : "Add New Exercise"}
              </Dialog.Title>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-secondary-50 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-secondary-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Exercise Name
                </label>
                <input
                  value={editedTask.name}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Exercise name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sets
                  </label>
                  <input
                    type="number"
                    value={editedTask.sets}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        sets: Number(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Sets"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reps
                  </label>
                  <input
                    type="number"
                    value={editedTask.reps}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        reps: Number(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Reps"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editedTask.description}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Exercise description"
                />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-300 text-secondary-800 rounded-lg hover:bg-primary-400 transition-colors font-medium"
                >
                  {task?.id ? "Save Changes" : "Add Exercise"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </motion.div>
      </div>
    </Dialog>
  );
}
