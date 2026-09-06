import React from 'react'

const JobInfo = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <div className="mb-2 flex flex-row items-center gap-1 font-mono text-sm">
      {icon}
      <span className="">{text}</span>
    </div>
  )
}

export default JobInfo
