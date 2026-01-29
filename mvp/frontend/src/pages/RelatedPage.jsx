import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Logo } from "../components/logo";
import { NavTabs } from "../components/nav-bar";
import { ButtonMsg } from "../components/button_message";
import { ButtonProfile } from "../components/button_profile";
import { SearchBar } from "../components/search_bar";
import NavTabsReview from "../components/nav_tab_review";

import fnacLogo from "../assets/fnac.png";
import amazonLogo from "../assets/amazon.png";

const API_BASE = "http://localhost:4000";

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

function Stars({ value = 0, size = "text-xl" }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`${size} ${i < v ? "text-yellow-400" : "text-slate-700"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function StarsUI({ value = 0, size = "text-3xl" }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div className="flex items-center gap-2">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`${size} ${
            i < v ? "text-yellow-400" : "text-blue-100/60"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function BadgeButton({ children }) {
  return (
    <button
      type="button"
      className="h-9 px-4 rounded-xl bg-[#0A2144]/70 border border-white/10 text-blue-100/90 text-xs font-semibold hover:border-yellow-400/40 hover:text-yellow-200 transition"
    >
      {children}
    </button>
  );
}

function BuyOn() {
  return (
    <div className="mt-6">
      <p className="text-sm font-bold text-blue-100/60 mb-3">Buy on :</p>

      <div className="flex items-center gap-3">
        <a
          href="https://www.fnac.com/"
          target="_blank"
          rel="noreferrer"
          className="h-14 w-14 rounded-xl bg-white grid place-items-center border border-white/10 shadow hover:brightness-110 transition"
          aria-label="Buy on Fnac"
          title="Fnac"
        >
          <img
            src={fnacLogo}
            alt="Fnac"
            className="h-9 w-9 object-contain"
            loading="lazy"
          />
        </a>

        <a
          href="https://www.amazon.com/"
          target="_blank"
          rel="noreferrer"
          className="h-14 w-14 rounded-xl bg-white grid place-items-center border border-white/10 shadow hover:brightness-110 transition"
          aria-label="Buy on Amazon"
          title="Amazon"
        >
          <img
            src={amazonLogo}
            alt="Amazon"
            className="h-9 w-9 object-contain"
            loading="lazy"
          />
        </a>
      </div>
    </div>
  );
}

/* ✅ RELATED CARD (same design vibe) */
function RelatedCard({ rel, cover, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-3xl border border-white/10 bg-[#001D3D]/25 hover:border-yellow-400/25 transition overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.35)]"
      title={rel?.title || rel?.name || "Related"}
    >
      <div className="w-[240px] md:w-[260px] aspect-[2/3] bg-[#000814]/35">
        {cover ? (
          <img
            src={cover}
            alt={rel?.title || rel?.name || "Related"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-blue-200/40 text-sm">
            No cover
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="font-black text-blue-50 line-clamp-1">
          {rel?.title || rel?.name || "Untitled"}
        </p>
        <p className="text-xs text-blue-100/55 mt-1 line-clamp-1">
          {rel?.subtitle || rel?.author || rel?.genre || ""}
        </p>
      </div>
    </button>
  );
}

export function RelatedPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Related");

  const [userRating] = useState(4);

  const imageIndex = useMemo(() => {
    return {
      games: makeIndex(gamesImgs),
      movies: makeIndex(moviesImgs),
      books: makeIndex(booksImgs),
      tv_shows: makeIndex(tvShowsImgs),
    };
  }, []);

  const resolvedImg = useMemo(() => {
    if (!item) return null;
    const pic = (item.picture || item.image_url || "").trim();
    if (!pic) return null;
    const idx = imageIndex[type];
    return idx?.[pic] ?? idx?.[pic.toLowerCase()] ?? null;
  }, [item, type, imageIndex]);

  const resolveCoverFor = (mediaType, mediaObj) => {
    const t = mediaType || type;
    const pic = (
      mediaObj?.picture ||
      mediaObj?.image_url ||
      mediaObj?.cover ||
      ""
    )
      .toString()
      .trim();
    if (!pic) return null;
    const idx = imageIndex[t];
    return idx?.[pic] ?? idx?.[pic.toLowerCase()] ?? null;
  };

  useEffect(() => {
    let cancelled = false;

    const candidatesByType = {
      games: ["jeu", "jeux", "Jeu_video", "Jeu_Video", "jeu_video", "games"],
      movies: ["film", "films", "Film", "movies"],
      tv_shows: ["serie", "series", "Serie", "tv_shows", "tvshows"],
      books: ["livre", "livres", "Livre", "books"],
    };

    async function load() {
      setLoading(true);
      setItem(null);
      setRelated([]);

      try {
        const candidates = candidatesByType[type] ?? [type];
        let foundItem = null;

        for (const apiType of candidates) {
          const res = await fetch(`${API_BASE}/media-details/${apiType}/${id}`);
          const data = await res.json();
          if (cancelled) return;

          if (data && !data.error) {
            foundItem = {
              ...data,
              id:
                data.id ||
                data.id_jeu ||
                data.id_film ||
                data.id_serie ||
                data.id_livre ||
                id,
            };
            break;
          }
        }

        if (!foundItem) {
          setItem(null);
          return;
        }

        setItem(foundItem);

        // ✅ RELATED fetch (same logic style as reviews: try multiple endpoints)
        let foundRelated = [];
        const relatedCandidates = [
          `${API_BASE}/related/${type}/${id}`,
          `${API_BASE}/media-related/${type}/${id}`,
          `${API_BASE}/same-universe/${type}/${id}`,
        ];

        for (const url of relatedCandidates) {
          try {
            const r = await fetch(url);
            if (!r.ok) continue;
            const json = await r.json();

            if (Array.isArray(json)) {
              foundRelated = json;
              break;
            }
            if (Array.isArray(json?.related)) {
              foundRelated = json.related;
              break;
            }
            if (Array.isArray(json?.items)) {
              foundRelated = json.items;
              break;
            }
          } catch {}
        }

        if (cancelled) return;
        setRelated(foundRelated);
      } catch (err) {
        console.error("Erreur Fetch:", err);
        if (!cancelled) {
          setItem(null);
          setRelated([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000814] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-yellow-500 font-bold animate-pulse">
          Consultation du Codex...
        </p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#000814] flex flex-col items-center justify-center text-white space-y-6 px-6">
        <h2 className="text-2xl font-black text-red-500">Media not found</h2>
        <p className="text-blue-100/55 text-center max-w-md">
          The ID {id} for category {type} does not exist in the database.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors font-bold"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000814] text-blue-100">
      {/*DESKTOP*/}
      <div className="hidden md:block">
        <div className="sticky top-0 z-50">
          <div className="bg-[#000814]/70 backdrop-blur-md border-b border-white/5">
            <header className="w-full flex justify-between items-center px-8 py-4">
              <Logo />

              <div className="flex items-center gap-6">
                <NavTabs />
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

        <main className="relative mx-auto max-w-7xl px-6 py-10">
          <section className="rounded-[28px] border border-white/10 bg-gradient-to-b from-[#001D3D]/70 to-[#000814]/70 shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
            <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
              <div className="flex justify-center lg:justify-start">
                <div className="w-[260px] md:w-[300px] aspect-[2/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#001D3D]/40">
                  {resolvedImg ? (
                    <img
                      src={resolvedImg}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-200/40 text-sm">
                      No cover
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-yellow-300">
                    {(type || "").replace("_", " ")}
                  </span>
                  <span className="h-px flex-1 bg-blue-200/30" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-4xl md:text-4xl font-black tracking-tight text-blue-200">
                    {item.title}
                  </h1>
                  <p className="text-blue-200 leading-relaxed max-w-3xl">
                    {item.description ||
                      item.synopsis ||
                      "No description available."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 items-start">
                  <div className="w-full">
                    <div className="w-[88px] h-[50px] rounded-md bg-[#0A2144]/70 border border-white/10 flex items-center justify-center shadow-inner">
                      <span className="text-blue-200 font-black text-md">
                        {item.avg_rating || "4.7"}
                        <span className="text-blue-100/50 text-md font-bold">
                          /5
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <BadgeButton>♡ Like</BadgeButton>
                    <BadgeButton>Watched</BadgeButton>
                    <BadgeButton>Watchlist</BadgeButton>
                    <BadgeButton>Recommend</BadgeButton>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-10">
                  <BuyOn />

                  <div className="text-right pt-6">
                    <p className="text-sm font-bold text-blue-100/60 mb-2">
                      Your rating :
                    </p>
                    <StarsUI value={userRating} size="text-3xl" />
                  </div>
                </div>

                <div className="pt-4">
                  <NavTabsReview active={activeTab} onChange={setActiveTab} />
                </div>
              </div>
            </div>
          </section>

          {/* ✅ HERE: RELATED instead of REVIEWS (same structure container spacing) */}
          <section className="mt-12">
            <h2 className="text-2xl font-black tracking-tight text-yellow-400">
              Same universe
            </h2>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-[#001D3D]/20 shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-6">
              {related.length > 0 ? (
                <div className="flex gap-6 overflow-x-auto pb-2 pr-2">
                  {related.map((rel) => {
                    const relType =
                      rel?.type || rel?.media_type || rel?.category || type;

                    const relId =
                      rel?.id ||
                      rel?.id_jeu ||
                      rel?.id_film ||
                      rel?.id_serie ||
                      rel?.id_livre;

                    const cover = resolveCoverFor(relType, rel);

                    return (
                      <RelatedCard
                        key={`${relType}-${relId ?? rel?.title ?? Math.random()}`}
                        rel={rel}
                        cover={cover}
                        onClick={() => {
                          if (!relId) return;
                          navigate(`/media/${relType}/${relId}`);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/15 bg-[#000814]/25 p-10 text-center">
                  <p className="text-blue-100/45 italic">
                    No related media found.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* MOBILE (simple, same vibe) */}
      <div className="md:hidden">
        <div className="sticky top-0 z-50 bg-[#000814]/80 backdrop-blur-md border-b border-white/5">
          <div className="px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="h-10 w-10 grid place-items-center text-blue-100/80"
              aria-label="Back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7"
              >
                <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
              </svg>
            </button>
            <p className="font-bold text-blue-100">Related</p>
            <div className="w-10" />
          </div>
        </div>

        <main className="px-4 py-6 space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#001D3D]/20 p-5">
            <p className="text-lg font-black text-yellow-400">Same universe</p>

            <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
              {related.length > 0 ? (
                related.map((rel) => {
                  const relType =
                    rel?.type || rel?.media_type || rel?.category || type;

                  const relId =
                    rel?.id ||
                    rel?.id_jeu ||
                    rel?.id_film ||
                    rel?.id_serie ||
                    rel?.id_livre;

                  const cover = resolveCoverFor(relType, rel);

                  return (
                    <RelatedCard
                      key={`${relType}-${relId ?? rel?.title ?? Math.random()}`}
                      rel={rel}
                      cover={cover}
                      onClick={() => {
                        if (!relId) return;
                        navigate(`/media/${relType}/${relId}`);
                      }}
                    />
                  );
                })
              ) : (
                <div className="w-full rounded-3xl border border-dashed border-white/15 bg-[#000814]/25 p-8 text-center">
                  <p className="text-blue-100/45 italic text-sm">
                    No related media found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RelatedPage;
