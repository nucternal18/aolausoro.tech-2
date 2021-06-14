import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  color?: string;
};

export const Layout = ({ children, title, color }: LayoutProps) => {
  return (
    <div className='flex flex-col justify-between h-screen'>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='Personal portfolio website' />
        <meta name='og:title' content={title} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <Navbar textColor={color}/>

      <main className='container z-0 flex w-full px-1 pt-1 mx-auto md:px-0 md:max-w-4xl'>
        {children}
      </main>
      <Footer />
    </div>
  );
};
