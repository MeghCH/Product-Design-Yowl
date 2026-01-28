import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Logo } from "../components/logo";
import { ButtonLog } from "../components/button_log";
import { SearchBar } from "../components/search_bar";
import { NavTabs } from "../components/nav-bar";
import MobileNavBar from "../components/mobile-nav-bar";
import MobileTopFilter from "../components/mobile-top-filter";

const API_BASE = "http://localhost:4000";

// ✅ Globs: indexe toutes les images dans src/assets
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
    if (filename) index[filename] = url;
  }
  return index;
}

function HomeSection({ title, seeAllTo, items }) {
  const filled = [
    ...items,
    ...Array.from({ length: Math.max(0, 5 - items.length) }, () => null),
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
          <h2 className="text-yellow-400 font-black uppercase tracking-tighter">
            {title}
          </h2>
        </div>

        <Link
          to={seeAllTo}
          className="text-blue-100/80 text-sm hover:text-blue-100"
        >
          See all &gt;
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-8">
        {filled.map((item, idx) =>
          item ? (
            <div key={item.id ?? idx} className="group cursor-pointer">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#001D3D]/40 border border-white/5 shadow-xl group-hover:border-yellow-500/50 transition-all duration-300">
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-600 text-sm">No image</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">
                    Voir l&apos;avis
                  </span>
                </div>
              </div>

              <div className="mt-3 px-1">
                <h3 className="font-bold text-sm line-clamp-1 group-hover:text-yellow-500 transition-colors text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          ) : (
            <div
              key={`ph-${idx}`}
              className="aspect-[2/3] rounded-2xl bg-[#001D3D]/40 border border-white/5"
            />
          ),
        )}
      </div>
    </section>
  );
}

function Section({ title }) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-yellow-400 font-semibold">{title}</h2>
        <button className="text-blue-100/80 text-sm">See all &gt;</button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-[2/3] rounded-2xl bg-[#001D3D]/40 border border-white/5"
          />
        ))}
      </div>
    </section>
  );
}

export function HomePage() {
  const [active, setActive] = useState("Home");
  const [mobileFilter, setMobileFilter] = useState("Games");
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [books, setBooks] = useState([]); // ✅

  const imageIndex = useMemo(() => {
    return {
      games: makeIndex(gamesImgs),
      movies: makeIndex(moviesImgs),
      books: makeIndex(booksImgs),
      tv_shows: makeIndex(tvShowsImgs),
    };
  }, []);

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_BASE}/api/home`);
      const data = await res.json();

      console.log("API /api/home:", data);

      setGames(Array.isArray(data.games) ? data.games : []);
      setMovies(Array.isArray(data.movies) ? data.movies : []);
      setTvShows(Array.isArray(data.tvShows) ? data.tvShows : []);
      setBooks(Array.isArray(data.books) ? data.books : []);
    }

    load().catch(console.error);
  }, []);

  const gamesItems = games.map((x) => ({
    id: x.id,
    title: x.title,
    img: imageIndex.games?.[x.picture] ?? null,
  }));

  const moviesItems = movies.map((x) => ({
    id: x.id,
    title: x.title,
    img: imageIndex.movies?.[x.picture] ?? null,
  }));

  const tvShowItems = tvShows.map((x) => ({
    id: x.id,
    title: x.title,
    img: imageIndex.tv_shows?.[x.picture] ?? null,
  }));

  const booksItems = books.map((x) => ({
    id: x.id,
    title: x.title,
    img: imageIndex.books?.[x.picture] ?? null,
  }));

  return (
    <div className="relative min-h-screen bg-[#000814]">
      {/* HEADER DESKTOP */}
      <div className="fixed inset-x-0 top-0 z-40 bg-transparent hidden md:block">
        <header className="w-full flex justify-between items-center px-8 py-4">
          <Link to="/" className="cursor-pointer">
            <Logo />
          </Link>

          <div className="flex items-center gap-6">
            <NavTabs active={active} onChange={setActive} />
            <SearchBar />
          </div>

          <div className="flex items-center gap-3">
            <ButtonLog />
          </div>
        </header>
      </div>

      {/* DESKTOP */}
      <main className="hidden md:block pt-20 w-full max-w-7xl mx-auto px-8 pb-16">
        <div className="pt-14 space-y-14">
          <HomeSection
            title="New Games"
            seeAllTo="/category/games"
            items={gamesItems}
          />

          <HomeSection
            title="New Films"
            seeAllTo="/category/movies"
            items={moviesItems}
          />

          <HomeSection
            title="New TV Shows"
            seeAllTo="/category/tv_shows"
            items={tvShowItems}
          />

          <HomeSection
            title="New Books"
            seeAllTo="/category/books"
            items={booksItems}
          />
        </div>
      </main>

      {/* MOBILE */}
      <div className="md:hidden">
        <MobileTopFilter value={mobileFilter} onChange={setMobileFilter} />

        <main className="px-4 pt-6 pb-28">
          <Section title={`New ${mobileFilter}`} />
          <div className="h-8" />
          <Section title="New Films" />
          <div className="h-8" />
          <Section title="New TV Shows" />
          <div className="h-8" />
          <Section title="New Books" />
        </main>

        <MobileNavBar
          active="Home"
          onHome={() => navigate("/")}
          onSearch={() => console.log("open search")}
          onLogin={() => navigate("/login")}
        />
      </div>
    </div>
  );
}

export default HomePage;
