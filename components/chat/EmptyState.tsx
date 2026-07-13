"use client";


import type { Repository } from "@/src/types/repository";

interface EmptyStateProps {
  repository: Repository;
}

export default function EmptyState({ repository }: EmptyStateProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-12">
      <div className="text-center space-y-3">
        <div className="mx-auto w-12 h-12 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-2xl text-primary">psychology</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-on-surface">Strata AI Assistant</h2>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto">
          Ask structural patterns, API endpoints, or seek code implementations in <strong className="text-on-surface">{repository.repoName}</strong>.
        </p>
      </div>

      {repository.status !== "ready" && (
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex gap-3 text-sm">
          <span className="material-symbols-outlined text-inverse-primary text-xl">info</span>
          <div className="space-y-1">
            <h4 className="font-semibold text-on-surface">Ingestion Status: {repository.status}</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              This repository has not finished indexing yet. The AI's knowledge might be incomplete or unavailable until the status is "ready".
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
