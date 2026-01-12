import {twMerge} from "tailwind-merge";

export function Button({children, className, onClick}) {
    return (
        <button
            onClick={onClick}
            className={twMerge(
                "px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50",

            )}
        >
            {children}
        </button>
    );
}