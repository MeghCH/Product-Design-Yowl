import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "./button";

export function NavTabs({ active, onChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("userId");

  const tabs = [
    { label: "Home", path: isLoggedIn ? "/home/log" : "/" },
    { label: "Games", path: "/category/games" },
    { label: "Movies", path: "/category/movies" },
    { label: "TV Shows", path: "/category/tv_shows" },
    { label: "Books", path: "/category/books" },
  ];

  useEffect(() => {
    const found = tabs.find((t) => t.path === location.pathname);
    if (found && found.label !== active) onChange(found.label);
  }, [location.pathname]);

  return (
    <div
      className="
        h-11 inline-flex items-center
        rounded-2xl
        bg-deepblue
        backdrop-blur-md
      "
    >
      {tabs.map(({ label, path }) => {
        const isActive = label === active;

        return (
          <Button
            key={label}
            onClick={() => {
              onChange(label);
              navigate(path);
            }}
            className={[
              "h-full px-6 rounded-2xl text-sm font-medium transition-colors",
              isActive
                ? "bg-yellow-400 text-blue-800"
                : "text-lightblue hover:text-textyellow hover:bg-hoverblue",
            ].join(" ")}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
