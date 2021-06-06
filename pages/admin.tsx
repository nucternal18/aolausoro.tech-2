import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Head from 'next/head';
import React from 'react';
import { Layout } from '../components/layout';
import UploadForm from '../components/UploadForm';

const admin = () => {
    const [isMounted, setIsMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
    const switchTheme = () => {
      if (isMounted) {
        setTheme(theme === 'light' ? 'dark' : 'light');
      }
    };
    return (
      <Layout title='aolausoro.tech - admin'>
        <Head>
          <title>aolausoro.tech - admin</title>
        </Head>
        <section className='flex w-screen'>
            <div className='items-center justify-center w-full p-6 my-4 overflow-hidden rounded shadow-lg md:mx-auto'>
              <p className='mb-2 text-center'>Add latest projects</p>
              <UploadForm />
            </div>
        </section>
      </Layout>
    );
}

export default admin
