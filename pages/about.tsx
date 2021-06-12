import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Layout } from '../components/layout';

const url =
  'https://res.cloudinary.com/dus5nxe5w/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1623533235/2C7EB02D-5902-4970-9807-43E09C9D5AED_1_201_a_mwr1ys.jpg';
// 'https://res.cloudinary.com/dus5nxe5w/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1622886757/shiftKeyOnTypewriter_rh1kuy.jpg';

const about = () => {
  return (
    <Layout title='aolausoro.tech - about'>
      <Head>
        <title>aolausoro.tech - about</title>
      </Head>
      <section className='flex w-screen text-black dark:text-gray-100'>
        <div className='mx-2 -mt-1'>
          <div className='grid grid-cols-1 md:grid-cols-3 '>
            <div className=' md:mr-4'>
              <div className='border-4 border-current rounded-full dark:border-yellow-500'>
                <Image
                  src={url}
                  alt='Shift key on a Typewriter'
                  layout='responsive'
                  objectFit='contain'
                  quality={75}
                  width={400}
                  height={400}
                  className='rounded-full '
                />
              </div>
            </div>
            <div className='col-span-2 leading-normal tracking-wider text-justify px-2font-light text-block sm:subpixel-antialiased md:antialiased'>
              <h1 className='mb-2 text-2xl font-bold tracking-wider'>
                About Me
              </h1>
              <div className='text-lg font-semibold'>
                <p className='mb-2'>
                  I have always had a love for technology and computing. I took
                  an interest in software development after signing up for a BSC
                  in computing and IT. The first module required I had some
                  skills in python programming. My interest was piqued so I
                  decided to take a quick course in Python. I really enjoyed the
                  course, so I got stuck in and started learning to code
                  alongside my degree. I have cultivated a desire to build
                  things, know how it works with the added bonus of starting a
                  fulfilling and challenging career.
                </p>
                <p className='mb-2'>
                  As a developer, there is always something new to learn.The
                  programming language, libraries and tools I have learnt so far
                  are HTML, CSS, JavaScript, ReactJS, NodeJS, NextJS, Java, git,
                  github actions, Redux, Tailwindcss, Typescript(beginner) and
                  python. I am really enjoying it.
                </p>
                <p className='mb-2'>
                  I love a good laugh. I feel that laughing makes everyone
                  around happy and more at ease. I also enjoy a good
                  intellectual conversation. In my free time, you will find me
                  on the computer learning new technologies, watching a great
                  movie or anime with my sons, skateboarding, going for walks
                  and most importantly family and most definitely loads of
                  coffee.
                </p>
                <p className='mb-2'>
                  I am looking for a role as a Software developer at a company
                  that provides ongoing training with an opportunity for growth
                  and career advancements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default about;
