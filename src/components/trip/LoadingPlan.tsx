"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Search,
  Sparkles,
  Building,
} from "lucide-react";

const steps = [
  {
    id: "search",
    icon: Search,
    title: "Searching 500+ providers",
  },
  {
    id: "analyze",
    icon: Sparkles,
    title: "AI analyzing best routes",
  },
  {
    id: "build",
    icon: Building,
    title: "Building your itinerary",
  },
  {
    id: "finalize",
    icon: CheckCircle2,
    title: "Finalizing best prices",
  },
];

const messages = [
  "Comparing 847 flight options...",
  "Finding hidden gem hotels...",
  "Calculating optimal route...",
  "Checking for group discounts...",
  "Almost there...",
];

export default function LoadingPlan(): React.JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    }, 2400);

    const messageTimer = setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 2000);

    return () => {
      clearInterval(stepTimer);
      clearInterval(messageTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-6 py-8">
      <div className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white p-10 shadow-2xl">
        <div className="mb-10">
          <p className="text-3xl font-bold text-slate-900">roamie</p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const status = index < activeStep ? "done" : index === activeStep ? "active" : "pending";
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="relative flex items-start gap-5"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`grid h-14 w-14 place-items-center rounded-3xl border ${
                      status === "done"
                        ? "border-orange-400 bg-orange-50 text-orange-500"
                        : status === "active"
                        ? "border-orange-400 bg-orange-50 text-orange-500"
                        : "border-slate-200 bg-slate-100 text-slate-400"
                    }`}
                  >
                    {status === "done" ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : status === "active" ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  {index < steps.length - 1 ? (
                    <div className="h-[72px] w-px bg-slate-200" />
                  ) : null}
                </div>

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      status === "active"
                        ? "text-slate-900"
                        : status === "done"
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      animate={{ width: status === "active" ? "80%" : status === "done" ? "100%" : "6%" }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${
                        status === "done" ? "bg-orange-400" : status === "active" ? "bg-orange-400" : "bg-slate-300"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5 text-sm text-slate-600"
        >
          {messages[messageIndex]}
        </motion.div>
      </div>
    </div>
  );
}
