import { useState, useEffect } from "react";
import { HomePage } from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
  const getRoute = () => window.location.hash || "#/";
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="App self-start w-full">
      {route === "#/login" ? <LoginPage /> : <HomePage />}
    </div>
  );
}

export default App;
