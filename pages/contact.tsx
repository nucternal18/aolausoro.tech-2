import Head from 'next/head';
import React from 'react';
import { Layout } from '../components/layout';
import ContactForm from '../components/ContactForm';

const contact = () => {
  return (
    <Layout title='aolausoro.yech - contact'>
      <Head>
        <title>aolausoro.tech - contact</title>
      </Head>
      <section className='flex items-center justify-center flex-grow mx-auto'>
        <div className='w-full md:w-2/4'>
          <ContactForm />
        </div>
      </section>
    </Layout>
  );
};

export default contact;
