import React from "react";
import logoMark from "../../assets/logo-mark.svg";

const LogoLoader = ({ fullScreen = false, text = "Loading StudentPlus AI..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 h-20 w-20 rounded-full bg-cyan-400/20 blur-2xl animate-pulse" />
        <div className="absolute inset-0 h-20 w-20 rounded-full border border-cyan-400/20 animate-spin" />
        <div className="absolute inset-2 h-16 w-16 rounded-full border border-blue-400/20 animate-[spin_3s_linear_reverse_infinite]" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-cyan-400/15 via-blue-500/10 to-indigo-500/15" />
          <img
            src={logoMark}
            alt="Loading"
            className="relative z-10 h-10 w-10 animate-pulse"
          />
        </div>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-300">{text}</p>
      <p className="mt-1 text-xs text-slate-500">Preparing your AI workspace</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return <div className="py-10">{content}</div>;
};

export default LogoLoader;