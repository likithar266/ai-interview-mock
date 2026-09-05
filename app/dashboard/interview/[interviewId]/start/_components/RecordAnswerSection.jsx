"use client";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex, interviewData}) {
  const [isClient, setIsClient] = useState(false);
  const[userAnswer, setUserAnswer]=useState('');
  const {user} = useUser();
  const [loading,setLoading]=useState(false);

  useEffect(() => {
    setIsClient(typeof window !== "undefined"); // Ensure client-side rendering
  }, []);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults

  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  
  useEffect(()=>{
    setUserAnswer(results.map((result) => result?.transcript || '').join(' ').trim());
  }, [results])

  useEffect(()=>{
    if(!isRecording&&userAnswer.length>10)
    {
      UpdateUserAnswer();
    }
    
  },[userAnswer])

  const StartStopRecording=async()=>{
    if(isRecording){

      stopSpeechToText()

      // if(userAnswer?.length<10){
      //   setLoading(false);
      //   toast('Error while saving your answer, Please record again')
      //   return ;
      // }
    }

    else{
      startSpeechToText()
    
  }

  
}

const UpdateUserAnswer=async()=>{
  setLoading(true)
  try {
    const feedbackPrompt= "Question:"+mockInterviewQuestion[activeQuestionIndex]?.Question+
    ", User Answer:"+userAnswer+", Depends on question and user answer for given interview question"+
    " Please give us rating for answer and feedback as area of improvement if any"+
    "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field" ;

    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp=(result.response.text()).replace('```json', '').replace('```', '').trim();
    const JsonFeedbackResp=JSON.parse(mockJsonResp);

    await db.insert(UserAnswer).values(
      {
          mockIdRef:interviewData?.mockId,
          question:mockInterviewQuestion[activeQuestionIndex]?.Question,
          correctAns:mockInterviewQuestion[activeQuestionIndex]?.Answered,
          userAns:userAnswer,
          feedback:JsonFeedbackResp?.feedback,
          rating:JsonFeedbackResp?.rating,
          userEmail:user?.primaryEmailAddress?.emailAddress,
          createdAt:moment().format('DD-MM-yyyy')
      }
    );

    toast('User Answer recorded successfully')
    setUserAnswer('');
    setResults([]);
  } catch (error) {
    console.error('Error recording user answer:', error);
    toast.error('Unable to record your answer. Please try again.');
  } finally {
    setLoading(false);
    }
}

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5 m-5">
        {isClient ? ( // Render webcam only on client-side
          <Webcam
            mirrored={true}
            style={{
              height: 300,
              width: "100%",
              zIndex: 10,
            }}
          />
        ) : (
          <Image src={"/webcam.png"} width={200} height={200} alt="Webcam" />
        )}
      </div>
<Button
        disabled={loading}
        variant="outline"
        className="my-10 cursor-pointer"
        onClick={StartStopRecording}
      >
        {isRecording? 

        <h2 className="text-red-600 flex gap-2">
            <StopCircle />Stop Recording
        </h2>

        :

        <h2 className="text-primary flex gap-2 items-center">
         <Mic/> Record Answer
        </h2>}
      </Button>

    
    </div>
  );
}

export default RecordAnswerSection;




// "use client"
// import Webcam from "react-webcam";
// import React from 'react'
// import Image from 'next/image'
// import { Button } from "@/components/ui/button";
// import useSpeechToText from 'react-hook-speech-to-text';
// function RecordAnswerSection() {
//     const {
//         error,
//         interimResult,
//         isRecording,
//         results,
//         startSpeechToText,
//         stopSpeechToText,
//       } = useSpeechToText({
//         continuous: true,
//         useLegacyResults: false
//       });
//   return (
//     <div className="flex items-center justify-center flex-col">
//     <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5 m-5'>
//         <Image src={'/webcam.png'} width={200} height={200} 
//         className='absolute'/>
//         <Webcam
//         mirrored={true}
//         style={
//             {
//                 height: 300,
//                 width: '100%',
//                 zIndex:10
//             }
//         }
//         />
//     </div>
//     <Button variant="outline" className="my-10 cursor-pointer">Record Answer</Button>
    
//     <h1>Recording: {isRecording.toString()}</h1>
//       <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
//         {isRecording ? 'Stop Recording' : 'Start Recording'}
//       </button>
//       <ul>
//         {results.map((result) => (
//           <li key={result.timestamp}>{result.transcript}</li>
//         ))}
//         {interimResult && <li>{interimResult}</li>}
//       </ul>

//     </div>
//   )
// }

// export default RecordAnswerSection;