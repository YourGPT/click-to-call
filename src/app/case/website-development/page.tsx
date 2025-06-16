"use client";
import { useState } from "react";
import { CASES } from "../../data/cases";
import Image from "next/image";
import { toast } from "sonner";
import { ApiResponseE } from "@/app/types/enum";
import { AnimatePresence, motion } from "motion/react";

const c = CASES.find((c) => c.slug === "website-development");

export default function WebsiteDevelopmentPage() {
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
        className="flex flex-col md:flex-row items-center gap-10 w-full p-10 max-w-[1250px] mx-auto min-h-screen justify-center"
      >
        <span className="basis-1/2">
          <div className="flex flex-col items-start text-left gap-4">
            <span className="text-2xl font-bold">{c.title}</span>
            <span className="opacity-70 max-w-md">{c.description}</span>
            <button className="max-md:w-full cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-full" onClick={() => setModalOpen(true)}>
              Request a call
            </button>
          </div>
        </span>
        <Image width={400} height={400} className="basis-1/2 max-w-[450px]" src={"/images/analyze-data.svg"} alt={c.title} />
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
                className="backdrop-blur-lg fixed inset-0 z-51 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black rounded-2xl p-8 shadow-xl flex flex-col gap-6 w-md h-fit max-w-[90vw] bg-white"
                initial={{ scale: 0.9, y: 20, opacity: 0, filter: "blur(5px)" }}
                animate={{ scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 0.9, y: 20, opacity: 0, filter: "blur(5px)" }}
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
                  autoFocus
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-4 py-3 rounded-full bg-gray-100 inset-shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full bg-transparent transition-all cursor-pointer text-black font-medium hover:bg-black/10"
                    onClick={() => {
                      setModalOpen(false);
                      setPhone("");
                    }}
                  >
                    Cancel
                  </button>
                  <button disabled={calling} className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all cursor-pointer" type="submit">
                    {calling ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </motion.form>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
