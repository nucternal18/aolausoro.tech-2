import React, { FC, useEffect } from 'react';
import { motion } from 'framer-motion';
import useStorage from '../hooks/useStorage';

type Props = {
  file: any;
  setFile: (selected: null) => void;
  setUrl: (url: string) => void;
};

const ProgressBar: FC<Props> = ({ file, setFile, setUrl }) => {
  const { url, progress } = useStorage(file);

  useEffect(() => {
    if (url) {
      setUrl(url);
      setFile(null);
    }
  }, [url, setFile]);
  return (
    <motion.div
      initial={{ width: 0 }}
      className='progress-bar'
      animate={{ width: `${progress}%` }}
    />
  );
};

export default ProgressBar;
