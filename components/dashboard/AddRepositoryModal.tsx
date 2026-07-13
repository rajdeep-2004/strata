"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { addGithubUrlSchema } from "@/src/validations/addGithubUrlSchema";

type FormInputs = z.infer<typeof addGithubUrlSchema>;

interface AddRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddRepositoryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddRepositoryModalProps) {
  const [addingRepo, setAddingRepo] = useState(false);
  const [addRepoError, setAddRepoError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>({
    resolver: zodResolver(addGithubUrlSchema),
  });

  if (!isOpen) return null;

  const handleAddRepository = async (data: FormInputs) => {
    setAddingRepo(true);
    setAddRepoError("");

    try {
      const response = await axios.post("/api/repositories", {
        githubUrl: data.githubUrl.trim(),
      });
      if (response.data && response.data.success) {
        reset();
        onClose();
        onSuccess();
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

  const handleClose = () => {
    setAddRepoError("");
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden">
        <button
          onClick={handleClose}
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
              onClick={handleClose}
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
  );
}
