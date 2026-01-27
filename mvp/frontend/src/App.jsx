import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ReviewPage } from "./pages/ReviewPage"; // Assure-toi de l'importer !

function App() {
  return (
    <div className="App self-start w-full bg-gray-900 min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Cette route doit être AVANT le path="*" */}
        <Route path="/review/:type/:id" element={<ReviewPage />} />

        {/* Le path="*" doit TOUJOURS être en dernière position */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;