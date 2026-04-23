import React, { useEffect, useMemo, useState } from "react";
import BrandLogo from "../components/common/BrandLogo";
const Overview = () => {
  const [dashboardData, setDashboardData] = useState({
    risk: null,
    performance: null,
    career: null,
    resume: null,
    internship: null,
    placement: null,
  });

  useEffect(() => {
    const loadData = () => {
      try {
        const risk = JSON.parse(localStorage.getItem("academicRiskResult"));
        const performance = JSON.parse(
          localStorage.getItem("studentPerformanceResult")
        );
        const career = JSON.parse(localStorage.getItem("careerResult"));
        const resume = JSON.parse(localStorage.getItem("resumeResult"));
        const internship = JSON.parse(localStorage.getItem("internshipResult"));
        const placement = JSON.parse(localStorage.getItem("placementResult"));

        setDashboardData({
          risk,
          performance,
          career,
          resume,
          internship,
          placement,
        });
      } catch (err) {
        console.error("Dashboard localStorage read error:", err);
      }
    };

    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const summary = useMemo(() => {
    const { risk, performance, career, resume, internship, placement } =
      dashboardData;

    const completionCount = [
      !!risk,
      !!performance,
      !!career,
      !!resume,
      !!internship,
      !!placement,
    ].filter(Boolean).length;

    const healthScoreParts = [];

    if (risk?.risk_level === "Low Risk") healthScoreParts.push(90);
    else if (risk?.risk_level === "Medium Risk") healthScoreParts.push(65);
    else if (risk?.risk_level === "High Risk") healthScoreParts.push(35);

    if (performance?.predicted_gpa) {
      healthScoreParts.push(Math.min(100, performance.predicted_gpa * 10));
    }

    if (resume?.resume_score) {
      healthScoreParts.push(resume.resume_score);
    }

    if (career?.confidence) {
      healthScoreParts.push(Math.round(career.confidence * 100));
    }

    if (internship?.confidence) {
      healthScoreParts.push(Math.round(internship.confidence * 100));
    }

    if (placement?.placement_score) {
      healthScoreParts.push(placement.placement_score);
    }

    const overallHealth =
      healthScoreParts.length > 0
        ? Math.round(
            healthScoreParts.reduce((a, b) => a + b, 0) /
              healthScoreParts.length
          )
        : 0;

    return {
      completionCount,
      overallHealth,
    };
  }, [dashboardData]);

  const topCards = [
    {
      title: "Academic Risk",
      value: dashboardData.risk?.risk_level || "--",
      sub: "Live risk classification",
      accent:
        dashboardData.risk?.risk_level === "Low Risk"
          ? "text-emerald-300"
          : dashboardData.risk?.risk_level === "Medium Risk"
          ? "text-yellow-300"
          : dashboardData.risk?.risk_level === "High Risk"
          ? "text-red-300"
          : "text-slate-200",
      icon: "🎓",
    },
    {
      title: "Predicted GPA",
      value: dashboardData.performance?.predicted_gpa || "--",
      sub: "Student performance engine",
      accent: "text-cyan-300",
      icon: "📘",
    },
    {
      title: "Career Path",
      value: dashboardData.career?.recommended_role || "--",
      sub: "AI role recommendation",
      accent: "text-purple-300",
      icon: "🧠",
    },
    {
      title: "Resume Score",
      value: dashboardData.resume?.resume_score
        ? `${dashboardData.resume.resume_score}/100`
        : "--",
      sub: "ATS-style evaluation",
      accent: "text-yellow-300",
      icon: "📄",
    },
    {
      title: "Internship Role",
      value: dashboardData.internship?.recommended_role || "--",
      sub: "Internship intelligence",
      accent: "text-cyan-300",
      icon: "🚀",
    },
    {
      title: "Placement Score",
      value: dashboardData.placement?.placement_score || "--",
      sub: "Placement readiness",
      accent: "text-emerald-300",
      icon: "💼",
    },
  ];

  const progressMetrics = [
    {
      label: "Academic Health",
      value:
        dashboardData.risk?.risk_level === "Low Risk"
          ? 88
          : dashboardData.risk?.risk_level === "Medium Risk"
          ? 62
          : dashboardData.risk?.risk_level === "High Risk"
          ? 35
          : 0,
      bar: "from-emerald-400 to-cyan-400",
    },
    {
      label: "Performance Quality",
      value: dashboardData.performance?.predicted_gpa
        ? Math.min(100, Math.round(dashboardData.performance.predicted_gpa * 10))
        : 0,
      bar: "from-cyan-400 to-blue-500",
    },
    {
      label: "Career Alignment",
      value: dashboardData.career?.confidence
        ? Math.round(dashboardData.career.confidence * 100)
        : 0,
      bar: "from-purple-400 to-indigo-500",
    },
    {
      label: "Resume Strength",
      value: dashboardData.resume?.resume_score || 0,
      bar: "from-yellow-400 to-orange-400",
    },
    {
      label: "Internship Readiness",
      value: dashboardData.internship?.confidence
        ? Math.round(dashboardData.internship.confidence * 100)
        : 0,
      bar: "from-sky-400 to-cyan-400",
    },
    {
      label: "Placement Readiness",
      value: dashboardData.placement?.placement_score || 0,
      bar: "from-cyan-400 to-blue-500",
    },
  ];

  return (
    <div className="text-white">
      <div className="mx-auto max-w-7xl">
<div className="mb-8 flex items-start justify-between gap-4">
  <div>
    <div className="mb-4">
      <BrandLogo
        size="md"
        showText={false}
        animated={true}
        glow={true}
        glass={true}
      />
    </div>

    <p className="mb-2 inline-block rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
      Unified AI Dashboard
    </p>

    <h1 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-4xl font-extrabold text-transparent">
      Student Intelligence Overview
    </h1>

    <p className="mt-3 max-w-3xl text-slate-300">
      One smart dashboard combining academic risk, student performance,
      career prediction, resume analysis, internship recommendation, and
      placement readiness.
    </p>
  </div>

  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
    {summary.completionCount}/6 Modules Active
  </div>
</div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topCards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {card.title}
                  </p>
                  <p className={`mt-3 text-3xl font-bold ${card.accent}`}>
                    {card.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{card.sub}</p>
                </div>
                <span className="text-2xl">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Overall Student Health
              </p>

              <div className="mt-6 flex items-center gap-6">
                <div className="relative h-28 w-28">
                  <svg className="h-28 w-28 -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="44"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="44"
                      stroke="url(#gradOverviewGauge)"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 44}
                      strokeDashoffset={
                        2 * Math.PI * 44 * (1 - summary.overallHealth / 100)
                      }
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="gradOverviewGauge"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-cyan-300">
                      {summary.overallHealth || "--"}
                    </span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                </div>

                <div>
                  <p className="text-2xl font-bold text-white">
                    {summary.overallHealth >= 80
                      ? "Excellent Standing"
                      : summary.overallHealth >= 65
                      ? "Strong Performance"
                      : summary.overallHealth >= 50
                      ? "Moderate Progress"
                      : "Needs Attention"}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Composite score built from all active AI modules
                  </p>
                  <div className="mt-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                    Live integrated insights
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {progressMetrics.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="text-slate-300">{item.value}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${item.bar}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Latest Career Insight
                </p>
                <p className="mt-4 text-2xl font-bold text-purple-300">
                  {dashboardData.career?.recommended_role || "--"}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {dashboardData.career?.ai_summary ||
                    "Predict a career path to see role-focused AI guidance."}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Internship Match
                </p>
                <p className="mt-4 text-2xl font-bold text-cyan-300">
                  {dashboardData.internship?.recommended_role || "--"}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {dashboardData.internship?.suggestion ||
                    "Run internship recommendation to view role-specific advice."}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                AI Recommendations
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-900/40 p-4 text-sm text-slate-300">
                  Improve communication and aptitude to raise placement readiness.
                </div>
                <div className="rounded-2xl bg-slate-900/40 p-4 text-sm text-slate-300">
                  Add stronger project descriptions for a better resume score.
                </div>
                <div className="rounded-2xl bg-slate-900/40 p-4 text-sm text-slate-300">
                  Maintain attendance and consistent internal marks for stronger
                  GPA prediction.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Module Status
              </p>
              <div className="mt-5 space-y-3">
                <StatusRow
                  label="Academic Risk"
                  value={dashboardData.risk?.risk_level}
                />
                <StatusRow
                  label="Student Performance"
                  value={dashboardData.performance?.performance}
                />
                <StatusRow
                  label="Career Prediction"
                  value={dashboardData.career?.recommended_role}
                />
                <StatusRow
                  label="Resume Analysis"
                  value={
                    dashboardData.resume?.resume_score
                      ? `${dashboardData.resume.resume_score}/100`
                      : null
                  }
                />
                <StatusRow
                  label="Internship Match"
                  value={dashboardData.internship?.recommended_role}
                />
                <StatusRow
                  label="Placement Score"
                  value={
                    dashboardData.placement?.placement_score
                      ? `${dashboardData.placement.placement_score}/100`
                      : null
                  }
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Resume Insights
              </p>
              <div className="mt-4 space-y-3">
                <InfoCard
                  title="Predicted Role"
                  value={dashboardData.resume?.predicted_role || "--"}
                />
                <InfoCard
                  title="ATS Level"
                  value={dashboardData.resume?.ats_level || "--"}
                />
                <InfoCard
                  title="Resume Score"
                  value={
                    dashboardData.resume?.resume_score
                      ? `${dashboardData.resume.resume_score}/100`
                      : "--"
                  }
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Quick Highlights
              </p>

              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl bg-slate-900/40 p-4">
                  <span className="font-semibold text-cyan-300">GPA:</span>{" "}
                  {dashboardData.performance?.predicted_gpa || "--"}
                </div>
                <div className="rounded-2xl bg-slate-900/40 p-4">
                  <span className="font-semibold text-emerald-300">
                    Performance:
                  </span>{" "}
                  {dashboardData.performance?.performance || "--"}
                </div>
                <div className="rounded-2xl bg-slate-900/40 p-4">
                  <span className="font-semibold text-yellow-300">
                    Resume Confidence:
                  </span>{" "}
                  {dashboardData.resume?.confidence
                    ? `${Math.round(dashboardData.resume.confidence * 100)}%`
                    : "--"}
                </div>
                <div className="rounded-2xl bg-slate-900/40 p-4">
                  <span className="font-semibold text-purple-300">
                    Career Confidence:
                  </span>{" "}
                  {dashboardData.career?.confidence
                    ? `${Math.round(dashboardData.career.confidence * 100)}%`
                    : "--"}
                </div>
                <div className="rounded-2xl bg-slate-900/40 p-4">
                  <span className="font-semibold text-cyan-300">
                    Placement Score:
                  </span>{" "}
                  {dashboardData.placement?.placement_score || "--"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatusRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-900/40 px-4 py-3 text-sm">
      <span className="text-slate-300">{label}</span>
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          value
            ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
            : "border border-white/10 bg-white/5 text-slate-400"
        }`}
      >
        {value || "Not Run"}
      </span>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-slate-900/40 p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export default Overview;