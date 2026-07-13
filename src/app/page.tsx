"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0e0e11] text-[#e4e1e5]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
          <p className="text-sm font-medium tracking-wide">Loading Strata...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#131316] to-[#0b0b0c] text-on-surface p-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-tertiary-container/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full text-center space-y-8 z-10">
        {/* Logo and Brand */}
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-surface-container border border-outline-variant flex items-center justify-center shadow-2xl">
            <span className="material-symbols-outlined text-4xl text-primary">layers</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-on-surface via-primary to-outline">
              STRATA
            </h1>
            <p className="text-on-surface-variant font-medium text-sm">
              AI-Powered Codebase Intelligence & Analytics
            </p>
          </div>
        </div>

        {/* Feature Highlights Card */}
        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 text-left space-y-4 shadow-xl">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">Features</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5">query_stats</span>
              <div>
                <h3 className="font-semibold text-sm text-on-surface">Intelligent Indexing</h3>
                <p className="text-xs text-on-surface-variant">Chunk, embed, and store repository symbols automatically.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5">chat_bubble</span>
              <div>
                <h3 className="font-semibold text-sm text-on-surface">Context-Aware Chat</h3>
                <p className="text-xs text-on-surface-variant">Ask questions, search symbols, and chat directly with your code.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5">dashboard</span>
              <div>
                <h3 className="font-semibold text-sm text-on-surface">Premium Developer Console</h3>
                <p className="text-xs text-on-surface-variant">High-density visual interface for tracking your AI ingestion states.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {session ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 px-4 rounded-xl bg-on-surface text-background font-semibold hover:bg-primary transition-all duration-200 cursor-pointer shadow-lg shadow-on-surface/5 flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="w-full py-3 px-4 rounded-xl bg-on-surface text-background font-semibold hover:bg-primary transition-all duration-200 cursor-pointer shadow-lg shadow-on-surface/5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
              Sign in with GitHub
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
