import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaUser } from "react-icons/fa";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "next-themes";
import { getSession, signOut } from "next-auth/react";

import { links, social } from "../data";

// context
import { useAuth } from "../context/authContext";

type NavProps = {
  textColor?: string;
};

type NavLinkProps = {
  children: any;
  left?: any;
  right?: any;
  center?: any;
};

type SessionProps = {
  expires: string;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
};

export default function Navbar({ textColor }: NavProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { state } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedSession, setLoadedSession] = useState<SessionProps>(null);

  useEffect(() => {
    getSession().then((session) => {
      setLoading(false);
      if (session) {
        setLoadedSession(session);
      }
    });
  }, []);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    signOut();
    router.push("/");
  };

  return (
    <Nav bgColor="bg-white dark:bg-gray-900">
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
          {loadedSession && (
            <>
              <Nav.Item>
                <Nav.Link href="/admin">ADMIN</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <button
                  type="button"
                  onClick={logout}
                  className="flex px-2 py-1 ml-4 text-lg font-medium list-none cursor-pointer md:block md:ml-0 md:mb-0 md:py-2 md:px-1"
                >
                  <FiLogOut />
                </button>
              </Nav.Item>
            </>
          )}
        </Nav.NavLinks>
        <Nav.NavLinks right>
          <Nav.Item>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex p-1 ml-4 font-medium list-none border-2 border-current rounded-full cursor-pointer md:block lg:ml-0 lg:mb-0 lg:p-1 lg:px-1 focus:outline-none focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent"
            >
              {theme === "light" ? (
                <FiSun className="text-lg font-bold " />
              ) : (
                <FiMoon className="font-semibold " />
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
          {!loadedSession && (
            <Nav.Item>
              <Nav.Link href="/login">
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
        <div className="flex flex-row mt-48 ">
          {social.map((link) => {
            const { id, url, icon } = link;
            return (
              <Nav.Item key={id}>
                <Nav.Link href={url}>{icon}</Nav.Link>
              </Nav.Item>
            );
          })}
          {!loadedSession && (
            <Nav.Item>
              <Nav.Link href="/login">
                <FaUser />
              </Nav.Link>
            </Nav.Item>
          )}
        </div>
        {loadedSession && <Nav.Item>{loadedSession.user.name}</Nav.Item>}
      </Nav.SideNav>
    </Nav>
  );
}

/* Navbar logic */
const Nav = ({ bgColor, children }) => (
  <nav className={`${bgColor} md:px-6 md:py-1`}>{children}</nav>
);
Nav.Container = ({ children, textColor }) => (
  <div
    className={` ${textColor} container mx-auto font-semibold md:relative md:flex  md:items-center py-1 px-4 sm:px-1 md:px-0 md:flex-row md:justify-between sm:max-w-screen-xl z-0 md:z-50`}
  >
    {children}
  </div>
);
/* You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby */
Nav.Brand = ({ children, href }) => (
  <Link href={href}>
    <a className="inline-block w-48 p-0 m-0 py-1.5 mr-4 cursor-pointer text-2xl font-bold whitespace-nowrap hover:text-gray-400">
      <strong>{children}</strong>
    </a>
  </Link>
);
Nav.Toggler = ({ toggle, isOpen, color }) => (
  <div className="text-current ">
    <button
      type="button"
      aria-expanded="false"
      aria-disabled={isOpen}
      disabled={isOpen}
      aria-label="Toggle navigation"
      className={`relative z-50 items-center block float-right py-5 mr-4 text-4xl text-current md:hidden focus:outline-none focus:shadow-none ${color} dark:text-yellow-500`}
      onClick={toggle}
    >
      <span className="z-50">&#8801;</span>
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
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, ref]);
  return (
    <aside
      className={
        isOpen
          ? `${className.default} ${className.enabled}`
          : `${className.default} ${className.disabled}`
      }
      ref={ref}
    >
      <div className="flex ">
        <div className="flex flex-row ">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="absolute p-1 mt-2 ml-4 font-medium list-none border-2 rounded-full cursor-pointer dark:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent focus:shadow-none"
          >
            {theme === "light" ? (
              <FiSun className="font-semibold text-white" />
            ) : (
              <FiMoon className="font-semibold text-yellow-500" />
            )}
          </button>
          <button
            aria-label="Close"
            className="absolute z-50 p-1 text-4xl cursor-pointer top-3 focus:outline-none right-3 focus:ring-2 focus:ring-current dark:focus:ring-yellow-500 focus:border-transparent focus:shadow-none"
            onClick={toggle}
          >
            &times;
          </button>
        </div>
      </div>
      <div className="mt-20">{children}</div>
    </aside>
  );
};
Nav.NavLinks = ({ children, left, right, center }: NavLinkProps) => {
  const className = left
    ? "hidden  pl-0 mb-0 mr-auto md:flex md:items-center md:pl-0 md:mb-0"
    : right
    ? "hidden  pl-0 mb-0 ml-auto md:flex md:items-center md:pl-0 md:mb-0 "
    : center
    ? "hidden  pl-0 mb-0 ml-auto md:flex md:pl-0 md:mb-0 md:mx-auto "
    : "hidden  pl-0 mb-0 mr-auto md:flex md:pl-0 md:mb-0";
  return <ul className={className}>{children}</ul>;
};
Nav.Item = ({ children }) => (
  <li className="z-50 flex px-2 py-1 mb-1 text-lg font-medium list-none cursor-pointer sm:block md:ml-0 md:mb-0 md:py-1 md:px-1">
    {children}
  </li>
);
/* You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby */
Nav.Link = ({ children, href }) => (
  <Link href={href}>
    <a className="z-50 flex px-2 py-1 mb-1 text-lg font-medium list-none cursor-pointer sm:block md:ml-0 md:mb-0 md:py-1 md:px-1">
      {children}
    </a>
  </Link>
);

const className = {
  default: `lg:hidden flex h-screen fixed top-0 right-0 transition-all ease duration-200 text-gray-200 dark:text-yellow-500`,
  enabled: `w-8/12  bg-gray-800 overflow-x-hidden   text-lg  py-4 z-50`,
  disabled: `w-0  bg-gray-800 text-white overflow-x-hidden`,
};
