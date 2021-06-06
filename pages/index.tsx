import Head from 'next/head';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Layout } from '../components/layout';

const url =
  'https://res.cloudinary.com/dus5nxe5w/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1622888216/ruijia-wang-_cX76xaZB5A-unsplash_hqwwlm.jpg';

export default function Home() {
  return (
    <Layout title='aolausoro.tech - home'>
      <Head>
        <title>aolausoro.tech - home</title>
      </Head>
      <main className='z-50 mx-auto'>
        <div className={styles.home}>
          <Image src={url} layout='fill' objectFit='cover' quality={100} />
        </div>
        <motion.div
          drag
          dragTransition={{
            min: 0,
            max: 100,
            bounceStiffness: 100,
          }}
          className='relative '>
          <div className='z-50 mx-auto text-center border-b-2 border-yellow-500 border-opacity-100'>
            <h1 className='z-50 w-full text-3xl font-semibold text-white sm:text-3xl md:text-4xl '>
              Hi, I'm Woyin
            </h1>
          </div>
          <h1 className='z-50 mt-2 text-3xl font-semibold text-center text-white md:text-4xl'>
            Welcome to My Portfolio
          </h1>
        </motion.div>
      </main>
    </Layout>
  );
}
