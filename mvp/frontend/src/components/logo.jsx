import {twMerge} from "tailwind-merge";

export function Logo({className}) {
    return (
        <div
            className={twMerge(
                "text-3xl font-bold text-blue-600",
                className
            )}
        >
            Goof Media
        </div>
    );
}