"use client";

import React, { useEffect, useState } from "react";
import { Bot, Volume2, VolumeX, Lightbulb, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

function QuestionsSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  setActiveQuestionIndex,
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Automatically read question aloud when active question changes
  useEffect(() => {
    if (mockInterviewQuestion && mockInterviewQuestion[activeQuestionIndex]) {
      const qText = mockInterviewQuestion[activeQuestionIndex]?.Question;
      if (qText) {
        textToSpeech(qText);
      }
    }

    return () => {
      stopSpeech();
    };
  }, [activeQuestionIndex, mockInterviewQuestion]);

  const textToSpeech = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const currentQ = mockInterviewQuestion?.[activeQuestionIndex];

  return (
    mockInterviewQuestion?.length > 0 && (
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between h-full">
        <div>
          {/* Interviewer Status Bar */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  AI Interviewer
                </span>
                <span className="text-[11px] text-slate-400">
                  {isSpeaking ? (
                    <span className="text-cyan-400 font-medium flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" /> Reading question aloud...
                    </span>
                  ) : (
                    "Ready for your answer"
                  )}
                </span>
              </div>
            </div>

            {/* Audio Control */}
            <div>
              {isSpeaking ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopSpeech}
                  className="h-8 px-2.5 text-xs border-slate-700 bg-slate-800 text-rose-400 hover:text-white rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5" /> Stop Audio
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => textToSpeech(currentQ?.Question)}
                  className="h-8 px-2.5 text-xs border-slate-700 bg-slate-800 text-slate-300 hover:text-white rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Read Again
                </Button>
              )}
            </div>
          </div>

          {/* Question Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {mockInterviewQuestion.map((q, index) => (
              <button
                key={index}
                onClick={() => {
                  stopSpeech();
                  if (setActiveQuestionIndex) setActiveQuestionIndex(index);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer border ${
                  activeQuestionIndex === index
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Question {index + 1}
              </button>
            ))}
          </div>

          {/* Stage Name */}
          <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
            {currentQ?.stage || `Question ${activeQuestionIndex + 1}`}
          </div>

          {/* Question Text */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 mb-6">
            <h2 className="text-base font-medium text-white leading-relaxed">
              "{currentQ?.Question}"
            </h2>
          </div>
        </div>

        {/* Friendly Advice */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Tip:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Answer in your own words. You can speak into your microphone or type in the response box on the right.
          </p>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
