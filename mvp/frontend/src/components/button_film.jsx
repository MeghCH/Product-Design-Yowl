import { Button } from "./button";
export function ButtonFilm({ onClick }) {
    return (
        <Button
            onClick={onClick}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
        >
            Film
        </Button>
    );
}