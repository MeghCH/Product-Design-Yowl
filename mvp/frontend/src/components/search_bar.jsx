import { twMerge } from "tailwind-merge";

export function SearchBar({
  placeholder = "Research",
  value,
  onChange,
  className,
}) {
  return (
    <div
      className={twMerge(
        "h-11 w-[320px] max-w-full rounded-2xl bg-deepblue px-5 backdrop-blur-md flex items-center gap-3",
        className,
      )}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-sm text-blue-200 placeholder:text-white/40 outline-none"
      />
      <span className="text-blue-200">⌕</span>
    </div>
  );
}
