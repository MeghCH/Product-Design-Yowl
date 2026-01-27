import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/logo";
import { NavTabs } from "../components/nav-bar";
import { NavTabsProfils } from "../components/nav-barre-profile";

export function ProfilePage() {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            navigate("/login");
            return;
        }

        // Chargement de toutes les données
        Promise.all([
            fetch(`http://localhost:4000/user/${userId}`).then(res => res.json()),
            fetch(`http://localhost:4000/user/${userId}/favorites`).then(res => res.json()).catch(() => []),
            fetch(`http://localhost:4000/user/${userId}/comments`).then(res => res.json()).catch(() => [])
        ]).then(([userData, favData, commentData]) => {
            setUser(userData);
            setFavorites(favData);
            setComments(commentData);
            setLoading(false);
        }).catch(err => {
            console.error("Erreur de chargement:", err);
            setLoading(false);
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate("/login");
    };

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Chargement du Codex...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900/90 backdrop-blur-sm z-50">
                <Logo />
                <NavTabs />
                <div className="flex gap-4">
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all">Déconnexion</button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 space-y-12">
                
                {/* 1. EN-TÊTE PROFIL */}
                <section className="flex items-center gap-8 bg-gray-800/50 p-8 rounded-3xl border border-gray-700">
                    <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg">
                        {user?.username?.[0]}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{user?.username}</h1>
                        <p className="text-gray-400">{user?.email}</p>
                    </div>
                </section>

                <div className="flex justify-center w-full">
    <NavTabsProfils />
</div>
            </main>
        </div>
    );
}