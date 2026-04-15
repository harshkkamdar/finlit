"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, SkipForward } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Button from "@/components/ui/Button";

interface TourStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface GuidedTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export default function GuidedTour({
  steps,
  onComplete,
  onSkip,
}: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const Icon = step.icon;

  function handleNext() {
    if (isLastStep) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Step card */}
      <div className="relative bg-surface rounded-2xl shadow-lg shadow-black/5 overflow-hidden">
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="px-8 py-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-primary" />
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl font-bold text-dark mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-body text-base text-muted leading-relaxed max-w-sm">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === currentStep ? 24 : 8,
                  backgroundColor:
                    i === currentStep ? "#1B6B4A" : i < currentStep ? "#1B6B4A" : "#E5E7EB",
                  opacity: i === currentStep ? 1 : i < currentStep ? 0.5 : 0.4,
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onSkip}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body font-medium text-muted hover:text-dark hover:bg-gray-50 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              Skip Tour
            </button>

            <Button onClick={handleNext} size="md">
              {isLastStep ? "Get Started" : "Next"}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Step counter */}
      <p className="text-center mt-4 font-mono text-xs text-muted">
        Step {currentStep + 1} of {steps.length}
      </p>
    </div>
  );
}
