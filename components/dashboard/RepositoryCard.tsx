"use client";

import { useRouter } from "next/navigation";

export interface RepositoryCardProps {
  repo: {
    _id: string;
    repoName: string;
    githubRepoUrl: string;
    visibility: "public" | "private";
    status: "pending" | "indexing" | "ready" | "failed";
    indexingStage?: "connecting" | "chunking" | "embedding" | "storing";
    defaultBranch: string;
    lastIndexedAt?: any;
    languages?: string[];
  };
  onRetry: (repo: any) => void;
}

export default function RepositoryCard({ repo, onRetry }: RepositoryCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/repositories/${repo._id}`)}
      className={`bg-surface border rounded-[16px] p-6 transition-colors group flex flex-col h-full bg-gradient-to-b from-[#161618] to-[#0B0B0C] relative overflow-hidden cursor-pointer ${
        repo.status === "failed" ? "border-error-container" : "border-outline-variant hover:border-outline"
      }`}
    >
      {/* Indexing Progress Bar */}
      {repo.status === "indexing" && (
        <div className="absolute top-0 left-0 h-1 bg-surface-container-highest w-full">
          <div
            className={`h-full bg-inverse-primary transition-all duration-1000 ease-in-out ${
              repo.indexingStage === "connecting"
                ? "w-1/4"
                : repo.indexingStage === "chunking"
                  ? "w-1/2"
                  : repo.indexingStage === "embedding"
                    ? "w-[75%]"
                    : "w-[90%]"
            }`}
          ></div>
        </div>
      )}

      {/* Card Header */}
      <div className="flex justify-between items-start mb-4 mt-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-fixed-dim">
              code
            </span>
          </div>
          <div>
            <h4 className="font-body-lg text-body-lg font-medium text-on-surface transition-colors">
              <a
                href={repo.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                {repo.repoName}
              </a>
            </h4>
          </div>
        </div>

        {/* Status Badges */}
        {repo.status === "ready" && (
          <span className="inline-flex items-center rounded-full bg-surface-container-highest px-2.5 py-1 text-[11px] font-label-md text-on-surface-variant border border-outline-variant/50">
            <span className="w-1.5 h-1.5 rounded-full bg-surface-tint mr-1.5"></span>
            Ready
          </span>
        )}

        {repo.status === "indexing" && (
          <span className="inline-flex items-center rounded-full bg-surface-container-low px-2.5 py-1 text-[11px] font-label-md text-inverse-primary border border-outline-variant/50 animate-pulse font-semibold">
            <span className="material-symbols-outlined mr-1 animate-spin" style={{ fontSize: "14px" }}>sync</span>
            Indexing
          </span>
        )}

        {repo.status === "pending" && (
          <span className="inline-flex items-center rounded-full bg-surface-container-highest px-2.5 py-1 text-[11px] font-label-md text-outline border border-outline-variant/50 font-medium">
            Pending
          </span>
        )}

        {repo.status === "failed" && (
          <span className="inline-flex items-center rounded-full bg-error-container/20 px-2.5 py-1 text-[11px] font-label-md text-error border border-error/30 font-medium">
            Failed
          </span>
        )}
      </div>

      {/* Languages Array */}
      {repo.languages && repo.languages.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6 mt-1">
          {repo.languages.map((lang) => (
            <span
              key={lang}
              className="px-2 py-0.5 bg-surface-container border border-outline-variant/30 rounded text-[10px] text-on-surface-variant font-medium font-mono"
            >
              {lang}
            </span>
          ))}
        </div>
      )}

      {/* Detail Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-4 border-t border-outline-variant/30 mt-auto">
        <div>
          <p className="text-[11px] text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Branch</p>
          <p className="font-mono-code text-mono-code text-on-surface bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/50 inline-block text-xs font-semibold">
            {repo.defaultBranch}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Visibility</p>
          <p className="font-label-md text-label-md text-on-surface text-xs font-semibold capitalize">{repo.visibility}</p>
        </div>

        {/* Bottom row containing status information and redirect button */}
        <div className="col-span-2 flex items-center justify-between min-h-[32px] pt-2">
          <div className="flex-1 min-w-0">
            {repo.status === "indexing" && (
              <div className="flex justify-between items-end pr-2">
                <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Stage</p>
                <p className="font-mono-code text-[11px] text-on-surface font-semibold capitalize">
                  {repo.indexingStage || "starting..."}
                </p>
              </div>
            )}
            {repo.status === "pending" && (
              <p className="text-[12px] text-outline font-label-md flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>schedule</span>
                Waiting in queue...
              </p>
            )}
            {repo.status === "failed" && (
              <p className="text-[12px] text-error font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>error_outline</span>
                Ingestion Failed
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {repo.status === "failed" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRetry(repo);
                }}
                className="py-1 px-3 rounded bg-surface-container-high border border-outline-variant hover:border-outline text-xs font-semibold text-on-surface flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>replay</span>
                Retry Sync
              </button>
            )}
            <a
              href={repo.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-surface-container-high border border-outline-variant hover:border-outline text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer flex items-center justify-center"
              title="Open GitHub Repository"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
