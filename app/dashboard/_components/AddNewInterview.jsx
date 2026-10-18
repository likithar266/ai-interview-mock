"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendAIPrompt } from "@/utils/GeminiAIModel";
import { LoaderCircle, Plus, Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";
import MockInterview from "@/utils/schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clear, token-efficient prompt with no jargon
      const InputPrompt = `Role: Technical Job Interviewer.
Target: Role: ${jobPosition}, Tech/Skills: ${jobDescription}, Experience: ${jobExperience} years.
Task: Generate 4 interview questions covering 4 practical stages:
1. Stage 1: Introduction (Introduction and background)
2. Stage 2: Project Experience (Discussion of past projects and technical choices)
3. Stage 3: Technical Concepts (Core questions on fundamental concepts)
4. Stage 4: Problem Solving (A practical scenario question)
Requirements:
- Return ONLY a raw JSON array.
- Each item must have:
  "stage": string (e.g. "Stage 1: Introduction", "Stage 2: Project Experience", "Stage 3: Technical Concepts", "Stage 4: Problem Solving"),
  "Question": string (clear interview question),
  "Answered": string (1-2 sentence sample answer)
Keep questions clear and concise.`;

      const responseText = await sendAIPrompt(InputPrompt);
      const cleanJson = responseText
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .trim();

      const parsed = JSON.parse(cleanJson);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Invalid questions received");
      }

      const newMockId = uuidv4();
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: newMockId,
          jsonMockResp: JSON.stringify(parsed),
          jobPosition: jobPosition,
          jobDescription: jobDescription,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress || "candidate@aicruit.com",
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });

      if (resp[0]?.mockId) {
        toast.success("Interview created! Redirecting to setup...");
        setOpenDialog(false);
        router.push(`/dashboard/interview/${resp[0].mockId}`);
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error("Could not generate interview questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Trigger Card */}
      <div
        onClick={() => setOpenDialog(true)}
        className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 cursor-pointer transition-all flex flex-col justify-between h-full min-h-[160px]"
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-cyan-400">
          <Plus className="w-5 h-5" />
        </div>

        <div>
          <h3 className="text-base font-bold text-white">
            + Create New Interview
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Choose your role and tech stack to generate 4 personalized questions.
          </p>
        </div>
      </div>

      {/* Dialog Modal */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg bg-slate-950 border border-slate-800 text-slate-100 p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Create Practice Interview
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Enter the job title and skills you want to practice.
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300">
                Job Role / Title <span className="text-red-400">*</span>
              </label>
              <Input
                className="mt-1 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-xl text-xs"
                placeholder="e.g. Frontend Developer, Java Backend, Full Stack"
                required
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">
                Tech Stack / Key Skills <span className="text-red-400">*</span>
              </label>
              <Textarea
                className="mt-1 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-xl text-xs min-h-[80px]"
                placeholder="e.g. React, Node.js, SQL, REST APIs, Git"
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">
                Years of Experience <span className="text-red-400">*</span>
              </label>
              <Input
                className="mt-1 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-xl text-xs"
                placeholder="e.g. 2"
                type="number"
                min="0"
                max="40"
                required
                value={jobExperience}
                onChange={(e) => setJobExperience(e.target.value)}
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
                className="text-slate-400 hover:text-white rounded-xl text-xs"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    <span>Generating Questions...</span>
                  </>
                ) : (
                  <span>Start Interview</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;