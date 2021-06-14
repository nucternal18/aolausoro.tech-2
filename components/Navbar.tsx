import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import { FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { firebaseClient } from '../firebase/firebaseClient';
import { useRouter } from 'next/router';
import { links, social } from '../data';

// context
import { useAuth } from '../auth';

type NavProps = {
  textColor?: string;
};

type NavLinkProps = {
  children: any;
  left?: any;
  right?: any;
  center?: any;
};

const Navbar = ({textColor}: NavProps) => {
  firebaseClient();
  const { theme, setTheme } = useTheme();
  const { user, logoutHandler } = useAuth();

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    logoutHandler();
    router.push('/');
  };

  return (
    <Nav bgColor='bg-white dark:bg-gray-900'>
      <Nav.Toggler toggle={toggle} isOpen={isOpen} color={textColor} />
      <Nav.Container textColor={`${textColor} dark:text-yellow-500`}>
        <Nav.NavLinks left>
          {links.map((link) => {
            const { id, url, text } = link;
            return (
              <Nav.Item key={id}>
                <Nav.Link href={url}>{text}</Nav.Link>
              </Nav.Item>
            );
          })}
          {user && (
            <>
              <Nav.Item>
                <Nav.Link href='/admin'>ADMIN</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <button
                  type='button'
                  onClick={logout}
                  className='flex px-2 py-1 ml-4 text-lg font-medium list-none cursor-pointer md:block lg:ml-0 lg:mb-0 lg:py-2 lg:px-1'>
                  <FiLogOut />
                </button>
              </Nav.Item>
            </>
          )}
        </Nav.NavLinks>
        <Nav.NavLinks right>
          <Nav.Item>
            <button
              type='button'
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='flex p-1 ml-4 font-medium list-none border-2 border-current rounded-full cursor-pointer md:block lg:ml-0 lg:mb-0 lg:p-1 lg:px-1 focus:outline-none focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent'>
              {theme === 'light' ? (
                <FiSun className='text-lg font-bold ' />
              ) : (
                <FiMoon className='font-semibold ' />
              )}
            </button>
          </Nav.Item>
          {social.map((link) => {
            const { id, url, icon } = link;
            return (
              <Nav.Item key={id}>
                <Nav.Link href={url}>{icon}</Nav.Link>
              </Nav.Item>
            );
          })}
          {user ? (
            <Nav.Item>{user.displayName}</Nav.Item>
          ) : (
            <Nav.Item>
              <Nav.Link href='/login'>
                <FaUser />
              </Nav.Link>
            </Nav.Item>
          )}
        </Nav.NavLinks>
      </Nav.Container>
      <Nav.SideNav isOpen={isOpen} toggle={toggle}>
        {links.map((link) => {
          const { id, url, text } = link;
          return (
            <Nav.Item key={id}>
              <Nav.Link href={url}>{text}</Nav.Link>
            </Nav.Item>
          );
        })}
        <div className='flex flex-row'>
          {social.map((link) => {
            const { id, url, icon } = link;
            return (
              <Nav.Item key={id}>
                <Nav.Link href={url}>{icon}</Nav.Link>
              </Nav.Item>
            );
          })}
          {user ? (
            <Nav.Item>{user.displayName}</Nav.Item>
          ) : (
            <Nav.Item>
              <Nav.Link href='/login'>
                <FaUser />
              </Nav.Link>
            </Nav.Item>
          )}
        </div>
      </Nav.SideNav>
    </Nav>
  );
};

/* Navbar logic */
const Nav = ({ bgColor, children }) => (
  <nav className={`${bgColor} md:px-6 md:py-1`}>{children}</nav>
);
Nav.Container = ({ children, textColor }) => (
  <div
    className={` ${textColor} container mx-auto font-semibold md:relative md:flex  md:items-center py-1 px-4 sm:px-1 md:px-0 md:flex-row md:justify-between z-0 md:z-50`}>
    {children}
  </div>
);
/* You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby */
Nav.Brand = ({ children, href }) => (
  <Link href={href}>
    <a className='inline-block w-48 p-0 m-0 py-1.5 mr-4 cursor-pointer text-2xl font-bold whitespace-nowrap hover:text-gray-400'>
      <strong>{children}</strong>
    </a>
  </Link>
);
Nav.Toggler = ({ toggle, isOpen, color }) => (
  <div className='text-current '>
    <button
      type='button'
      aria-expanded='false'
      aria-disabled={isOpen}
      disabled={isOpen}
      aria-label='Toggle navigation'
      className={`relative z-50 items-center block float-right py-5 mr-4 text-4xl text-current md:hidden focus:outline-none focus:shadow-none ${color} dark:text-yellow-500`}
      onClick={toggle}>
      <span className='z-50'>&#8801;</span>
    </button>
  </div>
);
Nav.SideNav = ({ isOpen, toggle, children }) => {
  const ref = useRef(null);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!ref.current?.contains(event.target)) {
        if (!isOpen) return;
        toggle(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, ref]);
  return (
    <aside
      className={
        isOpen
          ? `${className.default} ${className.enabled}`
          : `${className.default} ${className.disabled}`
      }
      ref={ref}>
      <div className='flex flex-row '>
        <button
          type='button'
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className='absolute p-1 ml-4 font-medium list-none border-2 rounded-full cursor-pointer dark:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent focus:shadow-none'>
          {theme === 'light' ? (
            <FiSun className='font-semibold text-white' />
          ) : (
            <FiMoon className='font-semibold text-yellow-500' />
          )}
        </button>
        <button
          aria-label='Close'
          className='absolute z-50 p-1 text-4xl cursor-pointer top-2 focus:outline-none right-3 focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent focus:shadow-none'
          onClick={toggle}>
          &times;
        </button>
      </div>
      <div className='mt-12'>{children}</div>
    </aside>
  );
};
Nav.NavLinks = ({ children, left, right, center }: NavLinkProps) => {
  const className = left
    ? 'hidden  pl-0 mb-0 mr-auto lg:flex md:pl-0 md:mb-0'
    : right
    ? 'hidden  pl-0 mb-0 ml-auto lg:flex md:pl-0 md:mb-0 '
    : center
    ? 'hidden  pl-0 mb-0 ml-auto lg:flex md:pl-0 md:mb-0 md:mx-auto '
    : 'hidden  pl-0 mb-0 mr-auto lg:flex md:pl-0 md:mb-0';
  return <ul className={className}>{children}</ul>;
};
Nav.Item = ({ children }) => (
  <li className='flex md:block   lg:ml-0 lg:mb-0 cursor-pointer py-1.5 lg:py-1 px-2 lg:px-1 text-lg font-medium list-none z-50'>
    {children}
  </li>
);
/* You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby */
Nav.Link = ({ children, href }) => (
  <Link href={href}>
    <a className='flex md:block  mb-2 lg:ml-0 lg:mb-0 cursor-pointer py-1.5 lg:py-1 px-2 lg:px-1 text-lg font-medium list-none z-50'>
      {children}
    </a>
  </Link>
);

const className = {
  default: `lg:hidden flex h-screen fixed top-0 right-0 transition-all ease duration-200 text-white dark:text-yellow-500`,
  enabled: `w-7/12 md:w-60 bg-black  overflow-x-hidden opacity-75  text-xl px-1 py-4 z-50`,
  disabled: `w-0  bg-gray-800 text-white overflow-x-hidden`,
};

export default Navbar;
