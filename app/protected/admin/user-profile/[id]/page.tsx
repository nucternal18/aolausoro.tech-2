import React, { Suspense } from "react";
import { User } from "./user";
import Loader from "@components/Loader";
import { getUser } from "@app/actions/user";

export default async function Page() {
  const userData = await getUser();
  return (
    <section className="w-full h-full">
      <Suspense
        fallback={
          <div className="w-full h-full flex justify-center items-center">
            <Loader classes="w-8 h-8" />
          </div>
        }
      >
        <User userData={userData} />
      </Suspense>
    </section>
  );
}
