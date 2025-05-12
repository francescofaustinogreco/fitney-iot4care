import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={
        `w-full px-4 py-3 border text-lg border-secondary-300 placeholder-secondary-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 ${className || ""}`}
    />
  );
}
