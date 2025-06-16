"use client";
import { useState } from "react";
import { CASES } from "../../data/cases";
import Image from "next/image";
import { ApiResponseE } from "@/app/types/enum";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";

const c = CASES.find((c) => c.slug === "doctor-appointment");

export default function DoctorAppointmentPage() {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  const agentId = process.env.NEXT_PUBLIC_AGENT_ID || "";
  const [data, setData] = useState<{ name: string; phone: string }>({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data.name || !data.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    if (/[a-zA-Z]/.test(data.phone)) {
      toast.error("Phone number cannot contain letters");
      return;
    }

    if (!data.phone.startsWith("+")) {
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
      setLoading(true);
      const res = await fetch("https://api.yourgpt.ai/chatbot/v1/makeOutboundCall", {
        method: "POST",
        body: JSON.stringify({
          agent_id: agentId,
          call_to: data.phone,
          extra_data: {
            contact_data: {
              name: data.name,
              phone: data.phone,
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
        setData({ name: "", phone: "" });
      }

      if (result.type === ApiResponseE.RXERROR) {
        toast.error("Call initiation failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
        className="flex items-center gap-10 w-full max-w-screen p-3 h-screen min-h-screen"
      >
        <div className="basis-1/2 max-md:hidden relative w-full h-full">
          <Image fill className="rounded-lg h-full object-cover object-[0%_50%]" src={"/images/clinic.jpg"} alt={c.title} />
        </div>
        <span className="flex-1 md:basis-1/2">
          <form onSubmit={handleSubmit} className="flex flex-col items-center text-center justify-center w-full gap-2">
            <span className="text-3xl font-bold">{c.title}</span>
            <span className=" opacity-70 max-w-md">{c.description}</span>
            <div className="flex flex-col gap-2 w-full max-w-md pt-5">
              <input type="text" placeholder="Name" className="w-full p-2 rounded-md border border-gray-200" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
              <input type="text" placeholder="Phone" className="w-full p-2 rounded-md border border-gray-200" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
            </div>
            <button type="submit" className={`w-full max-w-md cursor-pointer bg-blue-500 text-white px-4 text-sm py-3 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
              {loading ? "Initiating call..." : "Get a call"}
            </button>
          </form>
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
