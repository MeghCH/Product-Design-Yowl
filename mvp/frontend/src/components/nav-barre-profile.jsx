import { Button } from "./button";

export function NavTabsProfils({ active, onChange }) {
  const tabs = [
    "Activity",
    "Reviews",
    "Statistics",
    "Games",
    "Movies",
    "TV Shows",
    "Books",
  ];

  return (
    <div
      className="
        h-11 inline-flex items-center
        rounded-2xl overflow-hidden
        bg-[#001328]
        border border-[#102A47]
        divide-x divide-[#102A47]
      "
    >
      {tabs.map((t) => {
        const isActive = t === active;
        return (
          <Button
            key={t}
            onClick={() => onChange(t)}
            className={[
              "h-full px-6 text-sm font-medium transition-colors rounded-none",
              "first:rounded-l-2xl last:rounded-r-2xl",
              isActive
                ? "bg-yellow-400 text-blue-800"
                : "text-lightblue hover:text-textyellow hover:bg-hoverblue",
            ].join(" ")}
          >
            {t}
          </Button>
        );
      })}
    </div>
  );
}
