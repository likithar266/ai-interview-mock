"use client";
import MockInterview from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

function Interview() {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const webcamRef = React.useRef(null);
  
  useEffect(() => {
    if (interviewId) {
      console.log("Interview ID:", interviewId);
      GetInterviewDetails();
    }
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    setInterviewData(result[0]);
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc); // Do something with the captured image
  }, [webcamRef]);

  return (
    <div className="my-10 text-white">
      <h2 className="font-bold text-2xl ml-5">Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2">
        
        <div className="flex flex-col my-5 gap-7 p-5 m-4 h-76 rounded-lg border">
          <h2 className="text-lg">
            <strong>Job Role/Job Position: </strong>
            {interviewData?.jobPosition || "Data not available"}
          </h2>
          <h2 className="text-lg">
            <strong>Job Description: </strong>
            {interviewData?.jobDescription || "Data not available"}
          </h2>
          <h2 className="text-lg">
            <strong>Years Of Experience: </strong>
            {interviewData?.jobExperience || "Data not available"}
          </h2>
        </div>

    

        <div>
          {webCamEnabled ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "user",
                }}
                style={{
                  height: 500,
                  width: 700,
                }}
              />
            </>
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <div style={{ textAlign: "center" }}>
                <Button
                variant="ghost"
                  onClick={() => setWebCamEnabled(true)}
                  style={{ display: "inline-block" }}
                >
                  Enable Web Cam and Microphone
                </Button>
              </div>
            </>
          )}
        </div>
     <div className="p-5 m-8 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500"><Lightbulb/><strong>Tip</strong></h2>
            <h2 className="mt-2 ">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
        </div>
      </div>
  
    <div className="flex justify-end items">
        <Link href={'/dashboard/interview/'+interviewId+'/start'}>
        <Button>Start Interview</Button></Link>
    </div>

    </div>
  );
}

export default Interview;
