import { Button } from "./button";

export function ButtonFilm({ onClick, active = false }) {
  return (
    <Button
      onClick={onClick}
      className="
    h-10 px-6 rounded-2xl
    text-sm font-medium
    bg-white/8 text-white
  "
    >
      Film
    </Button>
  );
}
