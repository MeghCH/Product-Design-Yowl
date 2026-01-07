import { Button } from "./button";

export function buttonCreateAccount({onClick}) {
    return (
        <button
            onClick={onClick}
            className={twMerge(
                "px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            )}
        >
            Create Account
        </button>
    );
}