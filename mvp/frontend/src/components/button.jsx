import { twMerge } from "tailwind-merge";

export function Button({ children, className, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={twMerge(
        "inline-flex items-center justify-center select-none whitespace-nowrap",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-white/15",
        className,
      )}
    >
      {children}
    </button>
  );
}
