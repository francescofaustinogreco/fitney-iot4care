import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value?: string;
};

export default function Button({ type = "button", value, className, children, ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`w-full text-lg font-semibold px-4 py-3 bg-primary-600 text-white rounded-sm cursor-pointer hover:bg-primary-700 transition duration-200 ${className || ""}`}
      {...rest}
    >
      {children || value}
    </button>
  );
}
