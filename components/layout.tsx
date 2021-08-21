import Head from 'next/head';
import { useRouter } from 'next/router';

// Components
import Navbar from './Navbar';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  color?: string;
  description?: string;
  image?: string;
  type?: string;
  date?: Date;
};

export const Layout = ({
  children,
  title,
  color,
  description,
  image,
  type,
  date
}: LayoutProps) => {
  const router = useRouter();
  return (
    <div className='flex flex-col justify-between h-screen'>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='Personal portfolio website' />
        <meta name='og:title' content={title} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          property='og:url'
          content={`https://aolausoro.tech${router.asPath}`}
        />
        <link
          rel='canonical'
          href={`https://aolausoro.tech${router.asPath}`}
        />
        <meta property='og:type' content={type} />
        <meta property='og:site_name' content='Manu Arora' />
        <meta property='og:description' content={description} />
        <meta property='og:title' content={title} />
        <meta property='og:image' content={image} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@mannupaaji' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={image} />
        {date && (
          <meta property='article:published_time' content={date.toDateString()} />
        )}
      </Head>
      <Navbar textColor={color} />

      <main className='container z-0 px-1 pt-1 mx-auto my-4 md:px-4 md:pt-0'>
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: 'Adewoyin Oladipupo-Usoro - Web & Mobile Developer',
  description:
    "I've been developing websites for 5 years straight. Get in touch with me to know more.",
  image: '/profile.jpg',
  type: 'website',
};
