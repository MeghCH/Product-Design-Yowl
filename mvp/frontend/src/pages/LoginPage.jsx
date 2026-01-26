import { useState } from "react";
import { Logo } from "../components/logo";
import { NavTabs } from "../components/nav-bar";
import { SearchBar } from "../components/search_bar";
import { ButtonLog } from "../components/button_log";
import { ButtonCreateAccount } from "../components/button_create_account";
import bg from "./Fallout baniere.jpg";

export function LoginPage() {
  const [active, setActive] = useState("Home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tentative de connexion avec :", { email, password });
  };

  return (
    <div
      className="
        min-h-screen w-full
        bg-cover bg-center bg-no-repeat
        relative
      "
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* overlay sombre + vignette */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.85)_100%)]" />

      {/* HEADER */}
      <div className="relative z-10 fixed inset-x-0 top-0">
        <header className="w-full px-10 py-6 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-8">
            <NavTabs active={active} onChange={setActive} />
            <SearchBar />
          </div>

          <ButtonLog />
        </header>
      </div>

      {/* CONTENU */}
      <main className="relative z-10 px-10 pt-20 md:pt-24">
        {/* card login à gauche */}
        <div
          className="
            w-[420px] max-w-full mt-8 md:mt-12 ml-6 md:ml-16
            rounded-2xl
            bg-[#000814]/70
            backdrop-blur-md
            p-8
            border border-[#B9D2ED]/15
          "
        >
          <div className="mb-6">
            <p className="text-blue-200 font-semibold">Welcome back.</p>
            <p className="text-blue-200 text-sm">
              Open your kingdom of culture
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                h-11 w-full rounded-2xl
                bg-[#001D3D]/80
                px-5
                text-sm text-blue-200
                placeholder:text-blue-200/40
                outline-none
                focus:ring-1 focus:ring-blue-800
                shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
              "
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                h-11 w-full rounded-2xl
                bg-[#001D3D]/80
                px-5
                text-sm text-blue-200
                placeholder:text-blue-200/40
                outline-none
                focus:ring-1 focus:ring-blue-800
                shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
              "
              required
            />

            <div className="pt-2">
              <button
                type="submit"
                className="h-11 px-8 rounded-2xl
        bg-yellow-500 text-blue-800
        font-medium
        transition-colors duration-200
        hover:bg-yellow-300
        focus:outline-none focus:ring-2 focus:ring-yellow-300/60
                 "
              >
                Sign in
              </button>
            </div>

            <div className="pt-3 space-y-1 text-sm">
              <button
                type="button"
                className="text-blue-200 hover:text-blue-200 underline-offset-2 hover:underline"
                onClick={() => console.log("signup")}
              >
                Don't have a profile ? Sign up
              </button>

              <button
                type="button"
                className="block text-blue-200 hover:text-blue-200 underline-offset-2 hover:underline"
                onClick={() => console.log("forgot")}
              >
                Forgot your password ?
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
