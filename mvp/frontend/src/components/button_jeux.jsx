import { Button } from "./button";
export function ButtonJeux({ onClick }) {
  return (
    <Button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-600 focus:ring-green-500"
    >
      Jeux
    </Button>
  );
}
