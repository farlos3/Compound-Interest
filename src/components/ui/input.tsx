import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-lg border px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}
