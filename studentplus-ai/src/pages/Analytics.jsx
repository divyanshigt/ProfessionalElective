import React, { useEffect, useState } from "react";
import { analyticsService } from "../services/api";

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await analyticsService.getInstituteAnalytics();
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  if (!data) {
    return <div className="text-white">Loading institute analytics dashboard...</div>;
  }

  return (
    <div className="text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="mb-2 inline-block rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
              Institutional Analytics
            </p>
            <h1 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-4xl font-extrabold text-transparent">
              Placement and Institute Analytics
            </h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              An institute-level placement analytics dashboard built using the provided placement data.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            Admin View
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Card title="Companies" value={data.companies} />
          <Card title="Students" value={data.students} />
          <Card title="Offers" value={data.offers} />
          <Card title="Highest Package" value={`${data.highest_package_lpa} LPA`} />
          <Card title="Average Package" value={`${data.average_package_lpa} LPA`} />
          <Card title="Placement Rate" value={`${data.placement_rate}%`} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Section title="Salary Bands">
              <div className="grid gap-4 md:grid-cols-3">
                {data.salary_bands.map((item) => (
                  <div key={item.band} className="rounded-2xl bg-slate-900/40 p-4">
                    <p className="text-lg font-bold text-cyan-300">{item.band}</p>
                    <p className="mt-2 text-sm text-slate-300">Companies: {item.companies}</p>
                    <p className="text-sm text-slate-300">Offers: {item.offers}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="CTC Matrix">
              <div className="space-y-4">
                {data.ctc_matrix.map((item) => (
                  <div key={item.group}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.group}</span>
                      <span className="text-slate-300">{item.avg_ctc_lpa} LPA</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${Math.min(100, item.avg_ctc_lpa * 4)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          <div className="space-y-6">
            <Section title="CTC Terminal">
              <div className="space-y-3">
                {data.ctc_terminal.map((item, i) => (
                  <div key={i} className="rounded-2xl bg-slate-900/40 p-4 text-sm text-slate-300">
                    <span className="font-semibold text-cyan-300">{item.package_lpa} LPA</span> — {item.students} students
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Top Recruiters">
              <div className="flex flex-wrap gap-2">
                {data.top_recruiters.map((company, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-300"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

function Card({ title, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-bold text-cyan-300">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default Analytics;