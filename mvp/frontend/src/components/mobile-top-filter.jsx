import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function MobileTopFilter({
  items = ["Games", "Movies", "TV Shows", "Books"],
}) {
  const navigate = useNavigate();
  const location = useLocation();

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

  const active = useMemo(() => {
    const path = location.pathname;

    for (const [label, p] of Object.entries(pathByLabel)) {
      if (p === path) return label;
    }

    if (path.startsWith("/category/games")) return "Games";
    if (path.startsWith("/category/movies")) return "Movies";
    if (path.startsWith("/category/tv_shows")) return "TV Shows";
    if (path.startsWith("/category/books")) return "Books";
    if (path.startsWith("/home")) return "Home";

    return "Games";
  }, [location.pathname, pathByLabel]);

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
                    ? "text-textyellow"
                    : "text-blue-200 hover:text-blue-50",
                ].join(" ")}
                onClick={() => {
                  const path = pathByLabel[label];
                  if (path) navigate(path);
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
