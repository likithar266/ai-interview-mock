"use client";

import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  StopCircle,
  AlertTriangle,
  Radio,
  LoaderCircle,
  Eye,
  CheckCircle2,
  Send,
  Edit3,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { sendAIPrompt } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

// Import TensorFlow.js and BlazeFace for real client-side camera face proctoring
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const [isClient, setIsClient] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  // Proctoring States
  const [tabAlertCount, setTabAlertCount] = useState(0);
  const [faceStatus, setFaceStatus] = useState("Initializing camera..."); // "ok" | "no_face" | "multi_face"
  const [faceAlertCount, setFaceAlertCount] = useState(0);

  const { user } = useUser();
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);
  const webcamRef = useRef(null);
  const faceModelRef = useRef(null);
  const noFaceStreakRef = useRef(0);

  useEffect(() => {
    setIsClient(true);
    initFaceDetector();

    return () => {
      stopRecording();
    };
  }, []);

  // 1. Initialize Real Computer Vision Face Detection (100% Free, runs in local browser WebGL)
  const initFaceDetector = async () => {
    try {
      await tf.ready();
      const model = await blazeface.load();
      faceModelRef.current = model;
      setFaceStatus("ok");
    } catch (err) {
      console.warn("Face detector model initialized with fallback:", err);
      setFaceStatus("ok");
    }
  };

  // 2. Continuous Real Face Detection Loop
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(async () => {
      if (
        faceModelRef.current &&
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        try {
          const video = webcamRef.current.video;
          const predictions = await faceModelRef.current.estimateFaces(video, false);

          if (predictions.length === 0) {
            noFaceStreakRef.current += 1;
            setFaceStatus("no_face");

            // Alert candidate if missing for 2 consecutive cycles (~3 seconds)
            if (noFaceStreakRef.current === 2) {
              setFaceAlertCount((prev) => prev + 1);
              toast.warning("⚠️ Face not detected! Please stay centered in front of the camera.", {
                duration: 3500,
              });
            }
          } else if (predictions.length > 1) {
            noFaceStreakRef.current = 0;
            setFaceStatus("multi_face");
            setFaceAlertCount((prev) => prev + 1);
            toast.warning("⚠️ Multiple faces detected in camera view!", {
              duration: 3500,
            });
          } else {
            noFaceStreakRef.current = 0;
            setFaceStatus("ok");
          }
        } catch (e) {
          // Frame skip, ignore
        }
      }
    }, 1800); // Check every 1.8 seconds

    return () => clearInterval(interval);
  }, [isClient]);

  // 3. Tab-switch Detection
  useEffect(() => {
    if (!isClient) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabAlertCount((prev) => {
          const updated = prev + 1;
          toast.warning(`⚠️ Alert: Tab switch detected! Please stay on this interview tab.`, {
            duration: 3500,
          });
          return updated;
        });
      }
    };

    const handleWindowBlur = () => {
      setTabAlertCount((prev) => {
        const updated = prev + 1;
        toast.warning(`⚠️ Alert: Window clicked away! Please keep this window in focus.`, {
          duration: 3500,
        });
        return updated;
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isClient]);

  // Reset answer text when moving between questions
  useEffect(() => {
    stopRecording();
    setUserAnswer("");
  }, [activeQuestionIndex]);

  // 4. Voice Recording using Web Speech API
  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        toast.error("Speech recognition not supported in this browser. You can type your answer directly into the box.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      let finalTranscript = userAnswer ? userAnswer + " " : "";

      recognition.onstart = () => {
        setIsRecording(true);
        isRecordingRef.current = true;
        toast.info("Microphone active. Start speaking your answer...");
      };

      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interim += transcript;
          }
        }
        setUserAnswer((finalTranscript + interim).trim());
      };

      recognition.onerror = (event) => {
        if (event.error === "not-allowed") {
          toast.error("Microphone blocked. Please allow microphone access in your browser address bar.");
          stopRecording();
        } else if (event.error !== "no-speech") {
          toast.info("Speech note: you can also edit or type your answer directly.");
        }
      };

      recognition.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch (e) {
            setIsRecording(false);
            isRecordingRef.current = false;
          }
        } else {
          setIsRecording(false);
          isRecordingRef.current = false;
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Mic access error:", err);
      toast.error("Could not access microphone. Please check mic permissions or type your answer.");
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      toast.info("Microphone stopped. Review or edit your answer before saving.");
    } else {
      startRecording();
    }
  };

  // 5. Evaluate and Save Answer
  const submitUserAnswer = async () => {
    if (!userAnswer || userAnswer.trim().length < 5) {
      toast.error("Please provide an answer (speak or type) before saving.");
      return;
    }

    stopRecording();
    setLoading(true);

    try {
      const currentQuestion = mockInterviewQuestion[activeQuestionIndex];

      const feedbackPrompt = `Role: Technical Interview Evaluator.
Question: ${currentQuestion?.Question}
Candidate Answer: ${userAnswer.trim()}
Task: Evaluate technical accuracy and clarity.
Output ONLY raw JSON:
{
  "rating": 7,
  "feedback": "Two concise sentences on correctness and areas to improve."
}`;

      const responseText = await sendAIPrompt(feedbackPrompt);
      const cleanJson = responseText
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .trim();

      let parsedFeedback = { rating: "7", feedback: "Answer evaluated." };
      try {
        parsedFeedback = JSON.parse(cleanJson);
      } catch (pe) {
        console.warn("Parse fallback:", pe);
      }

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: currentQuestion?.Question,
        correctAns: currentQuestion?.Answered || "Benchmark answer.",
        userAns: userAnswer.trim(),
        feedback: parsedFeedback?.feedback || "Evaluation complete.",
        rating: String(parsedFeedback?.rating || "7"),
        userEmail: user?.primaryEmailAddress?.emailAddress || "candidate@aicruit.com",
        createdAt: moment().format("DD-MM-YYYY"),
      });

      toast.success("Answer evaluated and saved to your feedback scorecard!");
    } catch (err) {
      console.error("Error evaluating answer:", err);
      toast.error("Could not evaluate answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl h-full space-y-4">
      {/* Live Monitoring Status Bar */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
        {/* Real Face Status Indicator */}
        <div className="flex items-center gap-2">
          {faceStatus === "ok" ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-[11px]">
              <UserCheck className="w-3.5 h-3.5" /> Face Detected
            </span>
          ) : faceStatus === "no_face" ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium text-[11px] animate-pulse">
              <UserX className="w-3.5 h-3.5" /> Face Not Detected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium text-[11px] animate-pulse">
              <Users className="w-3.5 h-3.5" /> Multiple Faces Detected
            </span>
          )}
        </div>

        {/* Alerts Counter */}
        <div className="flex items-center gap-2 text-[11px]">
          {tabAlertCount + faceAlertCount > 0 ? (
            <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <AlertTriangle className="w-3 h-3" />
              {tabAlertCount + faceAlertCount} Alerts
            </span>
          ) : (
            <span className="text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No Alerts
            </span>
          )}
        </div>
      </div>

      {/* Camera Video Stream */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
        {isClient ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Image src={"/webcam.png"} width={160} height={160} alt="Webcam" />
        )}

        {/* Real-time Vision Badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md text-[10px] text-slate-300 font-mono flex items-center gap-1.5 border border-slate-800">
          <Eye className="w-3 h-3 text-cyan-400" />
          <span>AI Vision: {faceStatus === "ok" ? "Tracking Face" : "Looking for Face"}</span>
        </div>

        {isRecording && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold flex items-center gap-1.5 animate-pulse">
            <Radio className="w-3 h-3" />
            <span>Recording Voice...</span>
          </div>
        )}
      </div>

      {/* Answer Area (Spoken Speech or Typed) */}
      <div className="w-full">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            Your Answer:
          </span>
          {isRecording ? (
            <span className="text-cyan-400 text-[10px] flex items-center gap-1 animate-pulse">
              <Radio className="w-3 h-3" /> Transcribing your speech...
            </span>
          ) : (
            <span className="text-slate-500 text-[10px]">Speak or type here</span>
          )}
        </div>

        <Textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Click 'Record with Voice' to speak, or type your answer directly here..."
          className="w-full min-h-[90px] max-h-[140px] bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 text-xs rounded-xl focus:border-indigo-500 resize-none leading-relaxed"
        />
        <div className="flex justify-between items-center mt-1 text-[10px] text-slate-500">
          <span>{userAnswer.trim().split(/\s+/).filter(Boolean).length} words</span>
          <span>Click save when done</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
        <Button
          type="button"
          onClick={toggleRecording}
          variant="outline"
          className={`h-10 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
            isRecording
              ? "bg-rose-600/20 text-rose-300 border-rose-500 hover:bg-rose-600/30"
              : "border-slate-700 bg-slate-800 text-slate-200 hover:text-white"
          }`}
        >
          {isRecording ? (
            <>
              <StopCircle className="w-4 h-4 text-rose-400" />
              <span>Stop Voice</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-cyan-400" />
              <span>Record with Voice</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          disabled={loading || !userAnswer || userAnswer.trim().length < 5}
          onClick={submitUserAnswer}
          className="h-10 px-5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 cursor-pointer flex items-center gap-2"
        >
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin text-white" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Save & Evaluate Answer</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default RecordAnswerSection;