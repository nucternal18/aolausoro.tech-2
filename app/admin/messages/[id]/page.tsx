"use client";
import { useRouter } from "next/navigation";
import { useGetMessageQuery } from "app/GlobalReduxStore/features/messages/messagesApiSlice";
import Loader from "components/Loader";

function Message({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const { data: message, isLoading } = useGetMessageQuery(id);

  if (isLoading) {
    return (
      <section className="flex items-center justify-center w-full h-full">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }

  return (
    <section className="max-w-screen-md w-full h-full p-4 mx-auto  ">
      <div className="flex items-center justify-between w-full p-6 my-4 overflow-hidden border-b border-gray-800 dark:border-yellow-500 md:mx-auto">
        <div className="mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300">
          <h1 className="">
            <span className="mr-4">Message:</span>
            <span className="uppercase">{message?.subject}</span>
          </h1>
        </div>
        <div>
          <button
            type="button"
            className="px-6 py-2.5 bg-yellow-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg transition duration-150 ease-in-out"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </div>
      <div className="px-4 py-2 border h-fit">
        <div className="px-1 border-b mb-2 border-gray-800 dark:border-gray-300">
          <p className="mb-2 text-xl font-bold  dark:text-gray-300">
            <span className="mr-4 ">Name:</span>
            <span>{message?.name}</span>
          </p>
        </div>
        <div className="px-1 border-b mb-2 border-gray-800 dark:border-gray-300">
          <p className="mb-2 text-xl font-bold dark:text-gray-300">
            <span className="mr-4 ">Email:</span>
            <span>{message?.email}</span>
          </p>
        </div>
        <div className="px-1 border-b mb-2 border-gray-800 dark:border-gray-300">
          <p className="mb-2 text-xl font-bold  dark:text-gray-300">
            <span className="mr-4 ">Subject:</span>
            <span>{message?.subject}</span>
          </p>
        </div>
        <div className="px-1 py-4 ">
          <p className="mb-2 text-xl font-bold  dark:text-gray-300">
            <span>{message?.message}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Message;
