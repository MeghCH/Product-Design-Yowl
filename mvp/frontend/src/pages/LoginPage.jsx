import { useState } from "react";
import { Logo } from "../components/logo";
import { ButtonLog } from "../components/button_log";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

   const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
        const response = await fetch("http://localhost:4000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.user) {
            // 1. On stocke l'ID pour que la page profil sache qui afficher
            localStorage.setItem("userId", data.user.id);
            
            // 2. LA REDIRECTION (C'est cette ligne qui te manque peut-être)
            navigate("/profile"); 
        } else {
            alert("Erreur: " + data.message);
        }
    } catch (err) {
        console.error("Erreur lors de la redirection:", err);
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
                <div className="flex justify-center mb-8"><Logo /></div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</p>}
                    
                    <input 
                        type="email" 
                        placeholder="Email (marneus@ultramarines.com)" 
                        className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white outline-none focus:border-yellow-500"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Mot de passe (Ultramar)" 
                        className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white outline-none focus:border-yellow-500"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />

                    <div className="flex justify-center mt-6">
                        <ButtonLog type="submit" onClick={handleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    );
}