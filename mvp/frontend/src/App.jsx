import { useState, useEffect } from "react";
import { HomePage } from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  const getRoute = () => window.location.hash || "#/";
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const renderPage = () => {
    if (route === "#/login") {
      return <LoginPage />;
    } else if (route === "#/signup") {
      return <SignupPage />;
    } else if (route.startsWith("#/category/")) {
      const category = decodeURIComponent(route.split("#/category/")[1]);
      return <CategoryPage category={category} />;
    } else {
      return <HomePage />;
    }
  };

  return (
    <div className="App self-start w-full">
      {renderPage()}
    </div>
  );
}

export default App;
