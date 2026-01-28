import { Button } from "./button";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TAB_CONFIG = [
  { label: "Activity", path: "/profile" },
  { label: "Reviews", path: "/profile/reviews" },
  { label: "Statistics", path: "/profile/statistics" },
  { label: "Games", path: "/profile/games?status=seen" },
  { label: "Movies", path: "/profile/movies?status=seen" },
  { label: "TV Shows", path: "/profile/tv_shows?status=seen" },
  { label: "Books", path: "/profile/books?status=seen" },
];

export function NavTabsProfils({ active: activeProp, onChange }) {
  const navigate = useNavigate();
  const location = useLocation();

  const active = useMemo(() => {
    if (activeProp) return activeProp;

    const path = location.pathname;

    if (path === "/profile" || path.startsWith("/profile/")) {
      if (path === "/profile") return "Activity";
      if (path.startsWith("/profile/reviews")) return "Reviews";
      if (path.startsWith("/profile/statistics")) return "Statistics";
      if (path.startsWith("/profile/games")) return "Games";
      if (path.startsWith("/profile/movies")) return "Movies";
      if (path.startsWith("/profile/tv_shows")) return "TV Shows";
      if (path.startsWith("/profile/books")) return "Books";
      return "Activity";
    }

    return "Activity";
  }, [activeProp, location.pathname]);

  return (
    <div
      className=" h-11 inline-flex items-center
        rounded-2xl overflow-hidden
        bg-[#001328]
        border border-[#102A47]
        divide-x divide-[#102A47]"
    >
      {TAB_CONFIG.map(({ label, path }) => {
        const isActive = label === active;

        return (
          <Button
            key={label}
            type="button"
            onClick={() => {
              onChange?.(label);
              navigate(path);
            }}
            className={[
              "h-full px-6 text-sm font-medium transition-colors rounded-none",
              "first:rounded-l-2xl last:rounded-r-2xl",
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
