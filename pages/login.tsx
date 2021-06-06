import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Layout } from '../components/layout';
// context
import { useAuth } from '../auth';
import Head from 'next/head';

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user, error, loginHandler, createAccount } = useAuth();

  const router = useRouter();

  const login = (e) => {
    e.preventDefault();
    loginHandler(email, password);

    setEmail('');
    setPassword('');
  };

  const createUser = (e) => {
    e.preventDefault();
    createAccount(email, password);
    setEmail('');
    setPassword('');
  };

  if (user) {
    return router.push('/admin');
  }

  return (
    <Layout title='aolausoro.tech - login'>
      <Head>
        <title>aolausoro.tech - login</title>
      </Head>
      <section className='container flex-grow h-full mx-auto mb-4'>
        <h1 className='my-8 text-3xl text-center'>
          Account <span className='text-blue-700'>Login</span>
        </h1>
        <form className='px-8 pt-6 pb-8 mx-2 mb-4 bg-white rounded shadow-lg sm:mx-auto sm:w-3/4'>
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block mb-2 text-base font-bold text-gray-700'>
              Email Address
            </label>
            <input
              className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-md appearance-none focus:outline-none focus:shadow-outline'
              type='email'
              name='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-8'>
            <label
              className='block mb-2 text-base font-bold text-gray-700'
              htmlFor='password'>
              Password
            </label>
            <input
              className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-md appearance-none focus:outline-none focus:shadow-outline'
              type='password'
              name='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className='flex items-center justify-between'>
            <button
              className='w-2/4 px-4 py-2 mr-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
              type='button'
              onClick={createUser}>
              Register
            </button>
            <button
              className='w-2/4 px-4 py-2 mr-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
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
