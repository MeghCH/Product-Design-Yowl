import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Logo } from "../components/logo";
import { NavTabs } from "../components/nav-bar";
import { SearchBar } from "../components/search_bar";
import { NavTabsProfils } from "../components/nav-barre-profile";
import { ButtonMsg } from "../components/button_message";
import { ButtonProfile } from "../components/button_profile";
import ButtonLogOut from "../components/button_logout";

export function ProfilePage() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTop, setActiveTop] = useState("Home");
  const navigate = useNavigate();
  const [activeProfileTab, setActiveProfileTab] = useState("Activity");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    Promise.all([
      fetch(`http://localhost:4000/user/${userId}`).then((res) => res.json()),
      fetch(`http://localhost:4000/user/${userId}/favorites`)
        .then((res) => res.json())
        .catch(() => []),
      fetch(`http://localhost:4000/user/${userId}/comments`)
        .then((res) => res.json())
        .catch(() => []),
    ])
      .then(([userData, favData, commentData]) => {
        setUser(userData);
        setFavorites(Array.isArray(favData) ? favData : []);
        setComments(Array.isArray(commentData) ? commentData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement:", err);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000814] text-blue-100 flex items-center justify-center">
        Chargement du Codex...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000814] text-blue-100">
      {/* Header */}
      <div className="sticky top-0 z-50">
        <div className="bg-[#000814]/70 backdrop-blur-md border-b border-white/5">
          <header className="w-full flex justify-between items-center px-8 py-4">
            <Logo />

            <div className="flex items-center gap-6">
              <NavTabs active={activeTop} onChange={setActiveTop} />
              <SearchBar />
            </div>

            <div className="flex items-center gap-3">
              {/* petit rond (notif / icone) comme sur la maquette */}
              <ButtonMsg type="button" aria-label="Quick action" />
              <ButtonProfile type="button" aria-label="Profile">
                Profile
              </ButtonProfile>
            </div>
          </header>
        </div>
      </div>

      {/* Page */}
      <main className="max-w-6xl mx-auto px-8 py-10 space-y-10">
        {/* Bloc profil centré (avatar + infos + stats + logout) */}
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Avatar rond */}
            <div className="relative">
              <div className="h-45 w-45 rounded-full bg-linear-to-br from-blue-300/40 to-blue-100/10 border border-white/10 flex items-center justify-center overflow-hidden">
                <span className="text-4xl font-bold text-blue-50">
                  {initials}
                </span>
              </div>

              {/* badge */}
              <button
                type="button"
                className="absolute top-1 right-1 h-10 w-10 rounded-full bg-yellow-400 text-blue-900 font-bold flex items-center justify-center shadow-lg"
                aria-label="Edit"
                onClick={() => console.log("edit")}
              >
                ✎
              </button>

              {/* Edit */}
              <button
                type="button"
                className="absolute
    top-full
    left-1/2
    -translate-x-1/2
    mt-3
    h-9 px-4
    rounded-xl
    bg-[#001D3D]/70
    border border-white/10
    text-blue-100 text-sm
    shadow-md"
                onClick={() => console.log("edit")}
              >
                Edit
              </button>
            </div>

            {/* Infos user + stats */}
            <div className="flex items-center gap-10">
              <div>
                <h1 className="text-2xl font-semibold leading-tight">
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

          {/* Bouton logout */}
          <ButtonLogOut onClick={handleLogout} />
        </section>

        {/* Tabs profil */}
        <div className="flex justify-center">
          <div>
            <NavTabsProfils
              active={activeProfileTab}
              onChange={setActiveProfileTab}
            />
          </div>
        </div>

        {/* Recent likes */}
        <section className="grid grid-cols-[1fr_220px] gap-10 items-start">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-yellow-400 font-semibold">Recent likes</h2>
              <button className="text-blue-100/70 text-sm hover:text-blue-100">
                See all &gt;
              </button>
            </div>

            {/* cards */}
            <div className="grid grid-cols-4 gap-6">
              {(favorites.length ? favorites : [1, 2, 3, 4])
                .slice(0, 4)
                .map((item, idx) => (
                  <div
                    key={item?.id ?? idx}
                    className="aspect-2/3 rounded-2xl overflow-hidden bg-[#001D3D]/40 border border-white/10"
                  >
                    {/* api envoi d'image */}
                    {item?.image ? (
                      <img
                        src={item.image}
                        alt=""
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
                    className="w-full rounded-t-md bg-[#1F6FEB]/60"
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
  );
}

export default ProfilePage;
