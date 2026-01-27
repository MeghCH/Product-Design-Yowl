import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { ProfilePage } from "./pages/ProfilePageActivity";
import { ReviewPage } from "./pages/ReviewPage";

function App() {
  return (
    <div className="App self-start w-full bg-deepblue min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/review/:type/:id" element={<ReviewPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
