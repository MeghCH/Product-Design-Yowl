import { Button } from "./button";
import { useMemo } from "react";

const TAB_CONFIG_REVIEW = [
  { label: "Reviews" },
  { label: "Resume" },
  { label: "Related" },
  { label: "Media" },
  { label: "Cast & Crew" },
  { label: "Similar shows" },
];

export function NavTabsReview({ active: activeProp, onChange }) {
  const active = useMemo(() => {
    return activeProp || "Reviews";
  }, [activeProp]);

  return (
    <div
      className="h-11 inline-flex items-center
        rounded-md overflow-hidden
        bg-[#001328]
        border border-[#102A47]
        divide-x divide-[#102A47]"
    >
      {TAB_CONFIG_REVIEW.map(({ label }) => {
        const isActive = label === active;

        return (
          <Button
            key={label}
            type="button"
            onClick={() => onChange?.(label)}
            className={[
              "h-full px-6 text-sm font-medium transition-colors rounded-none",
              "first:rounded-l-sm last:rounded-r-sm",
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

export default NavTabsReview;
