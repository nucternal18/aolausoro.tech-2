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
      <section className='w-screen'>
        <div className='flex-grow w-full mx-auto -m-1 contact'>
          <ContactForm />
        </div>
      </section>
    </Layout>
  );
};

export default contact;
