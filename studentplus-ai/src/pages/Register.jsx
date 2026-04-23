import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    localStorage.setItem(
      "sp_registered_user",
      JSON.stringify({
        name: form.name,
        email: form.email,
      })
    );

    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#16213e,_#0f172a,_#020617)] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <p className="mb-2 inline-block rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
          New Account
        </p>
        <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
        <p className="mt-2 text-sm text-slate-300">
          Create your StudentPlus AI account to continue.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-200">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create password"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-200">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-6 py-3 font-semibold text-white"
          >
            Create Account
          </button>

          {error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-cyan-300 hover:text-cyan-200">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;