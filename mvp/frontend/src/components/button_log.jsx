import { Button } from "./button";

export function ButtonLog({ onClick, type = "button" }) {
    const handleClick = (e) => {
        // 1. Si une fonction onClick est passées
        if (onClick) {
            return onClick(e);
        }

        // 2. Sinon, comportement par défaut : redirection vers login
        try {
            window.location.hash = "#/login";
        } catch (err) {
            console.warn("hash set failed, using href", err);
            window.location.href = "#/login";
        }
    };

    return (
        <Button
            type={type} // Permet de passer "submit"
            onClick={handleClick}
            className="bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 font-bold px-6 py-2 rounded-md transition-colors"
        >
            Login
        </Button>
    );
}