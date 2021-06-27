import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='en'>
        <Head />
        <body className='flex flex-col min-h-screen p-0 m-0 overflow-x-hidden overflow-y-auto text-gray-800 bg-white dark:bg-gray-900'>
          <Main />
          <NextScript />
          <div id='notifications'></div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
