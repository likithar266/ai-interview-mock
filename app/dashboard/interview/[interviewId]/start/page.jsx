"use client"
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db';
import MockInterview from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function StartInterview() {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]); // Initialize as an empty array
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
        console.error("No interview data found.");
        return;
      }

      const jsonMockResp = JSON.parse(result[0].jsonMockResp || "[]"); // Default to empty array if undefined
      console.log(jsonMockResp);

      setMockInterviewQuestion(jsonMockResp);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview data:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Questions */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Video/audio recording */}
        <RecordAnswerSection
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={activeQuestionIndex}
        interviewData={interviewData}
        />
      </div>

      <div className='flex justify-end gap-6'>
        {activeQuestionIndex>0 && 
        <Button className={"cursor-pointer"} onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
        {activeQuestionIndex!=mockInterviewQuestion?.length-1 &&
        <Button className={"cursor-pointer"} onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
        {activeQuestionIndex==mockInterviewQuestion?.length-1 && 
        
        <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
        <Button className={"cursor-pointer"}>End Interview</Button>
        </Link>
}
      </div>

    </div>
  );
}

export default StartInterview;



// "use client"
// import React, { useEffect, useState } from 'react'
// import { db } from '@/utils/db';
// import MockInterview from '@/utils/schema';
// import { eq } from 'drizzle-orm';
// import QuestionsSection from './_components/QuestionsSection';

// function StartInterview({params}) {

//     const[interviewData, setInterviewData]=useState();
//     const[mockInterviewQuestion, setMockInterviewQuestion]= useState();
//     const[activeQuestionIndex, setactiveQuestionIndex]=useState(0);
//     useEffect(()=>{
//         GetInterviewDetails();
//     },[]);

//     const GetInterviewDetails = async () => {
//         const result = await db.select().from(MockInterview)
//           .where(eq(MockInterview.mockId, params.interviewId))
    
          
//         const jsonMockResp= JSON.parse(result[0].jsonMockResp);
//         console.log(jsonMockResp)
//         setMockInterviewQuestion(jsonMockResp);
//         setInterviewData(result[0]);
//       };

         
//   return (
//     <div>
//       <div className='grid grid-cols-1 md:grid-cols-2'>
//             {/* Questions */}
//             <QuestionsSection 
//             mockInterviewQuestion={mockInterviewQuestion}
//             activeQuestionIndex={activeQuestionIndex}
//             />  
//       </div>
//     </div>
//   )
// }

// export default StartInterview