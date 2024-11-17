import { useState, useEffect, useCallback } from "react";
import { generateWorkoutPlan } from "../services/geminiService";
import { WorkoutTask } from "../types/workout";
import { WorkoutDialog } from "./WorkoutDialog";
import { DeleteDialog } from "./DeleteDialog";
import { UserProfile } from "../types/profile";
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid";
import { WorkoutLayout } from "./WorkoutLayout";
import { SkeletonTask } from "./SkeletonTask";
import { motion } from "framer-motion";
import clsx from "clsx";

export function WorkoutPlanner() {
  const [workoutPlan, setWorkoutPlan] = useState<
    (WorkoutTask & { completed?: boolean })[]
  >([]);
  const [selectedTask, setSelectedTask] = useState<WorkoutTask | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<WorkoutTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    generatePlan();
  }, []); // Auto-generate on component mount

  const generatePlan = async () => {
    setLoading(true);
    try {
      const savedProfile = localStorage.getItem("userProfile");
      if (!savedProfile) {
        throw new Error("Please create your profile first");
      }

      const userProfile: UserProfile = JSON.parse(savedProfile);
      const plan = await generateWorkoutPlan({
        age: userProfile.age,
        weight: userProfile.weight,
        height: userProfile.height,
        fitnessLevel: userProfile.fitnessLevel as
          | "beginner"
          | "intermediate"
          | "advanced",
        goals: userProfile.fitnessGoals,
        limitations: userProfile.healthConditions,
        equipment: userProfile.availableEquipment,
      });

      // Take only the first 3 exercises
      const threeTasks = plan.slice(0, 3);
      setWorkoutPlan(
        threeTasks.map((task: WorkoutTask) => ({
          ...task,
          id: crypto.randomUUID(),
        }))
      );
    } catch (error) {
      console.error("Failed to generate workout plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task: WorkoutTask) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleDelete = (task: WorkoutTask) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete?.id) {
      setWorkoutPlan((prev) =>
        prev.filter((task) => task.id !== taskToDelete.id)
      );
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const sortedWorkoutPlan = [...workoutPlan].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  const toggleComplete = useCallback((taskId: string) => {
    setWorkoutPlan((prevPlan) => {
      const newPlan = prevPlan.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });

      const newCompletedCount = newPlan.filter((task) => task.completed).length;
      setTimeout(() => setCompletedCount(newCompletedCount), 0);

      return newPlan;
    });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    transition: {
      type: "spring",
      duration: 0.5,
    },
  };

  if (loading) {
    return (
      <WorkoutLayout completedCount={completedCount}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonTask key={i} />
          ))}
        </div>
      </WorkoutLayout>
    );
  }

  return (
    <WorkoutLayout completedCount={completedCount}>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-800">
          Today's Workout
        </h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generatePlan}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-primary-300 text-secondary-800 rounded-lg hover:bg-primary-400 transition-colors font-medium"
        >
          <motion.div
            animate={loading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <ArrowPathIcon className="w-5 h-5" />
          </motion.div>
          Regenerate
        </motion.button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4 sm:space-y-5"
        layout
      >
        {sortedWorkoutPlan.map((task) => (
          <motion.div
            key={task.id}
            variants={item}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              type: "spring",
              duration: 0.5,
              layout: { duration: 0.3 },
            }}
            className={clsx(
              "bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all border",
              task.completed
                ? "border-primary-200 opacity-75"
                : "border-secondary-100"
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => task.id && toggleComplete(task.id)}
                className="p-2 hover:bg-primary-50 rounded-full transition-colors self-start"
              >
                {task.completed ? (
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <CheckCircleIconSolid className="w-6 sm:w-8 h-6 sm:h-8 text-primary-300" />
                  </motion.div>
                ) : (
                  <CheckCircleIcon className="w-6 sm:w-8 h-6 sm:h-8 text-secondary-300" />
                )}
              </motion.button>

              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-secondary-800">
                  {task.name}
                </h3>
                <p className="text-secondary-600 line-clamp-2 mt-1 sm:mt-2 text-sm sm:text-base">
                  {task.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs sm:text-sm font-medium">
                    {task.sets} sets
                  </span>
                  <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs sm:text-sm font-medium">
                    {task.reps} reps
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center">
                <button
                  onClick={() => handleEdit(task)}
                  className="p-2 sm:p-2.5 hover:bg-secondary-50 rounded-full transition-colors"
                >
                  <PencilIcon className="w-5 sm:w-6 h-5 sm:h-6 text-secondary-400" />
                </button>
                <button
                  onClick={() => handleDelete(task)}
                  className="p-2 sm:p-2.5 hover:bg-red-50 rounded-full transition-colors"
                >
                  <TrashIcon className="w-5 sm:w-6 h-5 sm:h-6 text-red-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <button
        onClick={() => handleEdit({ id: crypto.randomUUID() } as WorkoutTask)}
        className="mt-6 sm:mt-8 w-full bg-primary-300 text-secondary-800 py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-primary-400 transition-colors font-semibold text-base sm:text-lg shadow-sm"
      >
        Add Custom Exercise
      </button>

      <WorkoutDialog
        task={selectedTask}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedTask(null);
        }}
        onSave={(updatedTask) => {
          setWorkoutPlan((prev) => {
            if (prev.some((task) => task.id === updatedTask.id)) {
              // Update existing task
              return prev.map((task) =>
                task.id === updatedTask.id
                  ? { ...updatedTask, completed: task.completed }
                  : task
              );
            } else {
              // Add new task
              return [...prev, { ...updatedTask, completed: false }];
            }
          });
          setIsDialogOpen(false);
          setSelectedTask(null);
        }}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDelete}
        taskName={taskToDelete?.name || ""}
      />
    </WorkoutLayout>
  );
}
