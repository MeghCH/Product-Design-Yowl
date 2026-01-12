import { Button } from "./button";
export function ButtonLivre({ onClick }) {
    return (
        <Button
            onClick={onClick}
            className="bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500"
        >
            Livre
        </Button>
    );
}   