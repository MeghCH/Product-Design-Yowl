import { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { Logo } from "../components/logo";
import { SearchBar } from "../components/search_bar";
import { NavTabs } from "../components/nav-bar";
import { ButtonMsg } from "../components/button_message";
import { ButtonProfile } from "../components/button_profile";
import { NavTabsProfils } from "../components/nav-barre-profile";
import ProfilePage from "./ProfilePageActivity";

const posterModules = import.meta.glob("../assets/posters/*", { eager: true });
function getPosterUrl(filename) {
  if (!filename) return null;
  const found = Object.entries(posterModules).find(([p]) =>
    p.endsWith("/" + filename),
  );
  return found ? found[1].default : null;
}

const MEDIA_LABELS = {
  games: "Games",
  movies: "Movies",
  tv_shows: "TV Shows",
  books: "Books",
};

const MEDIA_TYPES = ["games", "movies", "tv_shows", "books"];

/* MOBILE */
function MobilePageHeader({ title, subtitle, onBack }) {
  return (
    <div className="sticky top-0 z-50 bg-[#000814]/80 backdrop-blur-md border-b border-white/5">
      <div className="px-4 pt-[calc(env(safe-area-inset-top)+48px)] pb-3">
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={onBack}
            className="absolute left-0 h-10 w-10 grid place-items-center text-blue-100/80"
            aria-label="Back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7"
            >
              <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
            </svg>
          </button>

          <h1 className="text-xl font-semibold text-blue-200">{title}</h1>
        </div>

        {subtitle ? (
          <div className="mt-3 flex items-center justify-center">
            <p className="text-[11px] text-blue-100/55 font-semibold">
              {subtitle}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ProfileMediaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mediaType } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const status = searchParams.get("status") || "seen";
  const [activeTop, setActiveTop] = useState("Home");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profileTab, setProfileTab] = useState("Activity");

  const profileRouteByLabel = useMemo(
    () => ({
      Activity: "/profile",
      Reviews: "/profile/reviews",
      Statistics: "/profile/statistics",
      Games: "/profile/games?status=seen",
      Movies: "/profile/movies?status=seen",
      "TV Shows": "/profile/tv_shows?status=seen",
      Books: "/profile/books?status=seen",
    }),
    [],
  );

  useEffect(() => {
    const p = location.pathname;

    if (p.includes("/profile/games")) setProfileTab("Games");
    else if (p.includes("/profile/movies")) setProfileTab("Movies");
    else if (p.includes("/profile/tv_shows")) setProfileTab("TV Shows");
    else if (p.includes("/profile/books")) setProfileTab("Books");
    else if (p.includes("/profile/statistics")) setProfileTab("Statistics");
    else if (p.includes("/profile/reviews")) setProfileTab("Reviews");
    else setProfileTab("Activity");
  }, [location.pathname]);

  const label = MEDIA_LABELS[mediaType] || "Media";

  useEffect(() => {
    if (!MEDIA_TYPES.includes(mediaType)) {
      setItems([]);
      setLoading(false);
      return;
    }

    const API = "http://localhost:4000";
    const userId = localStorage.getItem("userId") || 1;

    setLoading(true);
    fetch(
      `${API}/api/profile/media/${mediaType}?status=${status}&userId=${userId}`,
    )
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => {
        console.error(e);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [mediaType, status]);

  const shown = useMemo(() => items.slice(0, 12), [items]);

  if (!mediaType || mediaType === "activity") {
    return <ProfilePage />;
  }

  return (
    <div className="min-h-screen bg-[#000814] text-blue-200">
      {/* DESKTOP header */}
      <div className="sticky top-0 z-50 hidden md:block">
        <div className="bg-[#000814]/70 backdrop-blur-md border-b border-white/5">
          <header className="w-full flex justify-between items-center px-8 py-4">
            <button onClick={() => navigate("/")} aria-label="Home">
              <Logo />
            </button>

            <div className="flex items-center gap-6">
              <NavTabs active={activeTop} onChange={setActiveTop} />
              <SearchBar />
            </div>

            <div className="flex items-center gap-3">
              <ButtonMsg />

              <ButtonProfile onClick={() => navigate("/profile")}>
                Profile
              </ButtonProfile>
            </div>
          </header>
        </div>
      </div>

      {/* MOBILE header */}
      <div className="md:hidden">
        <MobilePageHeader
          title={label}
          subtitle={
            MEDIA_TYPES.includes(mediaType)
              ? `${items.length} ${items.length === 1 ? "item" : "items"}`
              : ""
          }
          onBack={() => navigate("/profile")}
        />
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-14 pb-16">
        <div className="hidden md:flex justify-center">
          <NavTabsProfils
            active={profileTab}
            onChange={(label) => {
              const to = profileRouteByLabel[label];
              if (!to) return;
              setProfileTab(label);
              navigate(to);
            }}
          />
        </div>

        {MEDIA_TYPES.includes(mediaType) && (
          <div className="mt-8 flex items-center gap-3">
            <button
              className={[
                "h-9 px-6 rounded-md text-sm font-semibold transition border",
                status === "seen"
                  ? "bg-yellow-400 text-blue-900 border-yellow-400"
                  : "bg-[#001D3D]/55 text-blue-100/80 border-white/5 hover:bg-white/5",
              ].join(" ")}
              onClick={() => setSearchParams({ status: "seen" })}
            >
              Read
            </button>

            <button
              className={[
                "h-9 px-6 rounded-md text-sm font-semibold transition border",
                status === "to_see"
                  ? "bg-yellow-400 text-blue-900 border-yellow-400"
                  : "bg-[#001D3D]/55 text-blue-100/80 border-white/5 hover:bg-white/5",
              ].join(" ")}
              onClick={() => setSearchParams({ status: "to_see" })}
            >
              To read
            </button>
          </div>
        )}

        {MEDIA_TYPES.includes(mediaType) && (
          <div className="mt-8 hidden md:grid grid-cols-6 gap-4 text-[11px] text-blue-100/55">
            <div className="col-span-2" />
            <div className="text-center">Rating</div>
            <div className="text-center">Decade</div>
            <div className="text-center">Genre</div>
            <div className="text-center text-yellow-400">
              {status === "seen" ? "Date read" : "Added"}
            </div>
          </div>
        )}

        {MEDIA_TYPES.includes(mediaType) && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-6 gap-4">
            {loading ? (
              <p className="col-span-2 md:col-span-6 text-blue-100/70">
                Chargement...
              </p>
            ) : shown.length === 0 ? (
              <p className="col-span-2 md:col-span-6 text-blue-100/70">
                Aucun média.
              </p>
            ) : (
              shown.map((it) => (
                <MediaRowCard key={it.id} item={it} status={status} />
              ))
            )}
          </div>
        )}

        {!MEDIA_TYPES.includes(mediaType) && (
          <div className="mt-10 text-blue-100/70">
            Page <span className="text-yellow-400 font-semibold">{label}</span>{" "}
            à créer.
          </div>
        )}
      </main>
    </div>
  );
}

function MediaRowCard({ item, status }) {
  const img = getPosterUrl(item.picture);

  const rating = item.rating ?? "2/5";
  const decade = item.decade ?? "—";
  const genre = item.genre ?? "—";
  const date = item.added_at
    ? new Date(item.added_at).toLocaleDateString()
    : "—";

  return (
    <article className="group">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-start">
        <div className="col-span-1 md:col-span-2">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/5 bg-[#001D3D]/40">
            {img ? (
              <img
                src={img}
                alt={item.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-white/40 text-xs">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block text-center text-xs text-blue-100/80 pt-1">
          {rating}
        </div>
        <div className="hidden md:block text-center text-xs text-blue-100/80 pt-1">
          {decade}
        </div>
        <div className="hidden md:block text-center text-xs text-blue-100/80 pt-1">
          {genre}
        </div>
        <div className="hidden md:block text-center text-xs text-blue-100/80 pt-1">
          {date}
        </div>

        <div className="md:hidden pt-1">
          <div className="text-sm font-semibold text-blue-100">
            {item.title}
          </div>
          <div className="mt-1 text-xs text-blue-100/60">
            {rating} • {decade} • {genre}
          </div>
          <div className="mt-1 text-xs text-yellow-400">
            {status === "seen" ? "Date read" : "Added"}:{" "}
            <span className="text-blue-100/70">{date}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
