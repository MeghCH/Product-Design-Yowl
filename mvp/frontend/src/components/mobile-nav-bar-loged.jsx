import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ButtonMsg } from "./button_message";
import { SearchBar } from "./search_bar";

export function MobileNavBarLoged({
  active: activeProp,
  onHome,
  onSearch,
  onMsg,

  homePath = "/home/log",
  searchPath = "/search",
  msgPath = "/messages",
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const active = useMemo(() => {
    if (activeProp) return activeProp;
    const p = location.pathname;

    if (p === "/" || p.startsWith(homePath)) return "Home";
    if (p.startsWith(searchPath)) return "Search";
    if (p.startsWith(msgPath)) return "Msg";
    return "Home";
  }, [activeProp, location.pathname, homePath, searchPath, msgPath]);

  const handleHome = onHome ?? (() => navigate(homePath));
  const handleSearch = onSearch ?? (() => navigate(searchPath));
  const handleMsg = onMsg ?? (() => navigate(msgPath));

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleHome}
            className={`
              flex-1 h-12 rounded-2xl
              bg-[#001D3D]/80
              backdrop-blur-md
              border border-blue-200/20
              transition-colors
              ${
                active === "Home"
                  ? "bg-[#001D3D] text-blue-200"
                  : "bg-[#000814]/60 text-blue-200"
              }
            `}
          >
            Home
          </button>

          <SearchBar
            onClick={handleSearch}
            className="
              flex-[1.2] h-12 rounded-2xl
              bg-[#001D3D]/80
              backdrop-blur-md
              border border-blue-200/20
              text-blue-100
              flex items-center justify-center gap-2
            "
          />

          <ButtonMsg
            onClick={handleMsg}
            className="
              border border-blue-200/20
            "
          />
        </div>
      </div>
    </div>
  );
}

export default MobileNavBarLoged;
