import { useState } from "react";
import { ButtonCreateAccount } from "../components/button_create_account";
import { ButtonLog } from "../components/button_log";
import { Logo } from "../components/logo";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Tentative de connexion avec :", { email, password });
    };

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-gray-50 dark:bg-gray-900 py-8 overflow-auto">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <header className="flex items-center justify-between mb-8">
                    <Logo className="text-xl" />
                    <ButtonCreateAccount onClick={() => console.log('Create account')} />
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 items-center">
                        <ButtonLog />
                        
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                            Mot de passe oublié ?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;