"use client";

import { ApiResponseE } from "@/app/types/enum";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
// import styles from "./index.module.css"; // Remove if not needed

const agentGradients = {
  agentAlpha: "bg-gradient-to-br from-purple-500 to-purple-700",
  agentBeta: "bg-gradient-to-br from-emerald-500 to-emerald-700",
  agentGamma: "bg-gradient-to-br from-yellow-400 to-yellow-600",
  agentDelta: "bg-gradient-to-br from-red-500 to-red-700",
};

const YourCRM = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const phoneElemRef = useRef<HTMLInputElement>(null);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  const agentId = process.env.NEXT_PUBLIC_AGENT_ID || "";

  const [calling, setCalling] = useState(false);

  async function onAgentSelect() {
    if (!phone) {
      toast.error("Please fill in phone number");
      setIsDropdownOpen(false);
      phoneElemRef.current?.focus();
      return;
    }

    if (/[a-zA-Z]/.test(phone)) {
      toast.error("Phone number cannot contain letters");
      setIsDropdownOpen(false);
      phoneElemRef.current?.focus();
      return;
    }

    if (!phone.startsWith("+")) {
      toast.error("Phone number must start with +, for example +91xxxxxxxxxx");
      setIsDropdownOpen(false);
      phoneElemRef.current?.focus();
      return;
    }

    if (!apiKey) {
      toast.error("API key is not set, please set the NEXT_PUBLIC_API_KEY environment variable");
      setIsDropdownOpen(false);
      return;
    }

    if (!agentId) {
      toast.error("Agent ID is not set, please set the NEXT_PUBLIC_AGENT_ID environment variable");
      setIsDropdownOpen(false);
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
        setIsDropdownOpen(false);
        setPhone("");
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

  const YOUR_CRM_AGENTS = [
    {
      id: "cs",
      name: "Customer Support Agent",
      specialty: "General inquiries and assistance",
      icon: "CS",
      colorClass: "agentAlpha" as keyof typeof agentGradients,
    },
    {
      id: "sa",
      name: "Sales & Upselling Agent",
      specialty: "Product recommendations and sales",
      icon: "SA",
      colorClass: "agentBeta" as keyof typeof agentGradients,
    },
    {
      id: "fa",
      name: "Feedback Agent",
      specialty: "Collect customer feedback and reviews",
      icon: "FA",
      colorClass: "agentGamma" as keyof typeof agentGradients,
    },
    {
      id: "ts",
      name: "Technical Support Agent",
      specialty: "Technical issues and troubleshooting",
      icon: "TS",
      colorClass: "agentDelta" as keyof typeof agentGradients,
    },
  ];

  const customerData = {
    name: "Liam Carter",
    id: "123456",
    email: "liam.carter@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    firstInteraction: "January 15, 2023",
    lastInteraction: "March 20, 2024",
    totalInteractions: "50",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDeleteCustomer = () => {
    const confirmed = confirm("Are you sure you want to delete this customer account? This action cannot be undone.");
    if (confirmed) {
      alert("Customer account would be deleted (demo)");
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="min-h-screen bg-slate-50 text-slate-800 font-sans leading-relaxed">
        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
            <a href="#" className="hover:text-blue-500">
              Customers
            </a>
            <span>/</span>
            <span>{customerData.name}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Profile Card */}
            <div className="bg-white rounded-xl p-6 shadow border border-slate-200 min-w-[280px]">
              <div className="text-center mb-6">
                <div className="w-30 h-30 rounded-xl flex items-center justify-center mx-auto mb-4 relative overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-600">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-15 h-15 text-white">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className={`dropdown relative w-full${isDropdownOpen ? " active" : ""}`}>
                  <button
                    className={`w-full bg-blue-500 text-white border-none px-5 py-3 rounded-lg font-medium text-sm cursor-pointer transition-all flex items-center justify-between gap-2 ${calling ? "bg-emerald-600" : ""} dropdownToggle`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                      {calling ? "Calling..." : "Call Customer"}
                    </div>
                    <svg className="transition-transform duration-200 dropdownIcon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>
                  <div
                    className={`dropdownMenu min-w-[300px] absolute left-0 md:-translate-x-[40px] right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-[1000] mt-1 transition-all duration-200 ${
                      isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    {YOUR_CRM_AGENTS.map((agent) => (
                      <div
                        key={agent.id}
                        className="flex items-center gap-3 cursor-pointer border-b border-slate-100 px-4 py-3 text-slate-800 text-sm hover:bg-slate-50 hover:text-slate-900 last:border-b-0 first:rounded-t-lg last:rounded-b-lg dropdownItem"
                        onClick={() => onAgentSelect()}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${agentGradients[agent.colorClass]}`}>{agent.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{agent.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{agent.specialty}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="px-5 py-3 border border-slate-200 rounded-lg font-medium text-sm cursor-pointer transition-all flex items-center justify-center gap-2 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  Send Email
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
              <div className="flex justify-between items-center px-8 py-6 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">{customerData.name}</h1>
                  <p className="text-slate-500 text-sm">Customer ID: {customerData.id}</p>
                </div>
                <a href="#" className="px-4 py-2 bg-slate-50 border border-slate-200 rounded text-slate-500 text-sm font-medium hover:bg-white hover:text-slate-900 transition">
                  Edit Profile
                </a>
              </div>

              <div className="p-8">
                <div className="mb-10">
                  <h2 className="text-lg font-semibold text-slate-900 mb-5">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-slate-500 font-medium">Email Address</span>
                      <span className="text-base text-slate-900 font-medium">{customerData.email}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-slate-500 font-medium">Phone Number</span>
                      <span className="text-base text-slate-900 font-medium">
                        {/* {customerData.phone} */}
                        <input
                          ref={phoneElemRef}
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-100 text-sm text-slate-900 px-3 py-1.5 rounded-lg outline-2 outline-gray-200 focus:outline-blue-500"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-slate-500 font-medium">Location</span>
                      <span className="text-base text-slate-900 font-medium">{customerData.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-5">Customer History</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-slate-500 font-medium">First Interaction</span>
                      <span className="text-base text-slate-900 font-medium">{customerData.firstInteraction}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-slate-500 font-medium">Last Interaction</span>
                      <span className="text-base text-slate-900 font-medium">{customerData.lastInteraction}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-slate-500 font-medium">Total Interactions</span>
                      <span className="text-base text-slate-900 font-medium">{customerData.totalInteractions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Options */}
          <div className="bg-white rounded-xl p-8 shadow border border-slate-200 mt-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-8">Other Options</h2>
            <div className="flex justify-between items-center py-4 border-b border-slate-100">
              <span className="font-medium text-slate-900">View Detailed Reports</span>
              <button className="px-5 py-2 border border-slate-200 rounded-lg font-medium text-sm cursor-pointer transition-all bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900">View Reports</button>
            </div>
            <div className="flex justify-between items-center py-4">
              <span className="font-medium text-red-600">Delete Customer Account</span>
              <button className="px-5 py-2 rounded-lg font-medium text-sm cursor-pointer transition-all bg-red-600 text-white hover:bg-red-800" onClick={handleDeleteCustomer}>
                Delete
              </button>
            </div>
          </div>

          <footer className="text-center mt-12 p-6 text-slate-400 text-sm">© 2024 Your CRM. All rights reserved.</footer>
        </main>
      </motion.div>
    </AnimatePresence>
  );
};

export default YourCRM;
