import { Button } from "./button";

export function NavTabs({ active, onChange }) {
  const tabs = ["Home", "Games", "Movies", "TV Shows", "Books"];

  return (
    <div
      className="
        h-11 inline-flex items-center
        rounded-2xl
        bg-blue-950
        px-2
        backdrop-blur-md
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
                : "text-blue-200 hover:text-yellow-200 hover:bg-blue-500",
            ].join(" ")}
          >
            {t}
          </Button>
        );
      })}
    </div>
  );
}
