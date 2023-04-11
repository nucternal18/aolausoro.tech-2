import { MdEmail } from "react-icons/md";
import Link from "next/link";
import { toast } from "react-toastify";

import ContactForm from "../../components/forms/ContactForm";
import { social } from "../../data";

function contact() {
  const addMessage = async (data) => {
    toast.info("Sending message.... Your message is on its way!");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (!response.ok) {
        toast.error("Message not sent!" + resData.message);
        throw new Error(resData.message || "Something went wrong");
      }
      toast.success("Message sent successfully!");
    } catch (err) {
      toast.error("Message not sent!" + err.message);
    }
  };
  const submitHandler = async (newMessage) => {
    toast.info("Sending message.... Your message is on its way!");

    try {
      const res = await fetch("/api/contact/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });
      const resData = await res.json();
      if (res.ok) {
        addMessage(newMessage);
      }
      if (!res.ok) {
        toast.error("Message not sent!" + resData.message);
        throw new Error(resData.message || "Something went wrong");
      }
      toast.success("Message sent successfully!");
    } catch (err) {
      toast.error("Message not sent!" + err.message);
    }
  };
  return (
    <section className="flex items-center justify-center h-full flex-grow mx-auto sm:max-w-screen-md">
      <div className="relative z-10 p-2 mx-auto my-10 rounded-md shadow-2xl dark:bg-indigo-900 md:p-8">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="grid">
            <header className="px-4">
              <h1 className="text-2xl font-semibold dark:text-gray-300">
                Get in touch, let's talk.
              </h1>
              <p className="mt-2 text-base font-light text-gray-400">
                Fill in the details and I'll get back to you as soon as I can.
              </p>
            </header>
            <div className="inline-flex flex-col my-10 icons-container">
              {/* <div className='flex flex-row items-center p-4 space-x-6 '>
                  <p className='text-sm font-light '>+91 9987384723</p>
                </div> */}
              <div className="flex flex-row items-center p-4 space-x-6">
                <MdEmail className="text-blue-400" />
                <a
                  href="mailto:adewoyin@aolausoro.tech"
                  className="font-light text-md dark:text-gray-300 "
                >
                  adewoyin@aolausoro.tech
                </a>
              </div>
            </div>
            <div className="flex flex-row items-center p-4 space-x-6">
              {social.map((link) => {
                const { id, url, icon, color } = link;
                return (
                  <div key={id} className={`${color} text-xl`}>
                    <Link href={url}>{icon}</Link>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <ContactForm submitHandler={submitHandler} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default contact;
