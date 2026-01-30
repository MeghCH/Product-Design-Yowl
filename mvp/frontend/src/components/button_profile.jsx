import { useNavigate } from "react-router-dom";
import { Button } from "./button";

export function ButtonProfile({ onClick, to = "/profile" }) {
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
         bg-deepblue text-blue-200
        font-medium
        transition-colors duration-200
        hover:bg-hoverblue
      "
    >
      Profile
    </Button>
  );
}