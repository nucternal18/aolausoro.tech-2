const JobInfo = ({ icon, text }) => {
  return (
    <div className="flex flex-row gap-1 items-center mb-2 font-mono text-sm">
      <span className="">{icon}</span>
      <span className="">{text}</span>
    </div>
  );
};

export default JobInfo;
