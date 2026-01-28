import { useState } from "react";
import { Logo } from "../components/logo";
import { ButtonLog } from "../components/button_log";
import { SearchBar } from "../components/search_bar";
import { NavTabs } from "../components/nav-bar";

import MobileNavBar from "../components/mobile-nav-bar";
import MobileTopFilter from "../components/mobile-top-filter";

export function HomePage() {
  const [active, setActive] = useState("Home");
  const [mobileFilter, setMobileFilter] = useState("Vidéo_game");

  const categories = ["Vidéo_game", "Film", "Serie", "Book"];

  return (
    <div className="relative min-h-screen bg-[#000814]">
      {/* HEADER DESKTOP */}
      <div className="fixed inset-x-0 top-0 z-40 bg-transparent hidden md:block">
        <header className="w-full flex justify-between items-center px-8 py-4">
          <Logo />

          <div className="flex items-center gap-6">
            <NavTabs active={active} onChange={setActive} />
            <SearchBar />
          </div>

          <div className="flex items-center gap-3">
            <ButtonLog />
          </div>
        </header>
      </div>

      {/* Ordi */}
      <main className="hidden md:block pt-20 w-full max-w-7xl mx-auto p-4 space-y-20">
        {categories.map((category) => (
          <section key={category} className={`space-y-6 ${category === "Vidéo_game" ? "mt-32" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-yellow-400">
                  New {category.replace('_', ' ')}s
                </h2>
              </div>
              <button
                className="text-blue-100/80 text-sm"
                onClick={() => window.location.hash = `#/category/${category}`}
              >
                See all {'>'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="group cursor-pointer flex flex-col space-y-4">
                  <div className="relative aspect-[2/3] bg-[#001D3D]/40 rounded-2xl overflow-hidden border border-white/5 group-hover:border-yellow-500/50 transition-all duration-300 shadow-xl">
                    <div className="w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center">
                      <span className="text-gray-600 text-sm">Placeholder</span>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">
                        Voir l'avis
                      </span>
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className="font-bold text-sm line-clamp-1 group-hover:text-yellow-500 transition-colors">
                      Placeholder Title {i}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {category.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* MOBILE */}
      <div className="md:hidden">
        <MobileTopFilter value={mobileFilter} onChange={setMobileFilter} />

        <main className="px-4 pt-6 pb-28 space-y-8">
          {categories.map((category) => (
            <Section key={category} title={`New ${category.replace('_', ' ')}s`} category={category} />
          ))}
        </main>

        <MobileNavBar
          active="Home"
          onHome={() => (window.location.hash = "#/")}
          onSearch={() => console.log("open search")}
          onLogin={() => (window.location.hash = "#/login")}
        />
      </div>
    </div>
  );
}

function Section({ title, category }) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-yellow-400 font-semibold">{title}</h2>
        <button
          className="text-blue-100/80 text-sm"
          onClick={() => window.location.hash = `#/category/${encodeURIComponent(category)}`}
        >
          See all &gt;
        </button>
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

export default HomePage;
