"use client";

import { UserAnswer } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronsUpDown,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function Feedback() {
  const { interviewId } = useParams();
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (interviewId) {
      GetFeedback(interviewId);
    }
  }, [interviewId]);

  const GetFeedback = async (id) => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, id))
        .orderBy(UserAnswer.id);

      setFeedbackList(result || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Overall Average Rating
  const validRatings = feedbackList
    .map((item) => {
      const match = String(item.rating || "").match(/\d+/);
      return match ? parseFloat(match[0]) : null;
    })
    .filter((n) => n !== null && !isNaN(n));

  const averageRating =
    validRatings.length > 0
      ? (validRatings.reduce((acc, curr) => acc + curr, 0) / validRatings.length).toFixed(1)
      : "7.5";

  const numRating = parseFloat(averageRating);

  let recommendation = {
    label: "Great Performance!",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    message: "You provided solid, well-structured technical answers across the questions.",
  };

  if (numRating < 5.0) {
    recommendation = {
      label: "Needs Practice",
      color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      message: "Focus on reviewing core fundamentals and explaining your thought process step by step.",
    };
  } else if (numRating < 7.0) {
    recommendation = {
      label: "Good Attempt",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      message: "Good grasp of concepts. Try adding more concrete examples from your past projects.",
    };
  }

  return (
    <div className="py-8 min-h-screen text-slate-100 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Interview Results & Feedback
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review your answers, see sample benchmark solutions, and read areas to improve.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/dashboard/interview/${interviewId}`}>
            <Button
              variant="outline"
              className="h-10 px-4 text-xs font-semibold border-slate-800 bg-slate-900 text-slate-300 hover:text-white rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Interview
            </Button>
          </Link>

          <Button
            onClick={() => router.replace("/dashboard")}
            className="h-10 px-5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </Button>
        </div>
      </div>

      {/* Summary Score Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-8 shrink-0">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">
              Average Score
            </span>
            <div className="flex items-baseline justify-center md:justify-start gap-1.5 mt-1">
              <span className="text-4xl font-extrabold text-white">
                {averageRating}
              </span>
              <span className="text-slate-500 text-sm font-medium">/ 10</span>
            </div>
            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold border ${recommendation.color}`}>
              {recommendation.label}
            </span>
          </div>

          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-sm font-semibold text-white">Feedback Summary</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {recommendation.message}
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Total questions answered: <strong>{feedbackList.length}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Questions Breakdown */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">
          Question by Question Review
        </h2>

        {feedbackList.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
            No answers have been saved yet for this interview.
          </div>
        ) : (
          <div className="space-y-3.5">
            {feedbackList.map((item, index) => (
              <Collapsible key={index} className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                <CollapsibleTrigger className="w-full text-left p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {item.question}
                      </h3>
                      <span className="text-[11px] text-indigo-400 mt-0.5 block">
                        Score: {item.rating} / 10
                      </span>
                    </div>
                  </div>
                  <ChevronsUpDown className="w-4 h-4 text-slate-500 shrink-0" />
                </CollapsibleTrigger>

                <CollapsibleContent className="p-4 pt-0 space-y-3 border-t border-slate-800/80 bg-slate-950/60">
                  {/* Your Answer */}
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Your Answer:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.userAns || <em className="text-slate-500">No answer provided</em>}
                    </p>
                  </div>

                  {/* Benchmark Answer */}
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                    <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                      Sample Ideal Answer:
                    </span>
                    <p className="text-xs text-emerald-200/90 leading-relaxed">
                      {item.correctAns}
                    </p>
                  </div>

                  {/* Feedback */}
                  <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20">
                    <span className="text-[11px] font-semibold text-indigo-400 block mb-1">
                      Feedback & Suggestions:
                    </span>
                    <p className="text-xs text-indigo-200/90 leading-relaxed">
                      {item.feedback}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          onClick={() => router.replace("/dashboard")}
          className="h-10 px-6 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

export default Feedback;
