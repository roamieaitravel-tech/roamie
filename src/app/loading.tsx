"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center gap-8">
        <motion.span
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.98, 1, 0.98],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-4xl font-bold tracking-tight text-black"
        >
          roamie
        </motion.span>

        <div className="relative w-12 h-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-full h-full border-4 border-gray-100 border-t-[#FF5A1F] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
