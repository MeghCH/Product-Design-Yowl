import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/logo";
import { ButtonLog } from "../components/button_log";
import { SearchBar } from "../components/search_bar";
import { NavTabs } from "../components/nav-bar";
import MobileNavBar from "../components/mobile-nav-bar";
import MobileTopFilter from "../components/mobile-top-filter";
import { Link } from "react-router-dom";

export function HomePage() {
  const [active, setActive] = useState("Home");
  const [mobileFilter, setMobileFilter] = useState("Games");
  const navigate = useNavigate();

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

      <main className="hidden md:block pt-20 w-full max-w-2xl mx-auto p-4"></main>

      {/* MOBILE */}
      <div className="md:hidden">
        <MobileTopFilter value={mobileFilter} onChange={setMobileFilter} />

        <main className="px-4 pt-6 pb-28">
          <Section title={`New ${mobileFilter}`} />
          <div className="h-8" />
          <Section title="New Films" />
          <div className="h-8" />
          <Section title="New TV Shows" />
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

export default HomePage;
