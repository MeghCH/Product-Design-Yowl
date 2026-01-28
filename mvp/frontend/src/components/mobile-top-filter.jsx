import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MobileTopFilter({
  items = ["Games", "Movies", "TV Shows", "Books"],
}) {
  const [active, setActive] = useState("Games");
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("userId");

  const pathByLabel = useMemo(
    () => ({
      Home: isLoggedIn ? "/home/log" : "/",
      Games: "/category/games",
      Movies: "/category/movies",
      "TV Shows": "/category/tv_shows",
      Books: "/category/books",
    }),
    [isLoggedIn],
  );

  return (
    <div className="md:hidden px-4 pt-6">
      <div className="rounded-sm bg-deepblue border border-white/10 overflow-hidden">
        <div className="grid grid-cols-4">
          {items.map((label) => {
            const isActive = active === label;

            return (
              <button
                key={label}
                type="button"
                className={[
                  "py-3 text-sm",
                  isActive
                    ? "text-textyellow" // ✅ comme avant
                    : "text-blue-200 hover:text-blue-50",
                ].join(" ")}
                onClick={() => {
                  setActive(label); // ✅ garde ton isActive
                  const path = pathByLabel[label];
                  if (path) navigate(path); // ✅ navigate comme NavTabs
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
