"use client";

import MockInterview from "@/utils/schema";
import React, { useEffect, useState, useRef } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import {
  WebcamIcon,
  Video,
  PlayCircle,
  Briefcase,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

function Interview() {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const webcamRef = useRef(null);

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (result && result.length > 0) {
        setInterviewData(result[0]);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 min-h-screen text-slate-100 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Interview Preparation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Check your camera and microphone before beginning your interview.
          </p>
        </div>

        <Link href={`/dashboard/interview/${interviewId}/start`}>
          <Button className="h-10 px-6 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            Start Interview
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Job Details & Friendly Tips */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
              <Briefcase className="w-4 h-4" />
              Interview Details
            </div>

            <div>
              <span className="text-xs text-slate-400 block">Job Role</span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {interviewData?.jobPosition || "Software Engineer"}
              </h3>
            </div>

            <div>
              <span className="text-xs text-slate-400 block">Skills / Topics</span>
              <p className="text-xs text-slate-300 mt-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                {interviewData?.jobDescription || "Technical concepts and practical questions"}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-400 block">Experience Level</span>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {interviewData?.jobExperience || 0} Years
              </span>
            </div>
          </div>

          {/* Simple Tips */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs text-slate-300">
            <div className="font-semibold text-white flex items-center gap-1.5 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Helpful Tips:
            </div>
            <p>• <strong>Face the camera:</strong> The platform will detect that your face is in view.</p>
            <p>• <strong>Stay on this page:</strong> Switching tabs or opening other windows logs an alert.</p>
            <p>• <strong>Answer your way:</strong> You can speak using the microphone or type into the box.</p>
          </div>
        </div>

        {/* Right: Camera Check */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-indigo-400" /> Camera Preview
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${webCamEnabled ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
              {webCamEnabled ? "Camera Ready" : "Camera Off"}
            </span>
          </div>

          <div className="w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center">
            {webCamEnabled ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                mirrored={true}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 text-slate-500">
                <WebcamIcon className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <p className="text-xs text-slate-400">Click below to test your camera</p>
              </div>
            )}
          </div>

          <div className="w-full mt-4">
            {!webCamEnabled ? (
              <Button
                onClick={() => setWebCamEnabled(true)}
                className="w-full h-10 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
              >
                Turn On Camera
              </Button>
            ) : (
              <div className="p-2 rounded-xl bg-emerald-500/10 text-xs text-emerald-400 text-center">
                ✓ Camera working properly
              </div>
            )}
          </div>

          <div className="w-full mt-4 pt-4 border-t border-slate-800">
            <Link href={`/dashboard/interview/${interviewId}/start`} className="w-full block">
              <Button className="w-full h-10 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer flex items-center justify-center gap-2">
                <PlayCircle className="w-4 h-4" />
                Begin Interview
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
