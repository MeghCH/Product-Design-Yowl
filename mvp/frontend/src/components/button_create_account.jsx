import { Button } from "./button";

export function ButtonCreateAccount({ onClick }) {
  return (
    <Button
      onClick={onClick}
      className="bg-purple-500 hover:bg-purple-600 focus:ring-purple-500"
    >
      Create Account
    </Button>
  );
}
