import { Button } from "./button";
export function ButtonSerie({ onClick }) {
    return (
        <Button
            onClick={onClick}
            className="bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
        >
            Serie
        </Button>
    );
}