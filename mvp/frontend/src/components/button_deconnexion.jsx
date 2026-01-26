import { Button } from "./button";
export function ButtonDeconnexion({ onClick }) {
    const handleClick = (e) => {
        console.log("ButtonDeconnexion clicked", { hasProp: !!onClick });
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
            className="bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
        >
            Deconnexion
        </Button>
    );
}