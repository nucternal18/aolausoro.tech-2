import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Layout } from '../components/layout';

const url =
  'https://res.cloudinary.com/dus5nxe5w/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1622886757/shiftKeyOnTypewriter_rh1kuy.jpg';

const about = () => {
  return (
    <Layout title='aolausoro.tech - about'>
      <Head>
        <title>aolausoro.tech - about</title>
      </Head>
      <section className='flex w-screen text-black'>
        <div className='-mt-1 rounded shadow-md '>
          <div className='flex flex-col '>
            <div className=''>
              <Image
                src={url}
                alt='Shift key on a Typewriter'
                layout='responsive'
                objectFit='cover'
                quality={75}
                width={600}
                height={300}
              />
            </div>
            <div className='px-2 my-4 font-light leading-normal tracking-wider text-justify text-block sm:subpixel-antialiased md:antialiased'>
              <h1 className='mb-2 text-2xl font-semibold tracking-wider'>
                About Me
              </h1>
              <p className='mb-2'>
                I have always had a love for technology and computing.
                I took an interest in software development after signing up for a BSC in
                computing and IT. The first module required I had some skills in
                python programming. My interest was piqued so I decided to take
                a quick course in Python. I really enjoyed the course, so I
                got stuck in and started learning to code alongside my
                degree. I have cultivated a desire to build things, know how it
                works with the added bonus of starting a fulfilling and
                challenging career.
              </p>
              <p className='mb-2'>
                As a developer, there is always
                something new to learn. I have learnt HTML, CSS,
                JavaScript, ReactJS, NodeJS, NextJS, Java, python and I am really
                enjoying it.
              </p>
              <p className='mb-2'>
                I love a good laugh. I feel that laughing makes everyone around
                happy and more at ease. I also enjoy a good intellectual
                conversation. In my free time, you will find me on the computer
                learning new technologies, watching a great movie or anime with
                my sons, skateboarding, going for walks and most importantly
                family and most definitely loads of coffee.
              </p>
              <p className='mb-2'>
                I am looking for a role as a Software developer at a company
                that provides ongoing training with an opportunity for growth
                and career advancements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default about;
