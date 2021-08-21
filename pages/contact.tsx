import Head from 'next/head';
import { MdEmail } from 'react-icons/md';
import { Layout } from '../components/layout';
import ContactForm from '../components/ContactForm';
import { social } from '../data';
import Link from 'next/link';

const contact = () => {
  return (
    <Layout title='aolausoro.yech - contact'>
      <Head>
        <title>aolausoro.tech - contact</title>
      </Head>
      <section className='flex items-center justify-center flex-grow mx-auto sm:max-w-screen-md'>
        <div className='relative z-10 p-2 mx-auto my-10 rounded-md shadow-md dark:bg-blue-900 md:p-8'>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
            <div className='grid'>
              <header className='px-4'>
                <h1 className='text-2xl font-semibold dark:text-gray-300'>
                  Get in touch, let's talk.
                </h1>
                <p className='mt-2 text-base font-light text-gray-400'>
                  Fill in the details and I'll get back to you as soon as I can.
                </p>
              </header>
              <div className='inline-flex flex-col my-10 icons-container'>
                {/* <div className='flex flex-row items-center p-4 space-x-6 '>
                  <p className='text-sm font-light '>+91 9987384723</p>
                </div> */}
                <div className='flex flex-row items-center p-4 space-x-6'>
                  <MdEmail className='text-blue-400' />
                  <a
                    href='mailto:adewoyin@aolausoro.tech'
                    className='font-light text-md dark:text-gray-300 '>
                    adewoyin@aolausoro.tech
                  </a>
                </div>
              </div>
              <div className='flex flex-row items-center p-4 space-x-6'>
                {social.map((link) => {
                  const { id, url, icon, color } = link;
                  return (
                    <div key={id}>
                      <Link href={url}>
                        <a className={`${color} text-xl`}>{icon}</a>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default contact;
