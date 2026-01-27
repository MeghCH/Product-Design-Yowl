export const ProfileCard = ({ user }: { user: any }) => (
    <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                {user.username[0].toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-400 mb-6">{user.email}</p>
            
            <div className="w-full space-y-3">
                <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                    <span className="text-gray-500">Membre depuis</span>
                    <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    </div>
);

// components/ButtonLogout.tsx
export const ButtonLogout = ({ onLogout }: { onLogout: () => void }) => (
    <button 
        onClick={onLogout}
        className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
    >
        Déconnexion
    </button>
);