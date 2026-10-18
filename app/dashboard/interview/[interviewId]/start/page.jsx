"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import MockInterview from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

function StartInterview() {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (result.length === 0) {
        return;
      }

      const jsonMockResp = JSON.parse(result[0].jsonMockResp || "[]");
      setMockInterviewQuestion(jsonMockResp);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview data:", error);
    }
  };

  const totalQuestions = mockInterviewQuestion?.length || 1;
  const progressPercent = Math.round(((activeQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="py-6 min-h-screen text-slate-100 flex flex-col justify-between max-w-6xl mx-auto">
      {/* Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {interviewData?.jobPosition || "Interview Session"}
          </h1>
          <p className="text-xs text-slate-400">
            {interviewData?.jobExperience || "0"} Years Experience • Answer questions one by one
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-300">
            Question {activeQuestionIndex + 1} of {totalQuestions}
          </span>
          <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Questions, Right Recording & Real Camera Proctor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />

        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      {/* Bottom Navigation */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
        <Button
          variant="outline"
          disabled={activeQuestionIndex === 0}
          onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          className="h-10 px-4 text-xs font-semibold border-slate-800 bg-slate-900 text-slate-300 hover:text-white rounded-xl disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        <div className="flex items-center gap-3">
          {activeQuestionIndex < totalQuestions - 1 ? (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              className="h-10 px-5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              Next Question <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
              <Button className="h-10 px-6 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer flex items-center gap-2">
                Finish & View Results
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartInterview;