"use client";

import React from "react";
import MessageBubble from "./MessageBubble";
import type { Message } from "@/src/types/message";

interface MessageListProps {
  messages: Message[];
  isSending: boolean;
  sessionUser: {
    avatarUrl?: string;
    name?: string | null;
  };
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessageList({
  messages,
  isSending,
  sessionUser,
  messagesEndRef,
}: MessageListProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} sessionUser={sessionUser} />
      ))}

      {isSending && (
        <div className="flex gap-4 justify-start">
          <div className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center shrink-0 self-start mt-1">
            <span className="material-symbols-outlined text-primary text-[18px] animate-pulse">psychology</span>
          </div>
          <div className="bg-surface border border-outline-variant/60 rounded-2xl px-5 py-4 text-sm shadow-md flex items-center gap-3">
            <span className="material-symbols-outlined animate-spin text-[18px] text-primary">sync</span>
            <span className="text-on-surface-variant font-medium tracking-wide">Searching codebase and generating response...</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
