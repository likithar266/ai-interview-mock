"use client";

import React from "react";
import Link from "next/link";
import {
  Bot,
  Video,
  Mic,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "./dashboard/_components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          {/* Simple Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Mock Interview Platform with Real Camera Proctoring</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
            Practice Real Job Interviews with{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200 bg-clip-text text-transparent">
              AIcruit
            </span>
          </h1>

          <p className="mt-5 text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Boost your interview confidence. Practice tailored questions for any job role, speak your answers aloud, verify your camera presence, and get instant feedback.
          </p>

          {/* Action Button */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button className="h-11 px-8 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Start Free Practice
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Quick Features Preview Card */}
          <div className="mt-14 max-w-3xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl text-left grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <UserCheck className="w-6 h-6 text-emerald-400 mb-2" />
                <h3 className="text-sm font-bold text-white">Live Camera Proctoring</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Built-in face detection checks that you stay centered in front of the camera and alerts on tab switching.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <Mic className="w-6 h-6 text-cyan-400 mb-2" />
                <h3 className="text-sm font-bold text-white">Voice & Speech Answers</h3>
                <p className="text-xs text-slate-400 mt-1">
                  The AI reads questions aloud, and you can speak your response or type into the box anytime.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <CheckCircle2 className="w-6 h-6 text-indigo-400 mb-2" />
                <h3 className="text-sm font-bold text-white">Instant Feedback & Score</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Compare your answers against ideal benchmark answers and receive actionable tips to improve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              How AIcruit Works
            </h2>
            <p className="mt-2 text-slate-400 text-xs md:text-sm">
              Practice in 3 simple steps from your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center mb-3">
                1
              </span>
              <h3 className="text-base font-bold text-white mb-1">Set Your Target Role</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your desired job title, tech stack (like React, Java, SQL), and years of experience.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center mb-3">
                2
              </span>
              <h3 className="text-base font-bold text-white mb-1">Answer Live Questions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Listen to questions read aloud, keep your camera on, and record your voice answers or type them in.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center mb-3">
                3
              </span>
              <h3 className="text-base font-bold text-white mb-1">Review Your Scorecard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get an overall rating out of 10, compare against ideal responses, and read constructive improvement tips.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/dashboard">
              <Button className="h-10 px-6 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer">
                Try an Interview Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-6 text-slate-500 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>AIcruit</span>
          </div>
          <div>© {new Date().getFullYear()} AIcruit. Free & private practice.</div>
        </div>
      </footer>
    </div>
  );
}
