import React from "react";
import { NavLink } from "react-router-dom";
import TopBar from "./TopBar";
import BrandLogo from "../common/BrandLogo";

const navItems = [
  { label: "Overview", path: "/" },
  { label: "Academic Risk", path: "/academic" },
  { label: "Placement Score", path: "/placement" },
  { label: "Skill & Career", path: "/skills" },
  { label: "Resume Analyzer", path: "/resume" },
  { label: "Internship Match", path: "/internship" },
  { label: "AI Assistant", path: "/assistant" },
  { label: "Institute Analytics", path: "/analytics" },
];

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#16213e,_#0f172a,_#020617)] text-white">
      <TopBar />

      <div className="mx-auto flex max-w-[1450px] gap-4 px-3 py-4">
        <aside className="hidden w-72 shrink-0 rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl lg:block">
          <div className="mb-6">
            <BrandLogo
              size="lg"
              showText={true}
              animated={true}
              glow={true}
              glass={true}
            />
          </div>

          <div className="mb-3 text-xs uppercase tracking-[0.25em] text-slate-500">
            Main Menu
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "border border-cyan-400/20 bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-200 shadow-lg shadow-cyan-500/10"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-sm font-semibold text-cyan-300">
              ML Modules Active
            </p>
            <p className="mt-2 text-xs leading-6 text-slate-300">
              Academic Risk, Resume AI, Career Prediction, Internship Match,
              Student Performance, Placement Dashboard
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/40 p-4">
            <p className="text-sm font-semibold text-white">
              Smart Student Workspace
            </p>
            <p className="mt-2 text-xs leading-6 text-slate-400">
              Track performance, improve placements, optimize resume, and get
              AI-powered career guidance in one place.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 rounded-3xl">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;