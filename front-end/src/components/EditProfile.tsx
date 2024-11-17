import { useState } from "react";
import { motion } from "framer-motion";
import { UserProfile } from "../types/profile";
import { FormField } from "./FormField";
import {
  defaultProfile,
  equipmentOptions,
  fitnessGoalsOptions,
} from "../constants/profile";
import { XCircleIcon } from "@heroicons/react/24/outline";

interface EditProfileProps {
  profile: UserProfile | null;
  onSave: (formData: UserProfile) => void;
  onCancel: () => void;
}

export function EditProfile({ profile, onSave, onCancel }: EditProfileProps) {
  const [formData, setFormData] = useState<UserProfile>(
    profile || defaultProfile
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8"
      >
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-800">
            {profile ? "Edit Profile" : "Create Your Profile"}
          </h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="p-2 hover:bg-secondary-50 rounded-full transition-colors"
          >
            <XCircleIcon className="w-6 h-6 text-secondary-400" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Physical Stats Section */}
          <div className="bg-secondary-50 p-4 sm:p-6 rounded-xl">
            <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-4">
              Physical Stats
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <FormField
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: Number(e.target.value) })
                }
                min={16}
                max={100}
                required
              />
              <FormField
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: Number(e.target.value) })
                }
                min={30}
                max={250}
                required
              />
              <FormField
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: Number(e.target.value) })
                }
                min={100}
                max={250}
                required
              />
            </div>
          </div>

          {/* Fitness Level Section */}
          <div className="bg-secondary-50 p-4 sm:p-6 rounded-xl">
            <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-4">
              Fitness Level
            </h3>
            <select
              value={formData.fitnessLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fitnessLevel: e.target.value as UserProfile["fitnessLevel"],
                })
              }
              className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-colors"
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Goals Section */}
          <div className="bg-secondary-50 p-4 sm:p-6 rounded-xl">
            <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-4">
              Fitness Goals
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {fitnessGoalsOptions.map((goal) => (
                <label
                  key={goal}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-secondary-200 cursor-pointer hover:bg-primary-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.fitnessGoals.includes(goal)}
                    onChange={(e) => {
                      const goals = e.target.checked
                        ? [...formData.fitnessGoals, goal]
                        : formData.fitnessGoals.filter((g) => g !== goal);
                      setFormData({ ...formData, fitnessGoals: goals });
                    }}
                    className="form-checkbox w-4 h-4 rounded border-secondary-300 text-primary-300 focus:ring-primary-300 focus:ring-offset-0 transition-colors"
                  />
                  <span className="text-sm font-medium text-secondary-700">
                    {goal}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Equipment Section */}
          <div className="bg-secondary-50 p-4 sm:p-6 rounded-xl">
            <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-4">
              Available Equipment
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {equipmentOptions.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-secondary-200 cursor-pointer hover:bg-primary-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.availableEquipment.includes(item)}
                    onChange={(e) => {
                      const equipment = e.target.checked
                        ? [...formData.availableEquipment, item]
                        : formData.availableEquipment.filter(
                            (eq) => eq !== item
                          );
                      setFormData({
                        ...formData,
                        availableEquipment: equipment,
                      });
                    }}
                    className="form-checkbox w-4 h-4 rounded border-secondary-300 text-primary-300 focus:ring-primary-300 focus:ring-offset-0 transition-colors"
                  />
                  <span className="text-sm font-medium text-secondary-700">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Workout Preferences */}
          <div className="bg-secondary-50 p-4 sm:p-6 rounded-xl">
            <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-4">
              Workout Preferences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                label="Preferred Workout Duration (minutes)"
                type="number"
                value={formData.preferredWorkoutDuration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferredWorkoutDuration: Number(e.target.value),
                  })
                }
                min={15}
                max={120}
                step={15}
                required
              />
              <FormField
                label="Workout Days per Week"
                type="number"
                value={formData.workoutDaysPerWeek}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    workoutDaysPerWeek: Number(e.target.value),
                  })
                }
                min={1}
                max={7}
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-2.5 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors font-medium order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-primary-300 text-secondary-800 rounded-lg hover:bg-primary-400 transition-colors font-medium order-1 sm:order-2"
            >
              Save Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
