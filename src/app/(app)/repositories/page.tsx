"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/components/dashboard/Sidebar";
import RepositoryCard from "@/components/dashboard/RepositoryCard";
import Header from "@/components/dashboard/Header";
import AddRepositoryModal from "@/components/dashboard/AddRepositoryModal";
import type { Repository } from "@/src/types/repository";

export default function RepositoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchRepositories = async () => {
    try {
      const response = await axios.get("/api/repositories");
      if (response.data && response.data.success) {
        setRepositories(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchRepositories();
    }
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const hasActiveIndexing = repositories.some(
      (repo) => repo.status === "indexing" || repo.status === "pending"
    );

    if (hasActiveIndexing) {
      const interval = setInterval(fetchRepositories, 5000);
      return () => clearInterval(interval);
    }
  }, [repositories, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return null;
  }


  const handleRetryIndexing = async (repo: Repository) => {
    try {
      await axios.post(`/api/repositories/${repo._id}/reindex`, {
        repositoryId: repo._id,
      });

      setRepositories((prev) =>
        prev.map((r) => r._id === repo._id ? { ...r, status: "indexing", indexingStage: "connecting" } : r)
      );
      fetchRepositories();
    } catch (error) {
      console.error("Failed to retry indexing:", error);
    }
  };

  const filteredRepos = repositories.filter((repo) =>
    repo.repoName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-background text-on-surface">
      <Sidebar />

      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddRepositoryClick={() => setIsAddModalOpen(true)}
        />

        {/* Main Canvas Area */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <div className="max-w-[1400px] space-y-8">
            
            {/* Repositories Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-on-surface">Connected Repositories</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Manage and sync your connected codebase namespaces.</p>
                </div>
              </div>

              {filteredRepos.length === 0 ? (
                <div className="flex flex-col py-16 px-6 items-center justify-center text-center bg-surface border border-outline-variant rounded-[16px] border-dashed">
                  <span className="material-symbols-outlined text-4xl text-outline mb-3">source</span>
                  <h4 className="text-body-lg font-medium text-on-surface">No repositories found</h4>
                  {searchQuery ? (
                    <p className="text-sm text-on-surface-variant mt-1 max-w-sm">No repositories match your search filter "{searchQuery}".</p>
                  ) : (
                    <>
                      <p className="text-sm text-on-surface-variant mt-1 mb-6 max-w-sm">Connect your GitHub projects to index classes, references, and start conversing with your code.</p>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="py-2.5 px-4 rounded-lg bg-on-surface text-background font-semibold hover:bg-primary transition-all duration-200 cursor-pointer flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
                        Connect Repository
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRepos.map((repo) => (
                    <RepositoryCard
                      key={repo._id}
                      repo={repo}
                      onRetry={handleRetryIndexing}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Repository Modal */}
      <AddRepositoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchRepositories}
      />
    </div>
  );
}