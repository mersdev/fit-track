import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserProfile } from "../types/profile";
import { PencilIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { EditProfile } from "./EditProfile";
import { equipmentOptions } from "../constants/profile";
import { KettlebellIcon, PullUpBarIcon } from "./icons/EquipmentIcons";

const equipmentIcons = {
  Dumbbells: PullUpBarIcon,
  Kettlebell: KettlebellIcon,
  "Resistance Bands": PullUpBarIcon,
  "Yoga Mat": PullUpBarIcon,
  "Pull-up Bar": PullUpBarIcon,
  Bench: PullUpBarIcon,
  None: XCircleIcon,
} as const;

function GradientOverlay() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-r from-secondary-800/90 to-primary-600/90" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-transparent" />
    </>
  );
}

const getProfileImage = (fitnessLevel: string) => {
  switch (fitnessLevel) {
    case "beginner":
      return "/images/beginner-profile.png";
    case "intermediate":
      return "/images/intermediate-profile.png";
    case "advanced":
      return "/images/advanced-profile.png";
    default:
      return "/images/beginner-profile.png";
  }
};

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setIsEditing(true);
    }
  }, []);

  const handleSave = (formData: UserProfile) => {
    localStorage.setItem("userProfile", JSON.stringify(formData));
    setProfile(formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <EditProfile
        profile={profile}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  if (!isEditing && !profile) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  }

  if (!isEditing && profile) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Banner Section */}
          <div className="relative h-32 sm:h-40 overflow-hidden">
            <GradientOverlay />
            <div className="absolute right-0 top-0 h-full w-1/3">
              <svg viewBox="0 0 100 100" className="h-full w-full opacity-10">
                <path d="M0 0 L100 0 L100 100 L50 50 Z" fill="white" />
              </svg>
            </div>
          </div>

          {/* Profile Section */}
          <div className="relative px-4 sm:px-8 pb-6">
            {/* Profile Picture */}
            <div className="absolute -top-12 sm:-top-16 left-4 sm:left-8 z-20">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <img
                  src={getProfileImage(profile.fitnessLevel)}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl border-4 border-white shadow-lg object-contain bg-white"
                />
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 sm:pt-20">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-2xl sm:text-3xl font-bold text-secondary-800">
                    Your Fitness Profile
                  </h1>
                  <p className="text-base sm:text-lg text-secondary-600 mt-1">
                    {profile.fitnessLevel.charAt(0).toUpperCase() +
                      profile.fitnessLevel.slice(1)}{" "}
                    Level
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-primary-300 text-secondary-800 rounded-lg hover:bg-primary-400 transition-colors font-medium"
                >
                  <PencilIcon className="w-5 h-5" />
                  Edit Profile
                </motion.button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mt-6 sm:mt-8">
                {/* Stats Section */}
                <div className="bg-secondary-50 p-4 sm:p-6 rounded-xl h-full">
                  <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                    Physical Stats
                  </h3>
                  <div className="space-y-3">
                    <StatItem label="Age" value={`${profile.age} years`} />
                    <StatItem label="Weight" value={`${profile.weight} kg`} />
                    <StatItem label="Height" value={`${profile.height} cm`} />
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-secondary-50 p-4 sm:p-6 rounded-xl h-full">
                  <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                    Workout Preferences
                  </h3>
                  <div className="space-y-3">
                    <StatItem
                      label="Duration"
                      value={`${profile.preferredWorkoutDuration} minutes`}
                    />
                    <StatItem
                      label="Frequency"
                      value={`${profile.workoutDaysPerWeek} days/week`}
                    />
                  </div>
                </div>

                {/* Goals Section */}
                <div className="md:col-span-2">
                  <div className="bg-secondary-50 p-4 sm:p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                      Fitness Goals
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.fitnessGoals.length > 0 ? (
                        profile.fitnessGoals.map((goal) => (
                          <span
                            key={goal}
                            className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {goal}
                          </span>
                        ))
                      ) : (
                        <span className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                          No goals set
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Equipment Section */}
                <div className="md:col-span-2">
                  <div className="bg-secondary-50 p-4 sm:p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                      Available Equipment
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.availableEquipment.map((equipment) => {
                        const Icon = (equipmentIcons[
                          equipment as keyof typeof equipmentIcons
                        ] || XCircleIcon) as React.ElementType;
                        return (
                          <div
                            key={equipment}
                            className="flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full"
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {equipment}
                            </span>
                          </div>
                        );
                      })}
                      {profile.availableEquipment.length === 0 && (
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full">
                          <XCircleIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            No equipment
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-secondary-600">{label}</span>
      <span className="font-medium text-secondary-800">{value}</span>
    </div>
  );
}
