import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Layout } from '../components/layout';
// context
import { useAuth } from '../context/authContext';

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user, error, loginHandler } = useAuth();

  const router = useRouter();

  const login = (e) => {
    e.preventDefault();
    loginHandler(email, password);

    setEmail('');
    setPassword('');
  };

  // const createUser = (e) => {
  //   e.preventDefault();
  //   createAccount(email, password);
  //   setEmail('');
  //   setPassword('');
  // };

  if (user) {
    router.push('/admin');
  }

  return (
    <Layout title='aolausoro.tech - login'>
      <section className='container mx-auto mb-4 md:flex-grow'>
        <h1 className='my-8 text-3xl text-center dark:text-gray-400'>
          Account <span className='text-blue-700'>Login</span>
        </h1>
        <form className='px-8 pt-6 pb-8 mx-2 mb-4 bg-white rounded shadow-lg dark:bg-gray-600 sm:mx-auto sm:w-2/4'>
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block mb-2 text-base font-bold text-gray-700' />

            <input
              className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-md appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100'
              type='email'
              id='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-8'>
            <label
              className='block mb-2 text-base font-bold text-gray-700'
              htmlFor='password' />
            <input
              className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-md appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100'
              type='password'
              id='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className='flex items-center justify-between'>
            <button
              className='w-2/4 px-4 py-2 mr-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline dark:bg-yellow-500 dark:text-gray-100 dark:hover:bg-yellow-700'
              type='button'
              onClick={login}>
              Login
            </button>
          </div>
          {error && (
            <div>
              <h3>{error.title}</h3>
              <p>{error.message}</p>
            </div>
          )}
        </form>
      </section>
    </Layout>
  );
}
