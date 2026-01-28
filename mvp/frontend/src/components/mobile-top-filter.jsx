import { useState } from "react";

export default function MobileTopFilter({
  items = ["Games", "Movies", "TV Shows", "Books"],
}) {
  const [active, setActive] = useState("Games");

  return (
    <div className="md:hidden px-4 pt-6">
      <div
        className="
          rounded-sm
          bg-deepblue
          border border-white/10
          overflow-hidden
        "
      >
        <div className="grid grid-cols-4">
          {items.map((label) => {
            const isActive = active === label;

            return (
              <button
                key={label}
                className={[
                  "py-3 text-sm",
                  isActive
                    ? "text-textyellow"
                    : "text-blue-200 hover:text-blue-50",
                ].join(" ")}
                onClick={() => setActive(label)}
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
