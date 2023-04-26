import { forwardRef, ReactNode } from "react";

export type Ref = HTMLButtonElement;

type ButtonProps = {
  disabled?: boolean;
  className?: string;
  color: string;
  type: "submit" | "button";
  children?: ReactNode;
  props?: any;
  onClick?: Function;
};

const Button = forwardRef<Ref, ButtonProps>(
  (
    {
      children,
      disabled,
      className,
      type,
      color,
      onClick,
      ...props
    }: ButtonProps,
    ref
  ) => (
    <button
      ref={ref}
      {...props}
      disabled={disabled}
      type={type}
      className={`${colors[color]} ${className} ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }  text-white focus:outline-none shadow rounded px-4 py-2 font-medium transition flex items-center justify-center ease-in duration-200`}
    >
      {children}
    </button>
  )
);

const colors = {
  primary: `border-blue-700 border-2 text-blue-700 active:bg-blue-700 active:text-white`,
  success: `border-green-700 border-2 text-green-700 active:bg-green-700 active:text-white`,
  danger: `border-red-600 border text-red-600 active:bg-red-600 active:text-white`,
  dark: `border-black border text-gray-900 active:bg-gray-900 active:text-gray-900 hover:bg-gray-900 hover:text-white`,
  warning: `border-yellow-500 border text-yellow-500 active:bg-yellow-500 active:text-white`,
  indigo: `border-indigo-900 border-2 text-indigo-900 active:bg-indigo-900 active:text-white`,
  yellow: `border-yellow-500 border text-yellow-500 active:bg-yellow-500 active:text-white text-center`,
};

Button.displayName = "Button";

export default Button;
