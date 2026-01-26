import { useState } from "react";

import { Logo } from "../components/logo";
import { ButtonLog } from "../components/button_log";
import { SearchBar } from "../components/search_bar";
import { NavTabs } from "../components/nav-bar";

export function HomePage() {
  const [active, setActive] = useState("Home");

  return (
    <div className="relative">
      <div className="fixed inset-x-0 top-0 z-40 bg-transparent">
        <header className="w-full max-w-6xl mx-auto flex justify-between items-center p-4">
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

      <main className="pt-20 w-full max-w-2xl mx-auto p-4"></main>
    </div>
  );
}
