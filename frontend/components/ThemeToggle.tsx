"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") { setDark(false); document.documentElement.classList.remove("dark"); }
    else if (stored === "dark" || !stored) { setDark(true); document.documentElement.classList.add("dark"); }
    else if (!stored && window.matchMedia("(prefers-color-scheme: light)").matches) { setDark(false); document.documentElement.classList.remove("dark"); }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <button onClick={toggle} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
