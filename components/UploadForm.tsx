import React, { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import ProgressBar from './ProgressBar';
import { projectFirestore, timestamp } from '../firebase/firebaseClient';

const UploadForm = () => {
  const [error, setError] = useState<any>(null);
  const [url, setUrl] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [github, setGithub] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const types = ['image/png', 'image/jpeg', 'image/jpg'];

  const changeHandler = (e) => {
    const file = e.target.files[0];

    if (file && types.includes(file.type)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        uploadImage(reader.result);
      };
      reader.onerror = () => {
        console.error('something went wrong!');
      };
    } else {
      setError('Please select an image file (png or jpeg)');
    }
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: base64EncodedImage }),
      });
      const data  = await response.json();
      console.log(data)
      setUrl(data.url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const collectionRef = projectFirestore.collection('projects');

    await collectionRef.add({
      createdAt: timestamp(),
      url,
      projectName,
      github,
      address,
    });

    setProjectName('');
    setGithub('');
    setUrl('');
    setAddress('');
  };

  return (
    <form
      className='flex flex-col items-center justify-center p-6 mb-4 text-center w-'
      onSubmit={handleSubmit}>
      <div className='mb-6 text-3xl'>
        <label>
          <FaPlusCircle />
          <input type='file' onChange={changeHandler} className='hidden' />
        </label>
      </div>

      <div>
        {error && <div className='justify-center'>{error}</div>}
        {url && <div>{url}</div>}
        {/* {file && <ProgressBar file={file} setFile={setFile} setUrl={setUrl} />} */}
      </div>

      <div className='flex flex-col w-full mx-auto'>
        <div className='mb-6 md:flex md:items-center'>
          <div className='md:w-1/3'>
            <label
              className='block pr-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'
              htmlFor='inline-full-name'>
              Project Name
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500'
              id='inline-full-name'
              type='text'
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
        </div>
        <div className='mb-6 md:flex md:items-center '>
          <div className='md:w-1/3'>
            <label
              className='block pr-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'
              htmlFor='inline-github'>
              Github Address
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500'
              id='inline-github'
              type='text'
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
          </div>
        </div>
        <div className='mb-6 md:flex md:items-center '>
          <div className='md:w-1/3'>
            <label
              className='block pr-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'
              htmlFor='inline-web-address'>
              Web Address
            </label>
          </div>
          <div className='md:w-2/3'>
            <input
              className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500'
              id='inline-web-address'
              type='text'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <div className='md:flex md:items-center'>
          <div className='w-3/4 mx-auto'>
            <button
              className='px-4 py-2 font-bold text-white bg-orange-500 rounded shadow hover:bg-purple-400 focus:shadow-outline focus:outline-none'
              type='submit'>
              Add Project
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UploadForm;
