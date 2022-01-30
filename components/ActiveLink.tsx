import { useRouter } from "next/router";
import Link from "next/link";

function ActiveLink({ children, href }) {
  const router = useRouter();

  return (
    <Link href={href}>
      <a
        className={`${
          router.asPath === href
            ? "text-yellow-500"
            : "text-gray-900 hover:text-yellow-500 dark:text-gray-100"
        } flex items-center flex-row py-3 text-lg font-thin text-gray-800 capitalize hover:text-gray-600`}
      >
        {children}
      </a>
    </Link>
  );
}

export default ActiveLink;
