import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface WorkoutAnimationProps {
  completedCount: number;
}

const quotes = ["BEAST", "POWER", "CRUSH", "FLEX", "PUSH"];

// Minimalist color palette inspired by the image
const colors = {
  background: "#FFFFFF",
  figure: "#000000",
  weights: "#40E0D0", // Turquoise
  text: "#000000",
};

export function WorkoutAnimation({ completedCount }: WorkoutAnimationProps) {
  const [isLifting, setIsLifting] = useState(false);
  const [liftCount, setLiftCount] = useState(0);
  const [prevCount, setPrevCount] = useState(completedCount);
  const [quote, setQuote] = useState(quotes[0]);
  const [textScale, setTextScale] = useState(1);
  const [textOpacity, setTextOpacity] = useState(1);

  useEffect(() => {
    if (completedCount > prevCount) {
      startLiftingSequence();
      setTextScale(1);
      setTextOpacity(0);
      setTimeout(() => {
        setQuote(quotes[completedCount % quotes.length]);
        setTextOpacity(1);
      }, 300);
    }
    setPrevCount(completedCount);
  }, [completedCount, prevCount]);

  const startLiftingSequence = () => {
    setIsLifting(true);
    setLiftCount(1);
    setTextScale(1);

    setTimeout(() => {
      setLiftCount(2);
      setTextScale(1.4);
    }, 1500);

    setTimeout(() => {
      setLiftCount(3);
      setTextScale(1.8);
    }, 3000);

    setTimeout(() => {
      setIsLifting(false);
      setLiftCount(0);
      setTextScale(1);
    }, 4500);
  };

  const getLiftProperties = () => {
    switch (liftCount) {
      case 1:
        return {
          y: -20,
          transition: { duration: 1.5, ease: "easeInOut" },
        };
      case 2:
        return {
          y: -60,
          transition: { duration: 1.2, ease: "easeInOut" },
        };
      case 3:
        return {
          y: -120,
          transition: { duration: 0.9, ease: "easeInOut" },
        };
      default:
        return {
          y: 0,
          transition: { duration: 1.5, ease: "easeInOut" },
        };
    }
  };

  return (
    <div
      className="flex justify-center items-center h-80 rounded-xl mb-5 overflow-hidden"
      style={{ background: colors.background }}
    >
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background Text */}
        <motion.text
          x="200"
          y="150"
          textAnchor="middle"
          dominantBaseline="middle"
          className="select-none"
          style={{
            fill: `${colors.text}15`,
            fontSize: "min(25vw, 150px)",
            fontFamily: "system-ui",
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
          animate={{
            scale: textScale,
            opacity: textOpacity,
            transition: { duration: 0.3, ease: "easeOut" },
          }}
        >
          {quote}
        </motion.text>

        {/* Main Figure Group */}
        <g transform="translate(100, 60)">
          {/* Figure - Much thicker outline */}
          <motion.g
            animate={{
              scale: isLifting ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <circle
              cx="100"
              cy="70"
              r="26"
              stroke={colors.figure}
              strokeWidth="8"
              fill="none"
            />
            <path
              d="M64 110 L136 110 L126 186 L74 186 Z"
              stroke={colors.figure}
              strokeWidth="8"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Dumbbell Design */}
          <motion.g animate={getLiftProperties()}>
            {/* Left Weight Plate Group */}
            <g>
              {/* Outer small rectangle */}
              <rect
                x="0"
                y="145"
                width="8"
                height="40"
                rx="2"
                stroke={colors.weights}
                strokeWidth="6"
                fill="none"
              />
              {/* Inner large rectangle */}
              <rect
                x="8"
                y="135"
                width="16"
                height="60"
                rx="2"
                stroke={colors.weights}
                strokeWidth="6"
                fill="none"
              />
              {/* Outer small rectangle */}
              <rect
                x="24"
                y="145"
                width="8"
                height="40"
                rx="2"
                stroke={colors.weights}
                strokeWidth="6"
                fill="none"
              />
            </g>

            {/* Bar */}
            <line
              x1="32"
              y1="164"
              x2="168"
              y2="164"
              stroke={colors.weights}
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Right Weight Plate Group */}
            <g>
              {/* Outer small rectangle */}
              <rect
                x="168"
                y="145"
                width="8"
                height="40"
                rx="2"
                stroke={colors.weights}
                strokeWidth="6"
                fill="none"
              />
              {/* Inner large rectangle */}
              <rect
                x="176"
                y="135"
                width="16"
                height="60"
                rx="2"
                stroke={colors.weights}
                strokeWidth="6"
                fill="none"
              />
              {/* Outer small rectangle */}
              <rect
                x="192"
                y="145"
                width="8"
                height="40"
                rx="2"
                stroke={colors.weights}
                strokeWidth="6"
                fill="none"
              />
            </g>
          </motion.g>
        </g>
      </svg>
    </div>
  );
}
