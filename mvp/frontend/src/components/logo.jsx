import { twMerge } from "tailwind-merge";

export function Logo({ className }) {
  return (
    <div
      style={{ fontFamily: '"Libre Barcode 128 Text", cursive' }}
      className={twMerge("text-6xl text-blue-200", className)}
    >
      Goof Media
    </div>
  );
}
