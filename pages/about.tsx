import React from 'react';
import Image from 'next/image';
import { Layout } from '../components/layout';
// import url from 'https://res.cloudinary.com/dus5nxe5w/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1623533235/2C7EB02D-5902-4970-9807-43E09C9D5AED_1_201_a_mwr1ys.jpg'

const url =
  'https://res.cloudinary.com/dus5nxe5w/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1623533235/2C7EB02D-5902-4970-9807-43E09C9D5AED_1_201_a_mwr1ys.jpg';

const about = () => {
  return (
    <Layout title='aolausoro.tech - about'>
      <section className='max-w-screen-xl px-2 md:px-0 pt-4 mx-auto'>
      <div className='flex items-center justify-between px-2  text-gray-800 border-b-2 border-current dark:border-yellow-500 dark:text-gray-100'>
          <h1 className='text-3xl font-bold tracking-wider md:text-5xl mb-2 dark:text-yellow-500'>
            About Me
          </h1>
        </div>
      </section>
      <section className='h-full grid grid-cols-1 md:grid-cols-2 max-w-screen-xl px-2 md:px-0 pt-4 mx-auto '>
        <article className='w-full my-auto'>
        <div className='md:w-[600px] mb-5 border-2 border-current  rounded-sm dark:border-yellow-500'>
            <Image
              src={url}
              alt='Shift key on a Typewriter'
              layout='responsive'
              objectFit='contain'
              quality={75}
              width={40}
              height={40}
              className='rounded-sm '
            />
          </div>
        </article>
        <article className='w-full'>
        
        <div className='flex   text-gray-800 dark:text-gray-100'>
          <div className='col-span-2 leading-normal tracking-wider text-justify px-2 font-light text-block sm:subpixel-antialiased md:antialiased'>
            <div className='text-lg font-semibold'>
              <p className='mb-2'>
                Dad, husband, coffee lover, anime lover and technology
                enthusiast. I have always had a love for technology and
                computing. I took an interest in software development after
                signing up for a BSC in computing and IT. The first module
                required some basic understanding of the python programming
                language, so I decided to take a quick course in Python. I
                really enjoyed the course, so I got stuck in and started
                learning to code alongside my degree. I have cultivated a desire
                to build things and keep learning more technologies. The added
                bonus of being a developer is a fun and fulfilling career and 
                there is always something new to learn.
              </p>
              <p className='mb-2'>
                As a developer, there is always something new to learn.The
                programming language, libraries and tools I have learnt so far
                are HTML, CSS, JavaScript, ReactJS, NodeJS, NextJS, Java, git,
                github actions, Redux, TailwindCss, Typescript, React-Query,
                React-Native and python.
              </p>
              <p className='mb-2'>
                I love a good laugh. I feel that laughing makes everyone around
                happy and more at ease. I also enjoy a good intellectual
                conversation. In my free time, you will find me on the computer
                learning new technologies, watching a great movie or anime with
                my sons, skateboarding, going for walks and most importantly
                family.
              </p>
              <p className='mb-2'>
                I am looking for a role as a Software developer at a company
                that provides ongoing training with an opportunity for growth
                and career advancements.
              </p>
            </div>
          </div>
        </div>
        </article>
      </section>
    </Layout>
  );
};

export default about;
