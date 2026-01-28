import { useNavigate } from "react-router-dom";
import { Button } from "./button";

export function ButtonLog({ onClick, to = "/login" }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    console.log("ButtonLog clicked", { hasProp: !!onClick });

    if (onClick) {
      try {
        return onClick(e);
      } catch (err) {
        console.error(err);
      }
    }
    navigate(to);
  };

  return (
    <Button
      onClick={handleClick}
      className="
        h-11 px-8 rounded-2xl
        bg-yellow-500 text-blue-800
        font-medium
        transition-colors duration-200
        hover:bg-yellow-300
        focus:outline-none focus:ring-2 focus:ring-yellow-300/60
      "
    >
      Login
    </Button>
  );
}
