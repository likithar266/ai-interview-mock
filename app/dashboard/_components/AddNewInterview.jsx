"use client"

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { v4 as uuidv4 } from 'uuid';

import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle } from 'lucide-react'
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db';
import MockInterview from '@/utils/schema';
import { useRouter } from 'next/navigation';


function AddNewInterview() {
    const [openDialog, setOpenDailog]=useState(false)
    const [jobPosition, setJobPosition]=useState();
    const [jobDescription, setjobDescription]=useState();
    const [jobExperience, setjobExperience]=useState();
    const [loading, setloading]=useState(false);
    const {user}=useUser();
    const [jsonResponse, setJsonResponse] = useState(null);
    const router=useRouter();

    const onSubmit=async(e)=>{
        setloading(true)
        e.preventDefault()
        
        console.log(jobDescription, jobPosition, jobExperience)
        
       
        const InputPrompt= "Job Position: "+jobPosition+" , Job Description: "+jobDescription+", Years of Experience: "+jobExperience+", Depends on the this information please give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" Interview questions with Answered in JSON Format, Give Question and Answered as fields in JSON"
    
        const result=await chatSession.sendMessage(InputPrompt);

        const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
        
        console.log(JSON.parse(MockJsonResp));

        setJsonResponse(MockJsonResp);
if(MockJsonResp){
        const resp = await db.insert(MockInterview).values(
            {
                mockId:uuidv4(),
                jsonMockResp:MockJsonResp,
                jobPosition:jobPosition,
                jobDescription:jobDescription,
                jobExperience:jobExperience,
                createdBy:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-yyyy')
            }).returning({mockId:MockInterview.mockId})
            
        console.log("Inserted ID:", resp)

        if(resp){
            setOpenDailog(false);
            router.push('/dashboard/interview/'+resp[0]?.mockId)
        }
    }
    else{
        console.log("ERROR")
    }
        setloading(false);
    }

  return (
    <div>
        <div className=' text-white p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
         onClick={()=>setOpenDailog(true)}>
            <h2 className='text-black text-lg text-center'>+ Add New</h2>
        </div>

        <Dialog open={openDialog}>
            <DialogContent className={"max-w-2xl"}>
                <DialogHeader>
                <DialogTitle className="text-2xl">Tell us more about your Job Interviewing</DialogTitle>
                <DialogDescription>
                    Add Details about your Job position/role, Job description and Years of Experience
                </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={onSubmit}>
                    <div>
                        <div className='text-black mt-7 my-2'>
                            <label>Job Role/Job Position</label>
                            <Input className='text-black mt-4' placeholder="Ex. Full Stack Developer" required
                            onChange={(event)=>setJobPosition(event.target.value)}/>
                        </div>

                        <div className='text-black my-3'>
                            <label>Job Description/Tech Stack (In Short)</label>
                            <Textarea className='text-black mt-4' placeholder="Ex.  ReactJs, NextJs, Java...." required 
                            onChange={(event)=>setjobDescription(event.target.value)}/>
                        </div>

                        <div className='text-black my-3'>
                            <label>Years of Experience</label>
                            <Input className=' text-black mt-4' placeholder="Ex. 5" type="number" max="50" required
                            onChange={(event)=>setjobExperience(event.target.value)}/>
                        </div>
                    </div>
                    <div className='flex gap-5 justify-end'>
                        <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>

                        {loading?
                        <>
                        <LoaderCircle className='animate-spin'/>Generating from AI
                        </>: "Start Interview"
                    }
                    </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddNewInterview