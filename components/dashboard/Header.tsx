"use client";

import { useSession } from "next-auth/react";


interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onAddRepositoryClick: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  onAddRepositoryClick,
}: HeaderProps) {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <header className="sticky top-0 w-full z-40 bg-background border-b border-outline-variant flex justify-between items-center h-16 px-6 md:px-8 transition-all duration-200 ease-in-out">
      <div className="flex items-center flex-1">
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: "18px" }}>search</span>
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-primary-container border border-outline-variant rounded-lg pl-9 pr-4 py-1.5 text-sm font-mono-code text-on-surface focus:outline-none focus:border-surface-bright transition-colors placeholder:text-on-surface-variant/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="hidden md:flex items-center justify-center w-8 h-8 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>help</span>
        </button>
        <button className="hidden md:flex items-center justify-center w-8 h-8 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>notifications</span>
        </button>
        <div className="h-6 w-px bg-outline-variant mx-2"></div>
        <button
          onClick={onAddRepositoryClick}
          className="text-xs font-semibold bg-on-surface text-background px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all cursor-pointer shadow-lg"
        >
          Add Repository
        </button>
        {session.user.avatarUrl && (
          <img
            alt="User Profile"
            src={session.user.avatarUrl}
            className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant object-cover "
          />
        )}
      </div>
    </header>
  );
}
