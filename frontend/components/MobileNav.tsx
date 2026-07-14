"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Trophy, Scale } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/quests", label: "Learn", icon: BookOpen },
  { href: "/leaderboard", label: "Ranks", icon: Trophy },
  { href: "/governance", label: "Council", icon: Scale },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-2xl border-t border-black/5 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                active ? "text-primary" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <tab.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
