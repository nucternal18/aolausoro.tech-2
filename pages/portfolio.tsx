import Image from 'next/image';
import { FaGithub, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

// Components
import { Layout } from '../components/layout';
import { Card, CardBody, CardTitle } from '../components/Card';
// import { GithubRepoCard } from '../components/GithubRepoCard';
// import Spinner from '../components/Spinner';

// Server address
import { NEXT_URL } from '../config';

// Context
import { usePortfolio } from '../context/portfolioContext';
import Loader from 'components/Loader';



const Portfolio = (props) => {
  const { state } = usePortfolio();
  console.log(state.projects)
  return (
    <Layout title='aolausoro.tech - Portfolio'>
      <section className='max-w-screen-lg mx-auto mb-4 px-2 md:px-0'>
        <div className='relative flex items-center justify-between mb-6 border-b border-current dark:border-yellow-500'>
          <h1 className='my-4 text-5xl font-thin text-center text-black dark:text-yellow-500'>
            PORTFOLIO
          </h1>
          <Link href='https://github.com/nucternal18?tab=repositories'>
            <a className='px-2 py-2 flex items-center font-semibold text-gray-700 bg-transparent border border-gray-500 rounded hover:text-white dark:text-yellow-500 dark:border-yellow-500 hover:bg-gray-500 dark:hover:bg-yellow-500 dark:hover:text-white hover:border-transparent'>
              <span>View GitHub</span>
              <FaChevronRight />
            </a>
          </Link>
        </div>

        <h2 className='text-2xl text-center text-black dark:text-gray-100'>
          Some of my projects
        </h2>
        </section>
        <section className='max-w-screen-lg mx-auto mb-4'>
        <div className='grid grid-cols-1 gap-3 px-4 my-4 sm:grid-cols-2 md:grid-cols-3 sm:px-0'>
          {state.loading && <Loader classes='w-12' />}
          {state.projects &&
            state.projects.map((doc) => {
              return (
                <Card key={doc.id}>
                  <div>
                    <Image
                      src={doc.url}
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
                            {doc.projectName}
                          </CardTitle>
                          <div className='w-1/4 mx-auto border-b-2 border-yellow-400'></div>
                        </div>
                        {/* <div className='w-full mb-2'>
                          <p className='text-sm text-center'>
                            {doc?.description}
                          </p>
                        </div> */}
                      </div>

                      <div className='flex items-center mx-auto my-2'>
                        {doc.techStack?.map((tech, idx) => (
                          <div key={idx} className='mr-2 text-sm text-blue-400'>
                            {tech}
                          </div>
                        ))}
                      </div>

                      <div className='my-2 '>
                        <div className='flex items-center justify-between'>
                          <a
                            href={doc.address}
                            className='px-2 py-1 text-gray-200 bg-gray-400 rounded-full'>
                            Live Preview
                          </a>
                          <a
                            href={doc.github}
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
      </section>
    </Layout>
  );
};

export default Portfolio;
