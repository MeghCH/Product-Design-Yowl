import { Button } from "./button";

export function ButtonLog({ onClick }) {
    const handleClick = (e) => {
        console.log("ButtonLog clicked", { hasProp: !!onClick });
        if (onClick) {
            try { return onClick(e); } catch (err) { console.error(err); }
        }
        try {
            window.location.hash = "#/login";
        } catch (err) {
            console.warn("hash set failed, using href", err);
            window.location.href = "#/login";
        }
    };

    return (
        <Button
            onClick={handleClick}
            className="bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500"
        >
            Login
        </Button>
    );
}