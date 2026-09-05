import React from 'react'

function InterviewItemCard({ interview }) {
  return (
    <div className="my-3 rounded-lg border p-4">
      <h3 className="font-medium">{interview?.jobPosition}</h3>
      <p className="text-sm text-muted-foreground">
        {interview?.jobDescription}
      </p>
    </div>
  )
}

export default InterviewItemCard