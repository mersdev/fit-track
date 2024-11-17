import { WorkoutAnimation } from "./WorkoutAnimation";
import { motion } from "framer-motion";

interface WorkoutLayoutProps {
  children: React.ReactNode;
  completedCount: number;
}

export function WorkoutLayout({
  children,
  completedCount,
}: WorkoutLayoutProps) {
  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8"
      >
        <WorkoutAnimation completedCount={completedCount} />
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-secondary-600 text-base sm:text-lg">
            Exercises Completed
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-primary-300 mt-1 sm:mt-2">
            {completedCount}
          </p>
        </div>
      </motion.div>
      {children}
    </div>
  );
}
