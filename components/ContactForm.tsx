import React, { useState, useRef, FC, FormEvent } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

type newMessageProps = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactForm = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messageSent, setMessageSent] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string; err: any }>();
  const recaptchaRef = useRef<ReCAPTCHA>();

  // const URL = 'http://localhost:3001';

  const addMessage = async (data) => {
    try {
      await fetch('/contact/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error(err);
      setError({ err, message: 'Message was not added' });
    }
  };

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = await recaptchaRef.current.executeAsync();

    const newMessage: newMessageProps = {
      name,
      email,
      subject,
      message,
    };
    try {
      const res = await fetch('/contact/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });
      if (res) {
        addMessage(newMessage);
      }
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setMessageSent(true);
    } catch (err) {
      console.error(err);
      setError({ err, message: 'Message was not sent' });
    }
  };

  const handleRefresh = () => {
    setMessageSent(false);
  };

  return (
    <div className='flex w-full mx-auto'>
      {messageSent ? (
        <div className='px-8 pt-6 pb-8 mx-3 mb-4 bg-white rounded shadow-md md:mx-0'>
          <h2 className='py-4 text-center'>Message Sent!</h2>
          <button
            type='submit'
            className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
            onClick={handleRefresh}>
            New Message!
          </button>
        </div>
      ) : (
        <form
          className='w-full px-8 py-6 mx-3 mb-4 bg-white rounded shadow-md dark:bg-gray-600 md:mx-0'
          onSubmit={sendMessage}>
          <h2 className='mb-4 font-mono text-2xl tracking-tight text-center text-current dark:text-gray-100 md:text-4xl'>
            Get in touch
          </h2>
          {error && <p>{error.message}</p>}
          <div className='mb-4 text-current bg-transparent dark:text-black dark:bg-gray-100'>
            <label className='block mb-2 text-sm font-bold ' htmlFor='name' />
            <input
              className='w-full px-3 py-2 leading-tight text-current text-black border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100'
              onChange={(e) => setName(e.target.value)}
              type='text'
              name='name'
              placeholder='Name'
              value={name}
            />
          </div>
          <div className='mb-4 text-black bg-transparent'>
            <label className='block mb-2 text-sm font-bold ' htmlFor='email' />
            <input
              className='w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100'
              onChange={(e) => setEmail(e.target.value)}
              type='email'
              name='email'
              placeholder='Email'
              value={email}
            />
          </div>
          <div className='mb-4 text-black bg-transparent'>
            <label className='block mb-2 text-sm font-bold ' htmlFor='name' />
            <input
              className='w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100'
              onChange={(e) => setSubject(e.target.value)}
              type='text'
              name='Subject'
              placeholder='Subject'
              value={subject}
            />
          </div>
          <div className='mb-4'>
            <label
              className='block mb-2 text-sm font-bold text-gray-700'
              htmlFor='message'
            />
            <textarea
              className='w-full h-48 px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100'
              value={message}
              name='message'
              placeholder='Message...'
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type='submit'
            className='w-full px-4 py-2 font-bold text-white rounded dark:bg-yellow-500 dark:text-gray-100 hover:bg-blue-700 dark:hover:bg-yellow-700 focus:outline-none focus:shadow-outline'>
            Send
          </button>
          <ReCAPTCHA
            ref={recaptchaRef}
            size='invisible'
            sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
          />
        </form>
      )}
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const cookies = nookies.get(context);
//     const token = await verifyIdToken(cookies.token);

//     return {
//       props: {
//         session: token,
//       },
//     };
//   } catch (e) {
//     context.res.writeHead(302, { location: '/login' });
//     context.res.end();
//     return { props: [] };
//   }
// };

export default ContactForm;
