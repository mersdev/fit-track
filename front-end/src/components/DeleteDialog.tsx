import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskName: string;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  taskName,
}: DeleteDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50"
        aria-hidden="true"
      />

      {/* Dialog positioning */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          <Dialog.Panel className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-auto p-4 sm:p-6">
            <Dialog.Title className="text-lg sm:text-xl font-semibold text-secondary-800 mb-3 sm:mb-4">
              Delete Workout Task
            </Dialog.Title>

            <p className="text-sm sm:text-base text-secondary-600 mb-5 sm:mb-6">
              Are you sure you want to delete "{taskName}"? This action cannot
              be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </motion.div>
      </div>
    </Dialog>
  );
}
