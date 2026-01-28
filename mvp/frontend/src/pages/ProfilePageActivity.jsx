import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Logo } from "../components/logo";
import { NavTabs } from "../components/nav-bar";
import { SearchBar } from "../components/search_bar";
import { NavTabsProfils } from "../components/nav-barre-profile";
import { ButtonMsg } from "../components/button_message";
import { ButtonProfile } from "../components/button_profile";
import ButtonLogOut from "../components/button_logout";
import MobileNavBarLoged from "../components/mobile-nav-bar-loged";
import MobileTopFilter from "../components/mobile-top-filter";

const API_BASE = "http://localhost:4000";

// ✅ Globs covers (comme homepage)
const gamesImgs = import.meta.glob("../assets/Games/*", {
  eager: true,
  import: "default",
});
const moviesImgs = import.meta.glob("../assets/Movies/*", {
  eager: true,
  import: "default",
});
const booksImgs = import.meta.glob("../assets/Books/*", {
  eager: true,
  import: "default",
});
const tvShowsImgs = import.meta.glob("../assets/Series/*", {
  eager: true,
  import: "default",
});

function makeIndex(globMap) {
  const index = {};
  for (const [path, url] of Object.entries(globMap)) {
    const filename = path.split("/").pop();
    if (!filename) continue;
    index[filename] = url;
    index[filename.toLowerCase()] = url; // tolérance casse
  }
  return index;
}

// ✅ évite JSON.parse crash si le backend renvoie du HTML (404, Cannot GET...)
async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Réponse non-JSON:", {
      status: res.status,
      url: res.url,
      text: text.slice(0, 200),
    });
    return null;
  }
}

function resolveCoverFromPicture(picture, indexes) {
  const key = String(picture || "").trim();
  if (!key) return null;

  const lower = key.toLowerCase();
  return (
    indexes.movies[key] ||
    indexes.movies[lower] ||
    indexes.tv_shows[key] ||
    indexes.tv_shows[lower] ||
    indexes.books[key] ||
    indexes.books[lower] ||
    indexes.games[key] ||
    indexes.games[lower] ||
    null
  );
}

export function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // peut rester null si pas d'api /user/:id
  const [favorites, setFavorites] = useState([]); // ✅ recent likes
  const [comments, setComments] = useState([]); // optionnel
  const [loading, setLoading] = useState(true);

  const [activeTop, setActiveTop] = useState("Home");
  const [activeProfileTab, setActiveProfileTab] = useState("Activity");
  const [mobileCategory, setMobileCategory] = useState("Games");

  // ✅ index images une fois
  const imageIndexes = useMemo(() => {
    return {
      games: makeIndex(gamesImgs),
      movies: makeIndex(moviesImgs),
      books: makeIndex(booksImgs),
      tv_shows: makeIndex(tvShowsImgs),
    };
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    async function load() {
      setLoading(true);

      // ✅ 1) Favorites (c’est ce que tu veux)
      const favRes = await fetch(`${API_BASE}/user/${userId}/favorites`);
      const favData = await safeJson(favRes);
      setFavorites(Array.isArray(favData) ? favData : []);

      // ✅ 2) User (optionnel) : si tu n’as pas l’api, ça ne casse pas
      try {
        const userRes = await fetch(`${API_BASE}/user/${userId}`);
        const userData = await safeJson(userRes);
        if (userData && typeof userData === "object") setUser(userData);
      } catch (e) {
        console.warn("API user absente ou erreur:", e);
      }

      // ✅ 3) Comments (optionnel)
      try {
        const cRes = await fetch(`${API_BASE}/user/${userId}/comments`);
        const cData = await safeJson(cRes);
        setComments(Array.isArray(cData) ? cData : []);
      } catch (e) {
        console.warn("API comments absente ou erreur:", e);
      }

      setLoading(false);
    }

    load().catch((err) => {
      console.error("Erreur chargement Profile:", err);
      setLoading(false);
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const initials = useMemo(() => {
    const name = user?.username || user?.email || "U";
    return String(name).trim().charAt(0).toUpperCase();
  }, [user]);

  const followers = 24;
  const following = 50;

  const chart = useMemo(
    () => [
      { label: "Games", value: 20 },
      { label: "Films", value: 50 },
      { label: "Shows", value: 70 },
      { label: "Books", value: 10 },
    ],
    [],
  );
  const maxV = Math.max(...chart.map((d) => d.value), 1);

  // ✅ Ajoute cover URL aux favorites
  const favoritesWithCover = useMemo(() => {
    return (favorites || []).map((f) => ({
      ...f,
      cover:
        // si ton API renvoie un champ "image" déjà complet
        (typeof f.image === "string" && f.image.trim().length > 0
          ? f.image
          : null) ||
        // sinon on mappe le "picture" à l’asset local
        resolveCoverFromPicture(f.picture, imageIndexes),
    }));
  }, [favorites, imageIndexes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000814] text-blue-100 flex items-center justify-center">
        Chargement du Codex...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000814] text-blue-100">
      {/* DESKTOP */}
      <div className="hidden md:block">
        <div className="sticky top-0 z-50">
          <div className="bg-[#000814]/70 backdrop-blur-md border-b border-white/5">
            <header className="w-full flex justify-between items-center px-8 py-4">
              <Logo />

              <div className="flex items-center gap-6">
                <NavTabs active={activeTop} onChange={setActiveTop} />
                <SearchBar />
              </div>

              <div className="flex items-center gap-3">
                <ButtonMsg type="button" aria-label="Quick action" />
                <ButtonProfile type="button" aria-label="Profile">
                  Profile
                </ButtonProfile>
              </div>
            </header>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-8 py-10 space-y-10">
          <section className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              <div className="relative">
                <div className="h-45 w-45 rounded-full bg-linear-to-br from-blue-300/40 to-blue-100/10 border border-white/10 flex items-center justify-center overflow-hidden">
                  <span className="text-4xl font-bold text-blue-50">
                    {initials}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div>
                  <h1 className="text-2xl text-blue-200 font-semibold leading-tight">
                    {user?.username || "User"}
                  </h1>
                  <p className="text-blue-100/60 text-sm">
                    Joined on {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-10">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{followers}</div>
                    <div className="text-blue-100/60 text-sm">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{following}</div>
                    <div className="text-blue-100/60 text-sm">Following</div>
                  </div>
                </div>
              </div>
            </div>

            <ButtonLogOut onClick={handleLogout} />
          </section>

          <div className="flex justify-center">
            <NavTabsProfils
              active={activeProfileTab}
              onChange={setActiveProfileTab}
            />
          </div>

          {/* ✅ Recent likes + covers */}
          <section className="grid grid-cols-[1fr_220px] gap-10 items-start">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-yellow-400 font-semibold">Recent likes</h2>
                <button className="text-blue-100/70 text-sm hover:text-blue-100">
                  See all &gt;
                </button>
              </div>

              <div className="grid grid-cols-4 gap-6">
                {(favoritesWithCover.length
                  ? favoritesWithCover
                  : [null, null, null, null]
                )
                  .slice(0, 4)
                  .map((item, idx) => (
                    <div
                      key={item?.id ?? idx}
                      className="aspect-2/3 rounded-2xl overflow-hidden bg-[#001D3D]/40 border border-white/10"
                      title={item?.title || ""}
                    >
                      {item?.cover ? (
                        <img
                          src={item.cover}
                          alt={item?.title || ""}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-blue-100/40 text-sm">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-38">
              <div className="h-44 w-full flex items-end gap-4">
                {chart.map((d) => (
                  <div
                    key={d.label}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="text-blue-100/70 text-xs">{d.value}</div>
                    <div
                      className="w-full rounded-t-sm bg-[#1F6FEB]/60"
                      style={{
                        height: `${Math.round((d.value / maxV) * 140)}px`,
                      }}
                    />
                    <div className="text-yellow-400 text-xs">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* MOBILE */}
      <div className="md:hidden">
        <MobileTopFilter value={mobileCategory} onChange={setMobileCategory} />

        <main className="px-4 pt-6 pb-28">
          <section className="flex items-center gap-4">
            {/* Photo */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden border border-white/10 bg-[#001D3D]/40 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-200">
                    {initials}
                  </span>
                </div>

                {/* Badge */}
                <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-[#0B2A52] border border-white/10 flex items-center justify-center">
                  <div className="h-5 w-5 rounded bg-yellow-400" />
                </div>
              </div>

              <button
                className="mt-3 h-6 px-2 rounded-md bg-[#001D3D]/60 border border-white/10 text-blue-200 text-sm"
                onClick={() => console.log("edit")}
              >
                Edit
              </button>
            </div>

            {/* Infos */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl  text-blue-200 font-semibold leading-tight">
                    {user?.username || "User"}
                  </h1>
                  <p className="text-blue-200/70 text-sm">
                    Joined on {new Date().toLocaleDateString()}
                  </p>
                </div>

                {/* Logout*/}
                <ButtonLogOut onClick={handleLogout} />
              </div>

              {/* stats */}
              <div className="mt-5 flex items-center gap-10">
                <div className="text-center">
                  <div className="text-lg font-semibold">{followers}</div>
                  <div className="text-blue-100/70 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{following}</div>
                  <div className="text-blue-100/70 text-sm">Following</div>
                </div>
              </div>
            </div>
          </section>
          {/* Mobile likes */}
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-yellow-400 font-semibold text-lg">
                Recent likes
              </h2>
              <button className="text-blue-100/70 text-sm">See all &gt;</button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              {(favoritesWithCover.length
                ? favoritesWithCover
                : [null, null, null]
              )
                .slice(0, 3)
                .map((item, idx) => (
                  <div
                    key={item?.id ?? idx}
                    className="aspect-[2/3] rounded-2xl overflow-hidden bg-[#001D3D]/40 border border-white/10"
                    title={item?.title || ""}
                  >
                    {item?.cover ? (
                      <img
                        src={item.cover}
                        alt={item?.title || ""}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-blue-100/40 text-xs">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Menu gauche + chart droite */}
            <section className="mt-10 grid grid-cols-[1fr_1.2fr] gap-6 items-end">
              <div className="space-y-3">
                {[
                  "Reviews",
                  "Statistics",
                  "Games",
                  "Movies",
                  "TV Shows",
                  "Books",
                ].map((label) => (
                  <button
                    key={label}
                    className="w-full h-10 px-3 rounded-md bg-[#001D3D]/60 border border-white/10 flex items-center justify-between text-blue-100/80"
                    onClick={() => console.log(label)}
                  >
                    <span className="text-sm">{label}</span>
                    <span className="text-blue-100/70">{">"}</span>
                  </button>
                ))}
              </div>

              <div className="pb-2">
                <div className="h-44 w-full flex items-end gap-4">
                  {chart.map((d) => (
                    <div
                      key={d.label}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div className="text-blue-100/80 text-xs mb-2">
                        {d.value}
                      </div>
                      <div
                        className="w-full rounded-t-sm bg-[#1F6FEB]/60"
                        style={{
                          height: `${Math.round((d.value / maxV) * 150)}px`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  {chart.map((d) => (
                    <div
                      key={d.label}
                      className="flex-1 text-center text-yellow-400"
                    >
                      {d.label}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </section>
        </main>

        <div className="fixed bottom-4 left-0 right-0 px-4">
          <MobileNavBarLoged />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
