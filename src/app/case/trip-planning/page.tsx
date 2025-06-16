"use client";
import { CASES } from "../../data/cases";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ApiResponseE } from "@/app/types/enum";

const c = CASES.find((c) => c.slug === "trip-planning");

export default function TripPlanningPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  const agentId = process.env.NEXT_PUBLIC_AGENT_ID || "";

  const [calling, setCalling] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!phone) {
      toast.error("Please fill in phone number");
      return;
    }

    if (/[a-zA-Z]/.test(phone)) {
      toast.error("Phone number cannot contain letters");
      return;
    }

    if (!phone.startsWith("+")) {
      toast.error("Phone number must start with +, for example +91xxxxxxxxxx");
      return;
    }

    if (!apiKey) {
      toast.error("API key is not set, please set the NEXT_PUBLIC_API_KEY environment variable");
      return;
    }

    if (!agentId) {
      toast.error("Agent ID is not set, please set the NEXT_PUBLIC_AGENT_ID environment variable");
      return;
    }

    try {
      setCalling(true);
      const res = await fetch("https://api.yourgpt.ai/chatbot/v1/makeOutboundCall", {
        method: "POST",
        body: JSON.stringify({
          agent_id: agentId,
          call_to: phone,
          extra_data: {
            contact_data: {
              phone,
            },
          },
        }),
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
      });

      if (!res.ok) {
        toast.error("Call initiation failed");
        return;
      }

      const result = await res.json();

      if (result.type === ApiResponseE.RXSUCCESS) {
        toast.success("Call initiated successfully");
        setPhone("");
        setModalOpen(false);
      }

      if (result.type === ApiResponseE.RXERROR) {
        toast.error("Call initiation failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCalling(false);
    }
  }

  if (!c) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex flex-col relative md:flex-row items-center gap-10 bg-cover bg-center w-full p-10 max-w-screen text-white min-h-screen justify-center"
      >
        <div className="fixed top-0 left-0 w-full h-full bg-[url('/images/snow-hill.jpg')] bg-cover bg-center z-[-1]" />

        <div className="fixed rounded-xl bottom-[2vh] left-0 right-0 w-full max-w-[98vw] mx-auto p-10 flex flex-col items-start text-left gap-4">
          <div className="flex justify-between items-center gap-5 w-full max-w-[1440px] mx-auto">
            <div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{c.title}</div>
                <div className="max-w-md font-medium">{c.description}</div>
              </div>
            </div>

            <button className="px-4 cursor-pointer py-3 rounded-full text-lg font-medium bg-white/80 backdrop-blur-sm text-black" onClick={() => setModalOpen(true)}>
              Get a call
            </button>
          </div>
        </div>

        <AnimatePresence>
          {modalOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                initial={{ opacity: 0 }}
                onClick={() => {
                  setModalOpen(false);
                  setPhone("");
                }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.form
                onSubmit={handleSubmit}
                className="backdrop-blur-lg fixed inset-0 z-51 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white rounded-2xl p-8 shadow-xl flex flex-col gap-6 w-md h-fit max-w-[90vw] bg-black/10"
                initial={{ scale: 0.9, y: 20, opacity: 0, backdropFilter: "blur(0px)", filter: "blur(5px)" }}
                animate={{ scale: 1, y: 0, opacity: 1, backdropFilter: "blur(10px)", filter: "blur(0px)" }}
                exit={{ scale: 0.9, y: 20, opacity: 0, backdropFilter: "blur(0px)", filter: "blur(5px)" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="">
                  <div className="text-xl font-bold">Enter your number</div>
                  <div className="text-sm opacity-70">We will call you to help you plan your trip</div>
                </div>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-4 py-3 rounded-lg bg-black/20 inset-shadow-lg focus:outline-none focus:ring-2 focus:ring-white/70 text-white"
                />
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full bg-transparent transition-all cursor-pointer text-white font-medium hover:bg-white/20"
                    onClick={() => {
                      setModalOpen(false);
                      setPhone("");
                    }}
                  >
                    Cancel
                  </button>
                  <button disabled={calling} className="px-4 py-2 rounded-full bg-white text-black font-medium hover:bg-gray-300" type="submit">
                    {calling ? "Initiating call..." : "Get a call"}
                  </button>
                </div>
              </motion.form>
            </>
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
      </motion.div>
    </AnimatePresence>
  );
}
