import React from "react";

const JobInfo = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <div className="flex flex-row gap-1 items-center mb-2 font-mono text-sm">
      {icon}
      <span className="">{text}</span>
    </div>
  );
};

export default JobInfo;
