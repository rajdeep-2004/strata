"use client";

import React from "react";
import type { Message } from "@/src/types/message";

interface MessageBubbleProps {
  message: Message;
  sessionUser: {
    avatarUrl?: string;
    name?: string | null;
  };
}

export default function MessageBubble({ message, sessionUser }: MessageBubbleProps) {
  return (
    <div
      className={`flex gap-4 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.role === "assistant" && (
        <div className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center shrink-0 self-start mt-1">
          <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl p-5 border text-sm shadow-md leading-relaxed ${
          message.role === "user"
            ? "bg-surface-container-high border-outline-variant text-[#e4e1e5]"
            : "bg-surface border-outline-variant/60 text-on-surface"
        }`}
      >
        <p className="whitespace-pre-wrap font-body-md text-[14px] leading-relaxed">{message.content}</p>
      </div>

      {message.role === "user" && sessionUser.avatarUrl && (
        <img
          alt="User profile"
          src={sessionUser.avatarUrl}
          className="w-8 h-8 rounded-full border border-outline-variant object-cover shrink-0 self-start mt-1"
        />
      )}
    </div>
  );
}
