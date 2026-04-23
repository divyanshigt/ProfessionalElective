import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import BrandLogo from "../common/BrandLogo";

const routes = [
  { label: "Overview", path: "/" },
  { label: "Academic Risk", path: "/academic" },
  { label: "Placement", path: "/placement" },
  { label: "Skills", path: "/skills" },
  { label: "Resume", path: "/resume" },
  { label: "Internship", path: "/internship" },
  { label: "Assistant", path: "/assistant" },
  { label: "Analytics", path: "/analytics" },
];

const TopBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    return routes.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleSelect = (path) => {
    navigate(path);
    setQuery("");
  };

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1450px] items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-[260px]">
          <BrandLogo
            size="md"
            showText={true}
            animated={true}
            glow={true}
            glass={true}
          />
        </div>

        <div className="relative w-full max-w-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages like resume, placement, analytics..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />

          {filtered.length > 0 && (
            <div className="absolute mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
              {filtered.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleSelect(item.path)}
                  className="block w-full border-b border-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/5"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 md:block">
                {user?.name || "Student"}
              </div>

              <button
                onClick={logout}
                className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/register")}
                className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20"
              >
                Create Account
              </button>

              <button
                onClick={() => navigate("/login")}
                className="rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02]"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;