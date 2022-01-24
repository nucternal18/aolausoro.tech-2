import Head from "next/head";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Layout } from "../components/layout";
import Button from "components/Button";

const url =
  "https://res.cloudinary.com/dus5nxe5w/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1622888216/ruijia-wang-_cX76xaZB5A-unsplash_hqwwlm.jpg";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Home() {
  return (
    <Layout title="aolausoro.tech - home" color=" dark:text-yellow-500">
      <section className="relative flex items-center content-center justify-center h-screen max-w-screen-xl pt-16 pb-32 mx-auto">
        <div className="absolute top-0 w-full h-screen bg-center bg-cover">
          <Image
            src={url}
            alt="home background image"
            layout="fill"
            objectFit="cover"
            quality={75}
          />
          <span
            id="blackOverlay"
            className="absolute w-full h-full bg-black opacity-75"
          ></span>
        </div>
        <div className="container relative mx-auto">
          <div className="flex flex-wrap items-center justify-center ">
            <motion.div
              className="p-8 opacity-75 "
              initial="hidden"
              animate="visible"
              variants={variants}
              transition={{ duration: 2.0 }}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="p-2">
                  <div className="mx-auto mb-1 text-left">
                    <h1 className="grid grid-cols-1 mb-4 text-3xl font-thin text-gray-300 md:text-5xl ">
                      <span>Hi there, I'm Woyin.</span>
                      <span>I am a web & mobile application developer.</span>
                    </h1>
                    <div className="border-b-2 border-yellow-400 sm:w-3/4"></div>
                  </div>
                  <div className="w-full">
                    <h1 className="mb-4 text-2xl font-thin text-gray-300 md:text-5xl ">
                      Welcome to My Portfolio
                    </h1>
                  </div>
                  <a
                    data-testid="cv-button"
                    href="https://firebasestorage.googleapis.com/v0/b/aolausoro-tech.appspot.com/o/Adewoyin%20Oladipupo-Usoro%20CV.pdf?alt=media&token=ab66f4d3-ae06-4edf-8084-52dd24b17de5"
                  >
                    <Button type="button" color="yellow">
                      My Resume
                    </Button>
                  </a>
                </div>
                <div></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
