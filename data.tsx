import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaStackOverflow,
} from 'react-icons/fa';
export const links = [
  {
    id: 1,
    url: '/',
    text: 'HOME',
  },
  {
    id: 2,
    url: '/about',
    text: 'ABOUT',
  },
  {
    id: 3,
    url: '/portfolio',
    text: 'PORTFOLIO',
  },
  {
    id: 4,
    url: '/blog',
    text: 'BLOG',
  },
  {
    id: 5,
    url: '/contact',
    text: 'CONTACT',
  },
];

export const social = [
  {
    id: 1,
    url: 'https://github.com/nucternal18',
    icon: <FaGithub />,
    color: 'text-gray-500',
  },
  {
    id: 2,
    url: 'https://twitter.com/woy_in',
    icon: <FaTwitter />,
    color: 'text-blue-500',
  },
  {
    id: 3,
    url: 'https://www.linkedin.com/in/adewoyin-oladipupo-usoro-267291100/',
    icon: <FaLinkedin />,
    color: 'text-blue-500',
  },
  {
    id: 4,
    url: 'https://stackoverflow.com/users/11582232/aolausoro',
    icon: <FaStackOverflow />,
    color: 'text-red-700',
  },
];
