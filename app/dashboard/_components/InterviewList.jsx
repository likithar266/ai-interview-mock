"use client";

import MockInterview from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { desc, eq } from "drizzle-orm";
import InterviewItemCard from "./InterviewItemCard";
import { History, Sparkles, Inbox } from "lucide-react";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));

      setInterviewList(result || []);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Previous AIcruit Interviews
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Access previous proctored sessions, view recruiter scorecards, or retake interviews
          </p>
        </div>

        <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
          {interviewList.length} Total Sessions
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : interviewList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviewList.map((interview, index) => (
            <InterviewItemCard key={interview.mockId || index} interview={interview} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-dashed border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No Interviews Recorded Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click "+ Add New AIcruit Interview" above to launch your first autonomous multi-stage interview.
          </p>
        </div>
      )}
    </div>
  );
}

export default InterviewList;