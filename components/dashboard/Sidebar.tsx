"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <nav className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-low border-r border-outline-variant z-50 flex flex-col p-4 transition-all duration-200 ease-in-out">
      {/* Header */}
      <div className="mb-8 px-2 flex flex-col">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>layers</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface leading-none">STRATA</h1>
          </div>
        </div>
        <p className="text-on-surface-variant text-[12px] mt-1 ml-11 font-medium">AI-powered Assistant</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 space-y-1">
        <button
          onClick={() => router.push("/dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-label-md text-label-md transition-all duration-200 ease-in-out text-left cursor-pointer ${pathname === "/dashboard"
            ? "bg-secondary-container text-on-secondary-container"
            : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          Dashboard
        </button>
        <button
          onClick={() => router.push("/repositories")}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-label-md text-label-md transition-all duration-200 ease-in-out text-left cursor-pointer ${pathname === "/repositories"
            ? "bg-secondary-container text-on-secondary-container"
            : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
        >
          <span className="material-symbols-outlined">folder_open</span>
          Repositories
        </button>
      </div>

      {/* Footer / Profile */}
      <div className="mt-auto space-y-4 pt-4 border-t border-outline-variant/30">
        <div className="space-y-1">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/10 transition-colors rounded-lg font-label-md text-label-md text-left cursor-pointer "
          >
            <span className="material-symbols-outlined text-error">logout</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
