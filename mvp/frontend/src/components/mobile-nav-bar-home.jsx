import { ButtonMsg } from "./button_message";
import { SearchBar } from "./search_bar";

export function MobileNavBarHome({
  active = "Profile",
  onHome,
  onSearch,
  onProfile,
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onHome}
            className={`
              flex-1 h-12 rounded-2xl
              bg-[#001D3D]/80
              backdrop-blur-md
              border border-blue-200/20
              transition-colors
            `}
          >
            Home
          </button>

          <SearchBar
            onClick={onSearch}
            className="
              flex-[1.2] h-12 rounded-2xl
              bg-[#001D3D]/80
              backdrop-blur-md
              border border-blue-200/20
              text-blue-100
              flex items-center justify-center gap-2
            "
          ></SearchBar>

          <button
            onClick={onProfile}
            className={`
              flex-1 h-12 rounded-2xl
              bg-[#001D3D]/80
              backdrop-blur-md
              border border-blue-200/20
              transition-colors
              ${active === "Profile"}
            `}
          >
            Profile
          </button>

          <ButtonMsg
            onClick={onHome}
            className="
              border border-blue-200/20
            "
          ></ButtonMsg>
        </div>
      </div>
    </div>
  );
}

export default MobileNavBarHome;
