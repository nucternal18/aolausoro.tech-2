import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { Layout } from '../components/layout';
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
} from '../components/Card';
import {server} from '../config'

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

const Portfolio = (props) => {

  return (
    <Layout title='aolausoro.tech - Portfolio'>
      <section className='mx-auto mb-4'>
        <h1 className='my-4 text-2xl font-bold text-center text-black dark:text-gray-100'>
          PORTFOLIO
        </h1>

        <h2 className='text-center text-black dark:text-gray-100'>
          Some of my projects
        </h2>

        <div className='grid grid-cols-1 gap-3 px-4 my-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:px-0'>
          {props &&
            props.data.map((doc) => {
              return (
                <Card key={doc.id} className=''>
                  <div>
                    <Image
                      src={doc.data.url}
                      alt='project'
                      layout='intrinsic'
                      width={500}
                      height={350}
                      quality={100}
                      className='overflow-hidden'
                    />
                  </div>
                  <CardBody>
                    <div className='flex items-center justify-between'>
                      <a href={doc.data.address}>
                        <CardTitle className='text-md'>
                          <span className='code'>&lt;</span>
                          {doc.data.projectName}
                          <span className='code'>&#47;&gt;</span>
                        </CardTitle>
                      </a>
                      <a href={doc.data.github}>
                        <CardText>
                          <FaGithub />
                        </CardText>
                      </a>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
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

export const getServerSideProps = async () => {
  const project = await fetch(`${server}/api/projects/getProjects`)
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
  }
}

export default Portfolio;
