"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, Award, PlayCircle, FileText, ChevronRight } from "lucide-react";

function InterviewItemCard({ interview }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                {interview?.jobPosition || "Software Engineer"}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>{interview?.createdAt || "Recent"}</span>
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
            {interview?.jobExperience} Yrs Exp
          </span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
          <strong className="text-slate-300">Skills / Focus:</strong>{" "}
          {interview?.jobDescription || "Full stack technical concepts and problem solving"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80">
        <Link href={`/dashboard/interview/${interview?.mockId}/feedback`} className="w-full">
          <Button
            variant="outline"
            className="w-full h-9 text-xs font-medium border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            Scorecard
          </Button>
        </Link>

        <Link href={`/dashboard/interview/${interview?.mockId}`} className="w-full">
          <Button className="w-full h-9 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl shadow-md hover:brightness-110 cursor-pointer flex items-center justify-center gap-1.5">
            <PlayCircle className="w-3.5 h-3.5" />
            Start
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewItemCard;