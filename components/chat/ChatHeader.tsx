"use client";

import type { Repository } from "@/src/types/repository";

interface ChatHeaderProps {
  repository: Repository;
  onBack: () => void;
}

export default function ChatHeader({ repository, onBack }: ChatHeaderProps) {
  const statusColors = {
    ready: "bg-surface-container-highest text-on-surface border-outline-variant/50",
    indexing: "bg-surface-container-low text-inverse-primary border-outline-variant/50 animate-pulse font-semibold",
    pending: "bg-surface-container-highest text-outline border-outline-variant/50",
    failed: "bg-error-container/20 text-error border-error/30",
  };

  const statusIndicators = {
    ready: <span className="w-1.5 h-1.5 rounded-full bg-surface-tint mr-1.5"></span>,
    indexing: <span className="material-symbols-outlined mr-1 animate-spin text-[14px]">sync</span>,
    pending: null,
    failed: <span className="material-symbols-outlined mr-1 text-[14px]">error_outline</span>,
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-background border-b border-outline-variant flex justify-between items-center h-16 px-8 transition-all duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-on-surface-variant hover:text-on-surface cursor-pointer flex items-center justify-center p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
          title="Back to Dashboard"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
        </button>
        <div className="h-4 w-px bg-outline-variant"></div>
        <div className="flex flex-col text-left">
          <span className="font-semibold text-[15px] text-on-surface flex items-center gap-2">
            {repository.repoName}
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] border capitalize ${statusColors[repository.status]}`}>
              {statusIndicators[repository.status]}
              {repository.status === "indexing"
                ? `Indexing: ${repository.indexingStage || "starting"}`
                : repository.status}
            </span>
          </span>
          <span className="text-[11px] font-mono-code text-on-surface-variant font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">subdirectory_arrow_right</span>
            {repository.defaultBranch}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={repository.githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 border border-outline-variant hover:border-outline text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 rounded-lg bg-surface-container-high transition-all duration-200 cursor-pointer"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>open_in_new</span>
          GitHub Repo
        </a>
      </div>
    </header>
  );
}
