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

// Images locales: mets-les dans src/assets/posters/
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

export default function ProfileMediaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mediaType } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const status = searchParams.get("status") || "seen";
  const [activeTop, setActiveTop] = useState("Home");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profileTab, setProfileTab] = useState("Books");

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

  return (
    <div className="min-h-screen bg-[#000814] text-blue-100">
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
              <ButtonProfile onClick={() => navigate("/profile/activity")}>
                Profile
              </ButtonProfile>
            </div>
          </header>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-8 pt-14 pb-16">
        <div className="flex justify-center">
          <NavTabsProfils active={profileTab} onChange={setProfileTab} />
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
          <div className="mt-8 grid grid-cols-6 gap-4 text-[11px] text-blue-100/55">
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
          <div className="mt-3 grid grid-cols-6 gap-4">
            {loading ? (
              <p className="col-span-6 text-blue-100/70">Chargement...</p>
            ) : shown.length === 0 ? (
              <p className="col-span-6 text-blue-100/70">Aucun média.</p>
            ) : (
              shown.map((it) => <MediaRowCard key={it.id} item={it} />)
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

function MediaRowCard({ item }) {
  const img = getPosterUrl(item.picture);

  const rating = item.rating ?? "2/5";
  const decade = item.decade ?? "—";
  const genre = item.genre ?? "—";
  const date = item.added_at
    ? new Date(item.added_at).toLocaleDateString()
    : "—";

  return (
    <article className="group">
      <div className="grid grid-cols-6 gap-4 items-start">
        <div className="col-span-2">
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

        <div className="text-center text-xs text-blue-100/80 pt-1">
          {rating}
        </div>
        <div className="text-center text-xs text-blue-100/80 pt-1">
          {decade}
        </div>
        <div className="text-center text-xs text-blue-100/80 pt-1">{genre}</div>
        <div className="text-center text-xs text-blue-100/80 pt-1">{date}</div>
      </div>
    </article>
  );
}
