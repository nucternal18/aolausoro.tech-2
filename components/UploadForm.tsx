import { useState, useEffect } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import Notification from './notification/notification';
import { usePortfolio } from '../context/portfolioContext';

const UploadForm = () => {
  const [error, setError] = useState<any>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [github, setGithub] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [requestStatus, setRequestStatus] = useState('');
  const [message, setMessage] = useState('')

  const { state, uploadImage, addProject } = usePortfolio();

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

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    addProject(projectName, github, address);
    setProjectName('');
    setGithub('');
    setAddress('');
    
  };

  let notification;

  if (requestStatus === 'pending') {
    notification = {
      status: 'pending',
      title: 'Sending item...',
      message: 'Upload is on its way!',
    };
  }

  if (requestStatus === 'success') {
    notification = {
      status: 'success',
      title: 'Success!',
      message: message,
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
    <section>
      <form
        className='flex flex-col items-center justify-center w-full p-6 mb-4 text-center'
        onSubmit={handleSubmit}>
        <div className='mb-6 text-3xl'>
          <label>
            <FaPlusCircle className='dark:text-gray-300' />
            <input type='file' onChange={changeHandler} className='hidden' />
          </label>
        </div>

        <div>
          {state.error && <p className='justify-center'>{state.error}</p>}
          {state.imageUrl && <p className='truncate'>{state.imageUrl}</p>}
          {/* {file && <ProgressBar file={file} setFile={setFile} setUrl={setUrl} />} */}
        </div>

        <div className='flex flex-col w-full mx-auto'>
          <div className='mb-6 md:flex md:items-center'>
            <label
              className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
              htmlFor='inline-full-name'
            />

            <input
              className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500'
              id='inline-full-name'
              placeholder='Project Name'
              type='text'
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className='mb-6 md:flex md:items-center '>
            <label
              className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
              htmlFor='inline-github'
            />
            <input
              className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500'
              id='inline-github'
              type='text'
              placeholder='Github Address'
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
          </div>
          <div className='mb-6 md:flex md:items-center '>
            <label
              className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
              htmlFor='inline-web-address'
            />

            <input
              className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500'
              id='inline-web-address'
              type='text'
              placeholder='Web Address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className='md:flex md:items-center'>
            <div className='w-full mx-auto'>
              <button
                className='w-full px-4 py-2 font-bold text-blue-700 border-2 border-blue-700 rounded dark:border-transparent dark:bg-yellow-500 dark:text-gray-100 hover:bg-blue-700 dark:hover:bg-yellow-700 focus:outline-none focus:shadow-outline hover:text-white'
                type='submit'>
                Add Project
              </button>
            </div>
          </div>
        </div>
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

export default UploadForm;
