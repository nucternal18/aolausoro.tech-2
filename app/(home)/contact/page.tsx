import { MdEmail } from "react-icons/md";
import Link from "next/link";

// components
import ContactForm from "./ContactForm";
import { social } from "../../../data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";

function ContactPage() {
  return (
    <section className="flex items-center justify-center h-screen flex-grow mx-auto sm:max-w-screen-md">
      <Card className="relative z-10 p-2 mx-auto my-10 rounded-md shadow-2xl md:p-8">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="grid">
            <CardHeader>
              <CardTitle>Get in touch</CardTitle>
              <CardDescription>
                Fill in the details and I'll get back to you as soon as I can.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
            <CardFooter>
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
            </CardFooter>
          </Card>
          <div>
            <ContactForm />
          </div>
        </div>
      </Card>
    </section>
  );
}

export default ContactPage;
