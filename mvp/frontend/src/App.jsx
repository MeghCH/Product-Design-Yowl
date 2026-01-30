import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { ProfilePage } from "./pages/ProfilePageActivity";
import { ReviewPage } from "./pages/ReviewPage";
import HomePageLoged from "./pages/HomePageLoged";
import CategoryPage from "./pages/CategoryPage";
import ProfileMediaPage from "./pages/ProfileMediaPage";

/* ✅ ADD THIS IMPORT */
import RelatedPage from "./pages/RelatedPage";

function App() {
  return (
    <div className="App self-start w-full bg-[#000814] min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/home/log" element={<HomePageLoged />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/profile/:mediaType" element={<ProfileMediaPage />} />

        <Route path="/review/:type/:id" element={<ReviewPage />} />
        <Route path="/info/:type/:id" element={<ReviewPage />} />

        <Route path="/info/:type/:id" element={<ReviewPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
