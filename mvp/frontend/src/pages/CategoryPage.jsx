import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Logo } from "../components/logo";
import { ButtonMsg } from "../components/button_message";
import { SearchBar } from "../components/search_bar";
import { NavTabs } from "../components/nav-bar";
import { ButtonProfile } from "../components/button_profile";
import MobileNavBar from "../components/mobile-nav-bar";
import MobileNavBarHome from "../components/mobile-nav-bar-home";
import MobileTopFilter from "../components/mobile-top-filter";
import { ButtonLog } from "../components/button_log";
import API_BASE from "../config";

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
    index[filename.toLowerCase()] = url;
  }
  return index;
}

const categoryToApiType = {
  games: "Jeu_video",
  movies: "Film",
  books: "Livre",
  tv_shows: "Serie",
};

const categoryToReviewType = {
  games: "game",
  movies: "movie",
  books: "book",
  tv_shows: "TV shows",
};

export function CategoryPage() {
  const navigate = useNavigate();
  const { category } = useParams();

  const safeCategory = (category || "games").toLowerCase().replaceAll("-", "_");
  const categoryDisplayName = safeCategory.replaceAll("_", " ");

  const [active, setActive] = useState("Home");
  const [mobileFilter, setMobileFilter] = useState(safeCategory);
  const [items, setItems] = useState([]);

  const isLoggedIn = !!localStorage.getItem("userId");

  useEffect(() => {
    setMobileFilter(safeCategory);
  }, [safeCategory]);

  const imageIndexByCategory = useMemo(() => {
    return {
      games: makeIndex(gamesImgs),
      movies: makeIndex(moviesImgs),
      books: makeIndex(booksImgs),
      tv_shows: makeIndex(tvShowsImgs),
    };
  }, []);

  useEffect(() => {
    async function load() {
      const apiType = categoryToApiType[safeCategory];
      if (!apiType) {
        setItems([]);
        return;
      }

      const res = await fetch(`${API_BASE}/media/${apiType}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    }

    load().catch(console.error);
  }, [safeCategory]);

  const displayItems = useMemo(() => {
    const idx = imageIndexByCategory[safeCategory] || {};
    return items.map((x) => {
      const pic = (x.picture || "").toString();
      return {
        id: x.id,
        title: x.title,
        img: idx[pic] ?? idx[pic.toLowerCase()] ?? null,
      };
    });
  }, [items, imageIndexByCategory, safeCategory]);

  const filledDesktop = useMemo(() => {
    return [
      ...displayItems,
      ...Array.from(
        { length: Math.max(0, 20 - displayItems.length) },
        () => null,
      ),
    ];
  }, [displayItems]);

  const filledMobile = useMemo(() => {
    return [
      ...displayItems,
      ...Array.from(
        { length: Math.max(0, 12 - displayItems.length) },
        () => null,
      ),
    ];
  }, [displayItems]);

  return (
    <div className="relative min-h-screen bg-[#000814]">
      {/* HEADER DESKTOP */}
      <div className="fixed inset-x-0 top-0 z-40 bg-transparent hidden md:block">
        <header className="w-full flex justify-between items-center px-8 py-4">
          <button
            type="button"
            onClick={() => navigate(isLoggedIn ? "/home/log" : "/")}
            className="cursor-pointer"
            aria-label="Retour à l'accueil"
          >
            <Logo />
          </button>

          <div className="flex items-center gap-6">
            <NavTabs active={active} onChange={setActive} />
            <SearchBar />
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <ButtonMsg type="button" aria-label="Messages" />
                <ButtonProfile type="button" aria-label="Profile">
                  Profile
                </ButtonProfile>
              </>
            ) : (
              <ButtonLog
                type="button"
                aria-label="Login"
                onClick={() => navigate("/login")}
              >
                Login
              </ButtonLog>
            )}
          </div>
        </header>
      </div>

      {/* DESKTOP */}
      <main className="hidden md:block pt-20 w-full max-w-7xl mx-auto p-4 space-y-20">
        <section className="space-y-6 mt-32">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-yellow-400">
              New {categoryDisplayName}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {filledDesktop.map((item, i) =>
              item ? (
                <div
                  key={item.id ?? i}
                  className="group cursor-pointer flex flex-col space-y-4"
                  onClick={() =>
                    navigate(
                      `/review/${categoryToReviewType[safeCategory]}/${item.id}`,
                    )
                  }
                >
                  <div className="relative aspect-[2/3] bg-[#001D3D]/40 rounded-2xl overflow-hidden border border-white/5 group-hover:border-yellow-500/50 transition-all duration-300 shadow-xl">
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center">
                        <span className="text-gray-600 text-sm">No image</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">
                        View the review
                      </span>
                    </div>
                  </div>

                  <div className="px-1">
                    <h3 className="font-bold text-sm line-clamp-1 group-hover:text-yellow-500 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ) : (
                <div
                  key={`ph-${i}`}
                  className="group cursor-pointer flex flex-col space-y-4"
                >
                  <div className="relative aspect-[2/3] bg-[#001D3D]/40 rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                    <div className="w-full h-full bg-grey-800 rounded-2xl flex items-center justify-center"></div>
                  </div>

                  <div className="px-1">
                    <h3 className="font-bold text-sm line-clamp-1 text-blue-200"></h3>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      </main>

      {/* MOBILE  */}
      <div className="md:hidden min-h-screen bg-[#000814] pt-[calc(env(safe-area-inset-top)+32px)]">
        <MobileTopFilter value={mobileFilter} onChange={setMobileFilter} />

        <main className="px-4 pt-6 pb-[calc(112px+env(safe-area-inset-bottom))] space-y-8">
          <Section
            title={`New ${categoryDisplayName}`}
            items={filledMobile}
            onItemClick={(id) =>
              navigate(`/review/${categoryToReviewType[safeCategory]}/${id}`)
            }
          />
        </main>

        {isLoggedIn ? (
          <MobileNavBarHome
            active="Home"
            onHome={() => navigate("/home/log")}
            onSearch={() => console.log("open search")}
            onProfile={() => navigate("/profile")}
            onMessage={() => navigate("/messages")}
          />
        ) : (
          <MobileNavBar
            active="Home"
            onHome={() => navigate("/")}
            onSearch={() => console.log("open search")}
            onLogin={() => navigate("/login")}
          />
        )}
      </div>
    </div>
  );
}

function Section({ title, items = [], onItemClick }) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-yellow-400 font-semibold">{title}</h2>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {items.map((item, i) =>
          item ? (
            <div
              key={item.id ?? i}
              className="aspect-[2/3] rounded-2xl overflow-hidden bg-[#001D3D]/40 border border-white/5 cursor-pointer"
              onClick={() => onItemClick && onItemClick(item.id)}
            >
              {item.img ? (
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-100/35 text-xs">
                  No image
                </div>
              )}
            </div>
          ) : (
            <div
              key={`m-ph-${i}`}
              className="aspect-[2/3] rounded-2xl bg-[#001D3D]/40 border border-white/5"
            />
          ),
        )}
      </div>
    </section>
  );
}

export default CategoryPage;
