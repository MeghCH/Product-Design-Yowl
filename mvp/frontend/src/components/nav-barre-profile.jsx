import { Button } from "./button";
import { useNavigate } from "react-router-dom";

const TAB_CONFIG = [
  { label: "Activity", path: "/profile" },
  { label: "Reviews", path: "/profile/reviews" },
  { label: "Statistics", path: "/profile/statistics" },
  { label: "Games", path: "/profile/games?status=seen" },
  { label: "Movies", path: "/profile/movies?status=seen" },
  { label: "TV Shows", path: "/profile/tv_shows?status=seen" },
  { label: "Books", path: "/profile/books?status=seen" },
];

export function NavTabsProfils({ active, onChange }) {
  const navigate = useNavigate();

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
