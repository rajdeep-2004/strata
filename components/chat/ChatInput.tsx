"use client";

import type { Repository } from "@/src/types/repository";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (e?: React.FormEvent) => void;
  isSending: boolean;
  repository: Repository;
}

export default function ChatInput({
  input,
  setInput,
  onSend,
  isSending,
  repository,
}: ChatInputProps) {
  return (
    <div className="p-6 bg-[#0B0B0C] border-t border-outline-variant/50 flex justify-center z-10">
      <form onSubmit={onSend} className="max-w-4xl w-full relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={`Ask anything about ${repository.repoName}... (Press Enter to send, Shift+Enter for newline)`}
          rows={2}
          className="w-full bg-[#1b1b1e] border border-outline-variant focus:border-surface-bright rounded-xl pl-4 pr-12 py-3.5 text-[14px] text-on-surface focus:outline-none transition-colors placeholder:text-on-surface-variant/45 resize-none font-body-md font-medium shadow-2xl"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-on-surface text-background hover:bg-primary transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
        >
          <span className="material-symbols-outlined text-[18px] font-bold">arrow_upward</span>
        </button>
      </form>
    </div>
  );
}
