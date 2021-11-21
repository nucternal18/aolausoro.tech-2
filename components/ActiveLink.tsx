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
            : "text-gray-900 uppercase hover:text-yellow-500 dark:text-gray-100"
        } flex flex-row py-3 text-xs font-bold text-gray-800 uppercase hover:text-gray-600`}
      >
        {children}
      </a>
    </Link>
  );
}

export default ActiveLink;
