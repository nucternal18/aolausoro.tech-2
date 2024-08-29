import { Suspense } from "react";

// components
import Header from "@components/header";
import { MessagesComponent } from "./messages";
import Loader from "@components/loader";

export default function Page() {
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
        <MessagesComponent />
      </Suspense>
    </section>
  );
}
