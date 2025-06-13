"use client";
import { CASES } from "../../data/cases";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const c = CASES.find((c) => c.slug === "trip-planning");

export default function TripPlanningPage() {
  const [modalOpen, setModalOpen] = useState(true);
  const [phone, setPhone] = useState("");
  if (!c) return null;
  return (
    <div className="flex flex-col relative md:flex-row items-center gap-10 bg-cover bg-center w-full p-10 max-w-screen text-white min-h-screen justify-center">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/images/snow-hill.jpg')] bg-cover bg-center z-[-1]" />

      <div className="fixed rounded-xl bottom-[2vh] left-0 right-0 w-full max-w-[98vw] mx-auto p-10 flex flex-col items-start text-left gap-4">
        <div className="flex justify-between items-center gap-5 w-full max-w-[1440px] mx-auto">
          <div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{c.title}</div>
              <div
                className="max-w-md font-medium
          "
              >
                {c.description}
              </div>
            </div>
          </div>

          <button className="px-4 cursor-pointer py-3 rounded-full text-lg font-medium bg-white/80 backdrop-blur-sm text-black" onClick={() => setModalOpen(true)}>
            Get a call
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="bg-white/10 backdrop-blur-lg text-white rounded-2xl p-8 shadow-xl flex flex-col gap-6 w-md max-w-[90vw]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="text-xl font-bold">Enter your number</div>
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="px-4 py-3 rounded-lg bg-black/20 inset-shadow-lg focus:outline-none focus:ring-2 focus:ring-white/70 text-white"
              />
              <div className="flex gap-3 justify-end">
                <button className="px-4 py-2 rounded-full bg-transparent transition-all cursor-pointer hover:text-black text-white font-medium hover:bg-gray-300" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700"
                  onClick={() => {
                    /* handle call logic here */ setModalOpen(false);
                  }}
                >
                  Get call
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="progressive-blur-container">
        <div className="blur-filter"></div>
        <div className="blur-filter"></div>
        <div className="blur-filter"></div>
        <div className="blur-filter"></div>
        <div className="blur-filter"></div>
        <div className="blur-filter"></div>
      </div>
    </div>
  );
}
