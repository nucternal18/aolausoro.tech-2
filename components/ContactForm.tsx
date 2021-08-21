import React, { useState, useRef, FormEvent, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from './Button';
import Notification from './notification/notification';

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
  const [error, setError] = useState<{ message?: string }>();
  const [requestStatus, setRequestStatus] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>();

  // const URL = 'http://localhost:3001';

   useEffect(() => {
     if (requestStatus === 'success' || requestStatus === 'error') {
       const timer = setTimeout(() => {
         setRequestStatus(null);
         setError(null);
       }, 3000);

       return () => clearTimeout(timer);
     }
   }, [requestStatus]);

  const addMessage = async (data) => {
    setRequestStatus('pending');
    try {
      const response = await fetch('/api/contact/addMessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Something went wrong');
      }
      setRequestStatus('success')
    } catch (err) {
      setRequestStatus('error')
      setError(err.message || 'Something went wrong');
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
     setRequestStatus('pending');
    try {
      const res = await fetch('/api/contact/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });
      const resData = await res.json();
      if (res.ok) {
        addMessage(newMessage);
      }
      if (!res.ok) {
        throw new Error(resData.message || 'Something went wrong');
      }
       setRequestStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setRequestStatus('error');
      setError(err.message || 'Something went wrong');
    }
  };

  let notification;

  if (requestStatus === 'pending') {
    notification = {
      status: 'pending',
      title: 'Sending message...',
      message: 'Your message is on its way!',
    };
  }

  if (requestStatus === 'success') {
    notification = {
      status: 'success',
      title: 'Success!',
      message: 'Message sent successfully!',
    };
  }

  if (requestStatus === 'error') {
    notification = {
      status: 'error',
      title: 'Error!',
      message: error,
    };
  }

  return (
    <section className='flex w-full mx-auto'>
      <form
        className='w-full px-8 py-6 mx-3 mb-4 bg-white border border-gray-600 rounded dark:bg-gray-900 md:mx-0'
        onSubmit={sendMessage}>
        <div className='mb-4 text-current bg-transparent dark:text-gray-700 dark:bg-gray-100'>
          <label htmlFor='name' />
          <input
            className='w-full px-3 py-2 leading-tight text-current border rounded appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100'
            onChange={(e) => setName(e.target.value)}
            type='text'
            id='name'
            placeholder='Name'
            value={name}
            required
          />
        </div>
        <div className='mb-4 text-current bg-transparent dark:text-gray-700'>
          <label htmlFor='email' />
          <input
            className='w-full px-3 py-2 leading-tight border rounded appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100'
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            id='email'
            placeholder='Email'
            value={email}
          />
        </div>
        <div className='mb-4 text-current bg-transparent dark:text-gray-700'>
          <label htmlFor='subject' />
          <input
            className='w-full px-3 py-2 leading-tight border rounded appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100'
            onChange={(e) => setSubject(e.target.value)}
            type='text'
            id='subject'
            placeholder='Subject'
            value={subject}
          />
        </div>
        <div className='mb-4 text-current bg-transparent dark:text-gray-700'>
          <label htmlFor='message' />
          <textarea
            className='w-full h-48 px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100'
            value={message}
            id='message'
            required
            rows={5}
            placeholder='Message...'
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <Button type='submit' color='yellow' className='w-full dark:text-white dark:bg-yellow-500'>
          Send
        </Button>
        {error && <p>{error.message}</p>}
        <ReCAPTCHA
          ref={recaptchaRef}
          size='invisible'
          sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
        />
      </form>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
    </section>
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
