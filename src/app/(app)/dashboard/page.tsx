"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import Sidebar from "@/components/dashboard/Sidebar";
import RepositoryCard from "@/components/dashboard/RepositoryCard";

import type { Repository as DBRepository } from "@/src/models/Repository";
import type { Document } from "mongoose";

type Repository = Omit<DBRepository, keyof Document> & {
  _id: string;
};

import { addGithubUrlSchema } from "@/src/validations/addGithubUrlSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type FormInputs = z.infer<typeof addGithubUrlSchema>;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();


  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchQuery, setSearchQuery] = useState("");


  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addingRepo, setAddingRepo] = useState(false);
  const [addRepoError, setAddRepoError] = useState("");


  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>({
    resolver: zodResolver(addGithubUrlSchema),
  });


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


  const handleAddRepository = async (data: FormInputs) => {
    setAddingRepo(true);
    setAddRepoError("");

    try {
      const response = await axios.post("/api/repositories", {
        githubUrl: data.githubUrl.trim(),
      });
      if (response.data && response.data.success) {
        reset();
        setIsAddModalOpen(false);
        fetchRepositories();
      } else {
        setAddRepoError(response.data.message || "Failed to add repository");
      }
    } catch (error: any) {
      setAddRepoError(
        error.response?.data?.message || "An error occurred. Please verify your repository URL."
      );
    } finally {
      setAddingRepo(false);
    }
  };


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
        {/* TopNavBar */}
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
              onClick={() => setIsAddModalOpen(true)}
              className="text-sm font-label-md text-label-md px-3 py-1.5 rounded-md border border-outline-variant bg-surface hover:bg-surface-container-high transition-colors cursor-pointer text-on-surface font-medium"
            >
              Add Repository
            </button>
            <img
              alt="User Profile"
              src={session.user.avatarUrl}
              className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant object-cover"
            />
          </div>
        </header>

        {/* Main Canvas Area */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <div className="max-w-[1400px] space-y-8">

            {/* Connected Repositories Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-2xl font-bold tracking-tight text-on-surface">Connected Repositories</h3>
              </div>

              {filteredRepos.length === 0 ? (
                <div className="flex flex-col py-16 px-6 items-center justify-center text-center bg-surface border border-outline-variant rounded-[16px] border-dashed">
                  <span className="material-symbols-outlined text-4xl text-outline mb-3">source</span>
                  <h4 className="text-body-lg font-medium text-on-surface">No repositories connected</h4>
                  <p className="text-sm text-on-surface-variant mt-1 mb-6 max-w-sm">Connect your GitHub projects to index classes, references, and start conversing with your code.</p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="py-2 px-4 rounded-lg bg-on-surface text-background font-semibold hover:bg-primary transition-all duration-200 cursor-pointer flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
                    Connect Repository
                  </button>
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
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setAddRepoError("");
                reset();
              }}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold text-on-surface mb-2">Connect Repository</h3>
            <p className="text-sm text-on-surface-variant mb-6">Enter a public or private GitHub repository URL to scan and ingest.</p>

            <form onSubmit={handleSubmit(handleAddRepository)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">GitHub URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/owner/repository"
                  {...register("githubUrl")}
                  className="w-full bg-[#1b1b1e] border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-surface-bright transition-colors placeholder:text-on-surface-variant/40 font-semibold"
                />
                {errors.githubUrl && (
                  <p className="text-xs text-error mt-1 font-medium">{errors.githubUrl.message}</p>
                )}
              </div>

              {addRepoError && (
                <div className="text-xs text-error bg-error-container/10 border border-error/20 p-3 rounded-lg flex items-start gap-2 font-medium">
                  <span className="material-symbols-outlined text-sm mt-0.5" style={{ fontSize: "16px" }}>warning</span>
                  <span>{addRepoError}</span>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setAddRepoError("");
                    reset();
                  }}
                  className="px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors text-sm font-semibold cursor-pointer text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingRepo}
                  className="px-4 py-2 rounded-lg bg-on-surface text-background hover:bg-primary transition-colors text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {addingRepo ? (
                    <>
                      <span className="material-symbols-outlined animate-spin" style={{ fontSize: "18px" }}>sync</span>
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

}