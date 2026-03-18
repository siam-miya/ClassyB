// src/pages/AdminLogin.jsx
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [checking, setChecking] = useState(true); // ✅ already logged in কিনা check
  const [error,    setError]    = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  // ✅ Already logged in থাকলে সরাসরি /admin এ পাঠাবে
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin", { replace: true });
      } else {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("Invalid email or password.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check চলাকালীন spinner দেখাবে
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a3a5c] via-[#1e4d7b] to-[#2563a8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a5c] via-[#1e4d7b] to-[#2563a8] flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Decorative bg circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm sm:max-w-md relative z-10">

        {/* ── Logo / Brand ── */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 bg-white flex items-center justify-center">
              <img
                src="/main-logo.jpg"
                alt="FashionBD Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML = '<span class="text-[#1a3a5c] font-black text-3xl">F</span>';
                }}
              />
            </div>
          </div>
          <h1 className="text-white font-black text-2xl sm:text-3xl tracking-wide">ClassyBazar</h1>
          <p className="text-blue-200 mt-1 text-xs sm:text-sm">Admin Panel — Secure Login</p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-gray-900 font-black text-lg sm:text-xl mb-5 sm:mb-6 text-center">
            🔐 Admin Login
          </h2>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
              <span className="flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📧</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fashionbd.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[#1a3a5c] transition-colors text-gray-900 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[#1a3a5c] transition-colors text-gray-900 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a3a5c] text-white font-black py-3 sm:py-3.5 rounded-xl hover:bg-[#2563a8] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base mt-1"
            >
              {loading ? "⏳ Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <a href="/" className="text-xs sm:text-sm text-gray-400 hover:text-[#1a3a5c] transition-colors">
              ← Back to Main Site
            </a>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-blue-300/60 text-xs mt-4">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}