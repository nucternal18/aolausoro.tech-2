import Head from 'next/head';
import React from 'react';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { Layout } from '../components/layout';
import useFirestore from '../hooks/useFireStore';
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  ArrowIcon,
} from '../components/Card';

const Portfolio = () => {
  const { docs } = useFirestore('projects');
  return (
    <Layout title='aolausoro.tech - Portfolio'>
      <Head>
        <title>aolausoro.tech - Portfolio</title>
      </Head>
      <section className='flex-grow mx-auto mb-4 container-2xl'>
        <h1 className='my-4 text-2xl font-bold text-center text-black dark:text-gray-100'>
          PORTFOLIO
        </h1>

        <h2 className='text-center text-black dark:text-gray-100'>
          Some of my projects
        </h2>

        <div className='grid grid-cols-1 gap-4 px-4 my-4 sm:grid-cols-2 md:grid-cols-3 sm:px-0'>
          {docs &&
            docs.map((doc) => (
              <Card key={doc.id} className=''>
                <div>
                  <Image
                    src={doc.url}
                    alt='project'
                    layout='intrinsic'
                    width={400}
                    height={250}
                    quality={100}
                  />
                </div>
                <CardBody>
                  <div className='flex items-center justify-between'>
                    <a href={doc.address}>
                      <CardTitle className='text-md'>
                        <span className='code'>&lt;</span>
                        {doc.projectName}
                        <span className='code'>&#47;&gt;</span>
                      </CardTitle>
                    </a>
                    <a href={doc.github}>
                      <CardText>
                        <FaGithub />
                      </CardText>
                    </a>
                  </div>
                </CardBody>
              </Card>
            ))}
        </div>
        <div className='text-center'>
          <a
            href='https://github.com/nucternal18?tab=repositories'
            className='px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded dark:text-gray-100 dark:border-yellow-500 hover:bg-blue-500 dark:hover:bg-yellow-500 hover:text-white hover:border-transparent'>
            Checkout my github page
            <i className='mx-2 fas fa-chevron-right' />
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
