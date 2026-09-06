function Loader({ classes }: { classes: string }) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className={`${classes} bg-primary animate-bounce rounded-full`}></div>
      <div
        className={`${classes} bg-primary animate-bounce rounded-full delay-150 ease-in-out`}
      ></div>
      <div className={`${classes} bg-primary animate-bounce rounded-full`}></div>
    </div>
  )
}

export default Loader
