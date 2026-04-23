import React from "react";
import logoMark from "../../assets/logo-mark.svg";

const BrandLogo = ({
  size = "md",
  showText = true,
  animated = true,
  glow = true,
  glass = true,
  className = "",
}) => {
  const sizeMap = {
    sm: {
      wrapper: "h-10 w-10 rounded-2xl",
      img: "h-6 w-6",
      title: "text-lg",
      subtitle: "text-[11px]",
      gap: "gap-2.5",
      pad: "p-2",
    },
    md: {
      wrapper: "h-12 w-12 rounded-2xl",
      img: "h-7 w-7",
      title: "text-xl",
      subtitle: "text-xs",
      gap: "gap-3",
      pad: "p-2.5",
    },
    lg: {
      wrapper: "h-14 w-14 rounded-3xl",
      img: "h-8 w-8",
      title: "text-2xl",
      subtitle: "text-sm",
      gap: "gap-4",
      pad: "p-3",
    },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className={`group flex items-center ${current.gap} ${className}`}>
      <div className="relative">
        {glow && (
          <div
            className={`absolute inset-0 ${current.wrapper} bg-cyan-400/30 blur-xl transition duration-500 ${
              animated ? "group-hover:scale-125 group-hover:opacity-100" : ""
            } opacity-80`}
          />
        )}

        <div
          className={[
            "relative flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl",
            current.wrapper,
            current.pad,
            glass
              ? "bg-white/10"
              : "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600",
            animated
              ? "transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105"
              : "",
          ].join(" ")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-indigo-500/20" />
          <div className="absolute inset-x-2 top-0 h-px bg-white/40" />
          <img
            src={logoMark}
            alt="StudentPlus AI logo"
            className={`${current.img} relative z-10 ${
              animated ? "transition duration-300 group-hover:rotate-6" : ""
            }`}
          />
        </div>
      </div>

      {showText && (
        <div className="min-w-0">
          <div
            className={`bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text font-extrabold text-transparent ${current.title}`}
          >
            StudentPlus AI
          </div>
          <div className={`text-slate-400 ${current.subtitle}`}>
            Smart Academic Platform
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;