"use client";

import { UserAnswer } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation"; 
import { useParams } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function Feedback() {
  const { interviewId } = useParams();
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    if (interviewId) {
      GetFeedback(interviewId);
    }
  }, [interviewId]);

  const GetFeedback = async (id) => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, id))
        .orderBy(UserAnswer.id);

      console.log(result);
      setFeedbackList(result);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
      <h2 className="font-bold text-2xl">Here is your Interview Feedback</h2>
      <h2 className="text-primary text-lg my-3">
        Your overall Interview Rating: <strong></strong>
      </h2>

      <h2 className="text-sm text-gray-500">
        Find below Interview question with correct answer, Your answer and
        feedback for improvement
      </h2>

      {feedbackList &&
        feedbackList.map((item, index) => (
          <Collapsible key={index} className="mt-7">
            <CollapsibleTrigger className="w-full text-left gap-7 p-2 bg-secondary rounded-lg my-3 flex justify-between">
              {item.question} <ChevronsUpDown className="h-8 w-8" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <h2 className="text-blue-500 p-2 border rounded-lg">
                  <strong>Rating: </strong> {item.rating}
                </h2>
                <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-blue-500">
                  <strong>Your Answer: </strong>
                  {item.userAns}
                </h2>
                <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-500">
                  <strong>Correct Answer: </strong>
                  {item.correctAns}
                </h2>
                <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary-500">
                  <strong>Feedback: </strong>
                  {item.feedback}
                </h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

      <Button onClick={() => router.replace("/dashboard")}>Go Home</Button>
    </div>
  );
}

export default Feedback;



// "use client";

// import { UserAnswer } from "@/utils/schema";
// import React, { useEffect, useState } from "react";
// import { db } from "@/utils/db";
// import { eq } from "drizzle-orm";
// import { useParams } from "next/navigation";
// import { index } from "drizzle-orm/gel-core";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { ChevronsUpDown } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";


// function Feedback({params}) {
//   const { interviewId } = params.interviewId;
//   const router=useRouter();
//   const [feedbackList, setFeedbackList] = useState([]);

//   useEffect(() => {
//     if (interviewId) {
//       GetFeedback(interviewId);
//     }
//   }, [interviewId]);

//   const GetFeedback = async (id) => {
//     try {
//       const result = await db
//         .select()
//         .from(UserAnswer)
//         .where(eq(UserAnswer.mockIdRef, id))
//         .orderBy(UserAnswer.id);

//       console.log(result);
//       setFeedbackList(result);
//     } catch (error) {
//       console.error("Error fetching feedback:", error);
//     }
//   };

//   return (
//     <div className="p-10">
//       <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
//       <h2 className="font-bold text-2xl">Here is your Interview Feedback</h2>
//       <h2 className="text-primary text-lg my-3">
//         Your overall Interview Rating: <strong></strong>
//       </h2>

//       <h2 className="text-sm text-gray-500">
//         Find below Interview question with correct answer, Your answer and
//         feedback for improvement
//       </h2>

//       {feedbackList &&
//         feedbackList.map((item, index) => (
//           <Collapsible key={index} className='mt-7'>
//             <CollapsibleTrigger className='w-full text-left gap-7 p-2 bg-secondary rounded-lg my-3 flex justify-between'>
//               {item.question} <ChevronsUpDown className="h-8 w-8"/>
//             </CollapsibleTrigger>
//             <CollapsibleContent>
//               <div className="flex flex-col gap-2">
//                 <h2 className="text-blue-500 p-2 border rounded-lg"><strong>Rating: </strong> {item.rating}</h2>
//                 <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-blue-500"><strong>Your Answer: </strong>{item.userAns}</h2>
//                 <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-500"><strong>Correct Answer: </strong>{item.correctAns}</h2>
//                 <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary-500"><strong>Feedback: </strong>{item.feedback}</h2>
//               </div>
//             </CollapsibleContent>
//           </Collapsible>
//         ))}


//         <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
//     </div>
//   );
// }

// export default Feedback;
