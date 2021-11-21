import Head from "next/head";
import { useRouter } from "next/router";
import AdminsSidebar from "./AdminsSidebar";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  color?: string;
  description?: string;
  image?: string;
  type?: string;
  date?: Date;
};

export default function AdminLayout({
  children,
  title,
  color,
  description,
  image,
  type,
  date,
}: LayoutProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-between h-screen">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Personal portfolio website" />
        <meta name="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:url"
          content={`https://aolausoro.tech${router.asPath}`}
        />
        <link rel="canonical" href={`https://aolausoro.tech${router.asPath}`} />
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content="Manu Arora" />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mannupaaji" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        {date && (
          <meta
            property="article:published_time"
            content={date.toDateString()}
          />
        )}
      </Head>
      <AdminsSidebar />
      <main className="relative md:ml-64">{children}</main>
    </div>
  );
}
