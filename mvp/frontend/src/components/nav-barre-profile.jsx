import { Button } from "./button";

export function NavTabsProfils({ active, onChange }) {
  const tabs = [
    "Activity",
    "Games",
    "Movies",
    "TV Shows",
    "Books",
    "Statistics",
    "Reviews",
  ];

  return (
    <div
      className="
        h-11 inline-flex items-center
        rounded-2xl
        bg-[#001328]
        px-2
        border
        border-[#102A47]
      "
    >
      {tabs.map((t) => {
        const isActive = t === active;
        return (
          <Button
            key={t}
            onClick={() => onChange(t)}
            className={[
              "h-full px-6 rounded-2xl text-sm font-medium transition-colors",
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
