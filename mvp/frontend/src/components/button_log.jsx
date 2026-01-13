import { Button } from "./button";

export function ButtonLog({ onClick }) {
    const handleClick = (e) => {
        console.log("ButtonLog clicked", { hasProp: !!onClick });
        if (onClick) {
            try { return onClick(e); } catch (err) { console.error(err); }
        }
        try {
            if (window.location.hash === "#/login") {
                window.location.hash = "#/";
            } else {
                window.location.hash = "#/login";
            }
        } catch (err) {
            console.warn("hash set failed, using href", err);
            if (window.location.hash === "#/login") {
                window.location.href = "#/";
            } else {
                window.location.href = "#/login";
            }
        }
    };

    return (
        <Button
            onClick={handleClick}
            className="bg-yellow-500 hover:bg-yellow-600 text-black focus:ring-yellow-500"
        >
            Login
        </Button>
    );
}