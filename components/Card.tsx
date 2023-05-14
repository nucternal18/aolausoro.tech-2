"use client";
import Image from "next/image";
interface CardInterface {
  className?: string;
  imgUrl: string;
  children: React.ReactNode;
}

const Card = ({ children, className, imgUrl }: CardInterface) => (
  <div className="w-full max-w-md  mx-auto rounded-3xl shadow-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
    <div className="max-w-md mx-auto">
      <div className="h-[236px] w-[336px] relative">
        <Image
          src={imgUrl}
          alt=""
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          priority
          sizes="(max-width: 336px) 100vw, 336px"
        />
      </div>
    </div>
    {children}
  </div>
);
const CardBody = ({ children }) => <div className="p-4 sm:p-6">{children}</div>;
const CardTitle = ({ children, className }) => (
  <h3
    className={`${className} font-bold text-gray-700 dark:text-gray-100 text-[22px] leading-7 mb-1 `}
  >
    {children}
  </h3>
);
const CardText = ({ children }) => (
  <p className="text-xs mt-4 text-gray-500 line-clamp-2 dark:text-gray-200 overflow-hidden">
    {children}
  </p>
);
const style = {
  boxShadow: "0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%)",
};
const ArrowIcon = () => (
  <svg
    className="w-4 h-4 ml-2"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

export { Card, CardBody, CardTitle, CardText, ArrowIcon };
