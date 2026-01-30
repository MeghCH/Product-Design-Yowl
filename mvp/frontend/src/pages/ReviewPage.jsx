import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Logo } from "../components/logo";
import { NavTabs } from "../components/nav-bar";
import { ButtonMsg } from "../components/button_message";
import { ButtonProfile } from "../components/button_profile";
import { SearchBar } from "../components/search_bar";
import NavTabsReview from "../components/nav_tab_review";
import API_BASE from "../config";

import fnacLogo from "../assets/fnac.png";
import amazonLogo from "../assets/amazon.png";

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

function ClickableStars({ value = 0, onChange, size = "text-3xl" }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div className="flex items-center gap-2">
      {[...Array(5)].map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className={`${size} cursor-pointer transition hover:scale-110 ${
            i < v ? "text-yellow-400" : "text-blue-100/60"
          }`}
          title={`Rate ${i + 1} star${i !== 0 ? "s" : ""}`}
        >
          ★
        </button>
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

/*  MOBILE */
function MobileReviewHeader({ title = "Reviews", onBack, count = 0 }) {
  return (
    <div className="sticky top-0 z-50 bg-[#000814]/80 backdrop-blur-md border-b border-white/5">
      <div className="px-4 pt-[calc(env(safe-area-inset-top)+48px)] pb-3">
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={onBack}
            className="absolute left-0 h-10 w-10 grid place-items-center text-blue-100/80"
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

          <h1 className="text-xl font-semibold text-blue-100">{title}</h1>
        </div>

        <div className="mt-3 flex items-center justify-center">
          <p className="text-[11px] text-blue-100/55 font-semibold">
            {count} Reviews
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileReviewCard({ rev }) {
  const initial = rev?.username ? rev.username[0].toUpperCase() : "?";
  const date = rev?.created_at
    ? new Date(rev.created_at).toLocaleDateString()
    : "";

  return (
    <div className="px-4">
      <div className="rounded-3xl border border-white/10 bg-[#001D3D]/20 p-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[#0A2144]/70 border border-white/10 grid place-items-center font-bold text-blue-50">
            {initial}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Stars value={rev?.rating || 0} size="text-lg" />
                <button
                  type="button"
                  className="text-blue-100/60 hover:text-yellow-300 transition"
                  aria-label="Like"
                >
                  ♡
                </button>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-blue-100/45 font-bold">
                  Watched on
                </p>
                <p className="text-[10px] text-blue-100/65 font-bold">{date}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[12px] leading-relaxed text-blue-100/70">
          {rev?.comment}
        </p>
      </div>
    </div>
  );
}

export function ReviewPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Reviews");

  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

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

    const typeToImageKey = {
      jeu: "games",
      film: "movies",
      serie: "tv_shows",
      livre: "books",
    };

    const imageKey = typeToImageKey[type] || type;
    const idx = imageIndex[imageKey];
    return idx?.[pic] ?? idx?.[pic.toLowerCase()] ?? null;
  }, [item, type, imageIndex]);

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
      setReviews([]);

      try {
        const typeMap = {
          jeu: "jeu",
          film: "film",
          serie: "serie",
          livre: "livre",
        };

        const apiType = typeMap[type] || type;
        const res = await fetch(`${API_BASE}/media-details/${apiType}/${id}`);
        const data = await res.json();
        if (cancelled) return;

        if (data && !data.error) {
          const foundItem = {
            ...data,
            id:
              data.id ||
              data.id_jeu ||
              data.id_film ||
              data.id_serie ||
              data.id_livre ||
              id,
          };
          setItem(foundItem);
        } else {
          setItem(null);
        }

        let foundReviews = [];
        const reviewCandidates = [
          `${API_BASE}/reviews/${type}/${id}`,
          `${API_BASE}/media-reviews/${type}/${id}`,
        ];

        for (const url of reviewCandidates) {
          try {
            const r = await fetch(url);
            if (!r.ok) continue;
            const json = await r.json();

            if (Array.isArray(json)) {
              foundReviews = json;
              break;
            }
            if (Array.isArray(json?.reviews)) {
              foundReviews = json.reviews;
              break;
            }
          } catch {}
        }

        if (cancelled) return;
        setReviews(foundReviews);
      } catch (err) {
        console.error("Erreur Fetch:", err);
        if (!cancelled) {
          setItem(null);
          setReviews([]);
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

  const handlePostReview = async () => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (!token) {
      navigate("/login");
      return;
    }

    if (!userRating || !userComment.trim()) {
      alert("Please add a rating and comment");
      return;
    }

    const typeToBackend = {
      jeu: "jeu",
      film: "film",
      serie: "serie",
      livre: "livre",
      games: "jeu",
      movies: "film",
      tv_shows: "serie",
      books: "livre",
    };
    const backendMediaType = typeToBackend[type] || type;

    setIsPosting(true);
    try {
      console.log("Posting review to:", `${API_BASE}/reviews`);
      console.log("Headers:", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });
      console.log("Body:", {
        mediaType: backendMediaType,
        mediaId: id,
        rating: userRating,
      });

      const response = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mediaType: backendMediaType,
          mediaId: id,
          rating: userRating,
          comment: userComment,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        throw new Error(
          `Server error: ${responseData.msg || response.statusText}`,
        );
      }

      const newReview = responseData;

      setReviews([newReview, ...reviews]);
      setUserComment("");
      alert("Review posted successfully!");
    } catch (err) {
      console.error("Error posting review:", err);
      alert("Error posting review: " + err.message);
    } finally {
      setIsPosting(false);
    }
  };

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

  const typeToEnglish = {
    jeu: "Game",
    film: "Movie",
    serie: "TV Show",
    livre: "Book",
    games: "Game",
    movies: "Movie",
    tv_shows: "TV Show",
    books: "Book",
  };

  return (
    <div className="min-h-screen bg-[#000814] text-blue-200">
      {/* DESKTOP*/}
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
          <section className="rounded-[28px] border border-white/10 bg-linear-to-b from-[#001D3D]/70 to-[#000814]/70 shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
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
                    {typeToEnglish[type] ??
                      String(type || "").replaceAll("_", " ")}
                  </span>

                  <span className="h-px flex-1 bg-blue-200/30" />
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-4xl font-black tracking-tight text-blue-200">
                    {item.title}
                  </h1>
                  <div>
                    <p className="text-sm font-bold text-blue-100/60 mb-2">
                      Summary
                    </p>
                    <p className="text-blue-200 leading-relaxed">
                      {item.description ||
                        item.synopsis ||
                        "No description available."}
                    </p>
                  </div>
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

          <section className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            <div className="rounded-[28px] border border-white/10 bg-[#001D3D]/35 shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-blue-50">
                    Reviews
                  </h2>
                  <p className="text-xs text-blue-200 mt-1 font-semibold">
                    {reviews.length} reviews
                  </p>
                </div>
                <div className="h-px flex-1 bg-white/10 mx-6 mb-3 hidden md:block" />
              </div>

              <div className="mt-6 space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-3xl border border-white/10 bg-[#000814]/35 p-6 hover:border-yellow-400/25 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-2xl bg-blue-600/80 border border-white/10 grid place-items-center font-black">
                          {rev.username ? rev.username[0].toUpperCase() : "?"}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-bold text-blue-200">
                              {rev.username || "Anonymous"}
                            </p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-blue-100/40">
                              {rev.created_at
                                ? new Date(rev.created_at).toLocaleDateString()
                                : ""}
                            </p>
                          </div>

                          <div className="mt-2 flex items-center gap-3">
                            <Stars value={rev.rating || 0} size="text-lg" />
                            <button
                              type="button"
                              className="text-blue-100/40 hover:text-yellow-300 transition"
                              title="Like"
                            >
                              ♡
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 text-blue-100/75 leading-relaxed italic">
                        “{rev.comment}”
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/15 bg-[#000814]/25 p-10 text-center">
                    <p className="text-blue-100/45 italic">
                      No reviews have been posted yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <aside className="rounded-[28px] border border-white/10 bg-[#001D3D]/35 shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-8 h-fit">
              <h3 className="text-lg font-black text-blue-200">Add a review</h3>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-[#000814]/35 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-blue-100/40 mb-3">
                    Your rating
                  </p>
                  <ClickableStars
                    value={userRating}
                    onChange={setUserRating}
                    size="text-2xl"
                  />
                </div>

                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Write here..."
                  className="w-full min-h-[120px] rounded-2xl border border-white/10 bg-[#000814]/35 px-4 py-3 text-sm text-blue-200 placeholder:text-blue-100/35 focus:outline-none focus:ring-2 focus:ring-blue-800"
                />

                <button
                  type="button"
                  onClick={handlePostReview}
                  disabled={
                    !isLoggedIn ||
                    isPosting ||
                    !userRating ||
                    !userComment.trim()
                  }
                  className="w-full h-11 rounded-2xl bg-yellow-400 text-[#001D3D] font-black uppercase tracking-widest text-xs hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!isLoggedIn
                    ? "Login to Review"
                    : isPosting
                      ? "Sending..."
                      : "Send"}
                </button>
              </div>
            </aside>
          </section>
        </main>
      </div>

      {/*  MOBILE  */}
      <div className="md:hidden">
        <MobileReviewHeader
          title="Reviews"
          count={reviews.length}
          onBack={() => navigate(-1)}
        />

        <main className="pt-4 pb-52 space-y-4">
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <MobileReviewCard key={rev.id} rev={rev} />
              ))}
            </div>
          ) : (
            <div className="px-4">
              <div className="rounded-3xl border border-dashed border-white/15 bg-[#001D3D]/15 p-8 text-center">
                <p className="text-blue-100/55 italic text-sm">
                  No reviews have been posted yet.
                </p>
              </div>
            </div>
          )}
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-linear-to-t from-[#000814] to-transparent" />

          <div className="rounded-[20px] border border-white/10 bg-[#001D3D]/35 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.55)] p-5">
            <h3 className="text-sm font-bold text-blue-200">Add a review</h3>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-[#0A2144]/50 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-blue-100/40 mb-2">
                  Your rating
                </p>
                <ClickableStars
                  value={userRating}
                  onChange={setUserRating}
                  size="text-2xl"
                />
              </div>

              <textarea
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                placeholder="Write here..."
                className="w-full min-h-[110px] rounded-2xl border border-white/10 bg-[#0A2144]/50 px-4 py-3 text-sm text-blue-200 placeholder:text-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-800"
              />

              <button
                type="button"
                onClick={handlePostReview}
                disabled={
                  !isLoggedIn || isPosting || !userRating || !userComment.trim()
                }
                className="w-24 h-10 rounded-md bg-yellow-400 text-[#001D3D] font-black text-xs uppercase tracking-widest hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isLoggedIn ? "Login" : isPosting ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
