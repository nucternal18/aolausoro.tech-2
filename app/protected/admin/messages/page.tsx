import { Suspense } from "react";

// components
import Header from "@components/header";
import { MessagesComponent } from "./messages";
import Loader from "@components/Loader";
import { getMessages } from "@app/actions/messages";

export default async function Page() {
  const messages = await getMessages();
  return (
    <section className=" container flex-grow w-full h-screen p-2 sm:p-6 space-y-4  mx-auto">
      <Header title="Messages" order={1} />
      <Suspense
        fallback={
          <section className="flex container max-w-screen-xl flex-grow w-full h-full items-center justify-center px-2 mx-auto">
            <Loader classes="w-8 h-8" />
          </section>
        }
      >
        {"message" in messages ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-lg font-semibold">
              {messages.message ?? "No messages found"}
            </div>
          </div>
        ) : (
          <MessagesComponent messages={messages} />
        )}
      </Suspense>
    </section>
  );
}
