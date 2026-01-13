import { twMerge } from "tailwind-merge";

export function Button({ children, className, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={twMerge(
        "px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}
