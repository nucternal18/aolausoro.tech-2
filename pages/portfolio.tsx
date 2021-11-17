import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
// import { useQuery } from 'react-query';

// Components
import { Layout } from '../components/layout';
import { Card, CardBody, CardTitle } from '../components/Card';

// Server address
import { NEXT_URL } from '../config';
// import { GithubRepoCard } from '../components/GithubRepoCard';
// import Spinner from '../components/Spinner';
import Link from 'next/link';

// type Data = {
//   id: string;
//   data: {
//     address: string;
//     url: string;
//     github: string;
//     createdAt: {
//       seconds: number
//       nanoseconds: number
//     };
//     projectName: string;
//   }
//  }[]

// const fetcher = () =>
//   fetch(
//     'https://api.github.com/search/repositories?q=user:nucternal18+sort:author-date-asc'
//   ).then((res) => res.json());

const Portfolio = (props) => {
  // const { isLoading, data } = useQuery('github-profile', fetcher);

  return (
    <Layout title='aolausoro.tech - Portfolio'>
      <section className='max-w-screen-lg mx-auto mb-4'>
        <div className='flex items-center justify-between mb-6 border-b border-current dark:border-yellow-500'>
          <h1 className='my-4 text-5xl font-thin text-center text-black dark:text-yellow-500'>
            PORTFOLIO
          </h1>
          <Link href='https://github.com/nucternal18?tab=repositories'>
            <a className='px-4 py-2 font-semibold text-gray-700 bg-transparent border border-gray-500 rounded hover:text-white dark:text-yellow-500 dark:border-yellow-500 hover:bg-gray-500 dark:hover:bg-yellow-500 dark:hover:text-white hover:border-transparent'>
              View GitHub
              <i className='mx-2 fas fa-chevron-right' />
            </a>
          </Link>
        </div>

        <h2 className='text-2xl text-center text-black dark:text-gray-100'>
          Some of my projects
        </h2>

        <div className='grid grid-cols-1 gap-3 px-4 my-4 sm:grid-cols-2 md:grid-cols-3 sm:px-0'>
          {props &&
            props.data.map((doc) => {
              return (
                <Card key={doc.id}>
                  <div>
                    <Image
                      src={doc.data.url}
                      alt='project'
                      layout='intrinsic'
                      width={500}
                      height={350}
                      quality={50}
                      className='overflow-hidden'
                    />
                  </div>
                  <CardBody>
                    <div className='flex flex-col justify-evenly-between'>
                      <div className='flex-1'>
                        <div className='mb-2'>
                          <CardTitle className='my-2 text-xl text-center'>
                            {doc.data.projectName}
                          </CardTitle>
                          <div className='w-1/4 mx-auto border-b-2 border-yellow-400'></div>
                        </div>
                        {/* <div className='w-full mb-2'>
                          <p className='text-sm text-center'>
                            {doc.data?.description}
                          </p>
                        </div> */}
                      </div>

                      <div className='flex items-center mx-auto my-2'>
                        {doc.data.techStack?.map((tech, idx) => (
                          <div key={idx} className='mr-2 text-sm text-blue-400'>
                            {tech}
                          </div>
                        ))}
                      </div>

                      <div className='my-2 '>
                        <div className='flex items-center justify-between'>
                          <a
                            href={doc.data.address}
                            className='px-2 py-1 text-gray-200 bg-gray-400 rounded-full'>
                            Live Preview
                          </a>
                          <a
                            href={doc.data.github}
                            className='flex items-center px-2 py-1 text-gray-200 bg-gray-400 rounded-full'>
                            <FaGithub className='mr-1' />
                            <span>Source Code</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
        </div>
        <div className='text-center'>
          {/* <div className='grid max-w-6xl grid-cols-1 gap-8 px-10 mx-auto md:grid-cols-2 lg:grid-cols-3 lg:mt-10 gap-y-20'>
            {isLoading ? (
              <Spinner />
            ) : (
              data.items
                .splice(0, 6)
                .map((latestRepo, idx) => (
                  <GithubRepoCard latestRepo={latestRepo} key={idx} />
                ))
            )}
          </div> */}
        </div>
      </section>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const project = await fetch(`${NEXT_URL}/api/projects/getProjects`);
  const data = await project.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: data.data,
    },
  };
};

export default Portfolio;
