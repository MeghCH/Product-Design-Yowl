import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/logo";
import { NavTabs } from "../components/nav-bar";
import { SearchBar } from "../components/search_bar";
import { ButtonLog } from "../components/button_log";

export function HomePage() {
    const [sections, setSections] = useState({
        "Jeu_video": [],
        "Film": [],
        "Serie": [],
        "Livre": []
    });
    const [active, setActive] = useState("Home");
    const navigate = useNavigate();

    const fetchAllSections = async () => {
        const categories = ["Jeu_video", "Film", "Serie", "Livre"];
        const newSections = {};

        for (const cat of categories) {
            try {
                const response = await fetch(`http://localhost:4000/media/${cat}?limit=5`);
                const result = await response.json();
                const formattedResult = result.map(item => ({
                    ...item,
                    id: item.id || item.id_film || item.id_serie || item.id_livre || item.id_jeu
                }));
                newSections[cat] = formattedResult.slice(0, 5);
            } catch (err) {
                console.error(`Erreur Fetch ${cat}:`, err);
                newSections[cat] = [];
            }
        }
        setSections(newSections);
    };

    useEffect(() => {
        fetchAllSections();
    }, []);

    // Fonction de redirection
    const handleNavigation = (category, id) => {
        if (!id) {
            console.error("Impossible de naviguer : ID manquant pour", category);
            return;
        }
        console.log(`Navigation vers /review/${category}/${id}`);
        navigate(`/review/${category}/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="fixed inset-x-0 top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
                <header className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
                    <Logo />
                    <div className="flex items-center gap-6">
                        <NavTabs active={active} onChange={setActive} />
                        <SearchBar />
                    </div>
                    <ButtonLog />
                </header>
            </div>

            {/* Main Content */}
            <main className="pt-32 pb-12 px-8 max-w-7xl mx-auto space-y-20">
                {Object.entries(sections).map(([category, items]) => (
                    <section key={category} className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></span>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">
                                New {category.replace('_', ' ')}s
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                            {items.length > 0 ? items.map((item) => (
                                <div 
                                    key={item.id}
                                    onClick={() => handleNavigation(category, item.id)}
                                    className="group cursor-pointer flex flex-col space-y-4"
                                >
                                    {/* Container Image */}
                                    <div className="relative aspect-[2/3] bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 group-hover:border-yellow-500/50 transition-all duration-300 shadow-xl">
                                        <img 
                                            src={new URL(`../assets/${item.picture}`, import.meta.url).href} 
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=Image+Non+Trouvée"; }}
                                        />
                                        {/* Overlay au hover */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">
                                                Voir l'avis
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Légende */}
                                    <div className="px-1">
                                        <h3 className="font-bold text-sm line-clamp-1 group-hover:text-yellow-500 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {category.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full h-40 flex items-center justify-center border-2 border-dashed border-gray-800 rounded-3xl">
                                    <p className="text-gray-600 italic">En attente de nouvelles entrées dans le Codex...</p>
                                </div>
                            )}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    );
}