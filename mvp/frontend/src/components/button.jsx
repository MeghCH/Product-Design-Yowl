import {twMerge} from "tailwind-merge";

export function Button({children, className, onClick}) {
    return (
        <button
            onClick={onClick}
            className={twMerge(
                "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
                className
            )}
        >
            {children}
        </button>
    );
}