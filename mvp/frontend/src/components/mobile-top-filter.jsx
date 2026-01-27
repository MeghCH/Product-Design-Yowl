import { useState } from "react";

export default function MobileTopFilter({
  items = ["Games", "Movies", "TV Shows", "Books"],
}) {
  const [active, setActive] = useState("Games");

  return (
    <div className="md:hidden px-4 pt-6">
      <div
        className="
          rounded-xl
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
                type="button"
                onClick={() => setActive(label)}
                className={`
                  py-4 text-center text-sm
                  transition-colors
                  ${
                    isActive
                      ? "bg-yellow-400 text-blue-800"
                      : "text-lightblue hover:text-textyellow hover:bg-hoverblue"
                  }
                `}
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
