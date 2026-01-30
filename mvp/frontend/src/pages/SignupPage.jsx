import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/logo";
import { Link } from "react-router-dom";
import API_BASE from "../config";
import bg from "./Fallout baniere.jpg";
import badge from "../assets/Goof-media.png";

export function SignupPage() {
  const [active, setActive] = useState("Home");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const username = `${firstName} ${lastName}`.trim();

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Registration failed");
      }

      localStorage.setItem("userId", String(data.user.id));
      localStorage.setItem("token", data.token);
      navigate("/profile");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Version desktop */}
      <div
        className="absolute inset-0 hidden md:block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 hidden md:block bg-black/55" />
      <div className="absolute inset-0 hidden md:block bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.85)_100%)]" />

      {/* Version mobile */}
      <div className="absolute inset-0 md:hidden">
        <div
          className="absolute top-0 left-0 w-full h-[55vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bg})` }}
        />
        <div className="absolute top-0 left-0 w-full h-[55vh] bg-black/55" />
        <div className="absolute top-0 left-0 w-full h-[55vh] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.85)_100%)]" />

        {/* Fond bleu mobile */}
        <div className="absolute bottom-0 left-0 w-full h-[45vh] bg-[#000814]" />

        <div className="absolute top-[52vh] left-0 w-full h-24 bg-linear-to-b from-transparent to-color-deepblue" />
      </div>

      {/* Header desktop */}
      <div className="relative z-10 fixed inset-x-0 top-0 hidden md:block">
        <header className="w-full px-10 py-6 flex items-center justify-between">
          <Link to="/" className="cursor-pointer">
            <Logo />
          </Link>
        </header>
      </div>

      {/* Page */}
      <main className="relative z-10 min-h-screen md:px-10 md:pt-20 md:pt-24">
        <div className="min-h-screen flex items-end justify-center px-6 pb-10 pt-24 md:min-h-0 md:block md:px-0 md:pb-0 md:pt-0">
          <div className="relative w-full max-w-[420px] md:w-[420px] md:mt-8 md:mt-12 md:ml-6 md:ml-16">
            {/* Logo mobile */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 md:hidden z-20">
              <img
                src={badge}
                alt="Goof Media"
                className="h-14 w-auto drop-shadow-[0_12px_25px_rgba(0,0,0,0.55)]"
              />
            </div>

            {/* Formulaire */}
            <div
              className="
                rounded-2xl
                bg-[#000814]/70
                backdrop-blur-md
                p-8
                border border-[#B9D2ED]/15
                pt-16 md:pt-8
              "
            >
              <div className="mb-6">
                <p className="text-blue-200 font-semibold">
                  Create your account.
                </p>
                <p className="text-blue-200 text-sm">Join Goof Media</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                    disabled={isLoading}
                    className="
                      h-11 px-8 rounded-2xl
                      bg-yellow-500 text-blue-800
                      font-medium
                      transition-colors duration-200
                      hover:bg-yellow-300
                      focus:outline-none focus:ring-2 focus:ring-yellow-300/60
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    {isLoading ? "Creating..." : "Create account"}
                  </button>
                </div>

                <div className="pt-3 space-y-1 text-sm">
                  <button
                    type="button"
                    className="text-blue-200 underline-offset-2 hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    Already have an account? Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignupPage;
