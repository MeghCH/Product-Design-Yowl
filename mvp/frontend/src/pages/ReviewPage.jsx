import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Logo } from "../components/logo";
import { NavTabs } from "../components/nav-bar";
import { ButtonLog } from "../components/button_log";

export function ReviewPage() {
  const { type, id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/media-details/${type}/${id}`,
        );
        const itemData = await res.json();

        console.log("Données brutes reçues :", itemData);

        if (itemData && !itemData.error) {
          // On s'assure que l'objet a une propriété 'id' peu importe le nom en DB
          const normalizedItem = {
            ...itemData,
            id:
              itemData.id ||
              itemData.id_jeu ||
              itemData.id_film ||
              itemData.id_serie ||
              itemData.id_livre,
          };
          setItem(normalizedItem);
        } else {
          setItem(null);
        }
      } catch (err) {
        console.error("Erreur Fetch:", err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-yellow-500 font-bold animate-pulse">
          Consultation du Codex...
        </p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white space-y-6">
        <h2 className="text-2xl font-bold text-red-500">Média introuvable</h2>
        <p className="text-gray-400 text-center max-w-md">
          L'ID {id} pour la catégorie {type} n'existe pas dans la base de
          données.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/90 backdrop-blur-md sticky top-0 z-50">
        <Logo />
        <NavTabs />
        <ButtonLog />
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-12">
        {/* 1. SECTION PRÉSENTATION (Image + Infos) */}
        <section className="flex flex-col md:flex-row gap-10 bg-gray-800/30 p-8 rounded-[2rem] border border-gray-700/50 shadow-2xl relative overflow-hidden">
          {/* Image avec la même logique que la Home */}
          <div className="w-full md:w-72 h-[28rem] flex-shrink-0 rounded-2xl overflow-hidden border border-gray-600 shadow-2xl">
            <img
              src={
                new URL(
                  `../assets/${item.picture || item.image_url}`,
                  import.meta.url,
                ).href
              }
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x450?text=Image+Non+Trouvée";
              }}
            />
          </div>

          <div className="flex-1 flex flex-col justify-between py-4">
            <div className="space-y-4">
              <span className="inline-block text-yellow-500 text-xs font-black uppercase tracking-[0.2em] bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20">
                {type.replace("_", " ")}
              </span>
              <h1 className="text-6xl font-black tracking-tighter leading-none">
                {item.title}
              </h1>
              <p className="text-gray-400 text-xl leading-relaxed max-w-2xl">
                {item.description ||
                  item.synopsis ||
                  "Aucune description disponible pour ce rapport."}
              </p>
            </div>

            {/* Statistiques */}
            <div className="flex flex-wrap gap-6 mt-10">
              <div className="bg-gray-900/80 px-8 py-4 rounded-2xl border border-gray-700 shadow-inner">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                  Note Globale
                </p>
                <p className="text-4xl font-black text-yellow-500">
                  {item.avg_rating || "4.5"}
                  <span className="text-lg text-gray-600">/5</span>
                </p>
              </div>
              <div className="bg-gray-900/80 px-8 py-4 rounded-2xl border border-gray-700 shadow-inner">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                  Avis Totaux
                </p>
                <p className="text-4xl font-black text-blue-400">
                  {reviews.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SECTION AVIS */}
        <section className="space-y-8 pb-20">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-yellow-500 rounded-full"></div>
            <h2 className="text-3xl font-black uppercase tracking-tight italic">
              Rapports de la Communauté
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-gray-800/20 p-8 rounded-3xl border border-gray-800/50 flex flex-col md:flex-row gap-8 hover:border-gray-600 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 md:w-48 flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/20">
                      {rev.username ? rev.username[0].toUpperCase() : "?"}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">{rev.username}</span>
                      <span className="text-[10px] text-gray-500 uppercase font-bold">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < rev.rating ? "text-yellow-500" : "text-gray-700"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-800/10 rounded-[2.5rem] border-2 border-dashed border-gray-800">
                <p className="text-gray-600 text-lg italic">
                  Aucun avis n'a encore été enregistré pour ce secteur.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
