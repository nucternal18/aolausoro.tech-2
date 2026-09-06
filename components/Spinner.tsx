const Spinner = ({ message }: { message?: string }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="m-5 h-32 w-32 animate-spin rounded-full border-b-4 border-[#00BFFF] p-4" />
      <p className="px-2 text-center text-lg">{message}</p>
    </div>
  )
}

export default Spinner
