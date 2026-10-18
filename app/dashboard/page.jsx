"use client";

import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
import { motion } from "framer-motion";
import { Video, Mic, CheckCircle } from "lucide-react";

function Dashboard() {
  return (
    <div className="py-8 min-h-screen text-slate-100">
      {/* Friendly Clean Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-xl"
      >
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Interview Practice Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Practice realistic interviews for your target job role. Speak your answers aloud, receive instant feedback, and track your camera presence.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle className="w-4 h-4" /> Live Face Detection
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Mic className="w-4 h-4" /> Voice & Text Answers
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Video className="w-4 h-4" /> Camera Monitoring
            </span>
          </div>
        </div>
      </motion.div>

      {/* Start Interview Action */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-white mb-4">Start an Interview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AddNewInterview />
        </div>
      </div>

      {/* Previous Interviews List */}
      <InterviewList />
    </div>
  );
}

export default Dashboard;
