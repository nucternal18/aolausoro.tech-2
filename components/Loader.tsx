function Loader({ classes }: { classes: string }) {
  return (
    <div className="flex items-center justify-center space-x-2 ">
      <div
        className={`${classes} animate-bounce bg-gray-900 dark:bg-yellow-500 rounded-full`}
      ></div>
      <div
        className={`${classes} animate-bounce bg-gray-900 dark:bg-yellow-500 ease-in-out delay-150 rounded-full`}
      ></div>
      <div
        className={`${classes} animate-bounce bg-gray-900 dark:bg-yellow-500 rounded-full`}
      ></div>
    </div>
  );
};

export default Loader;
