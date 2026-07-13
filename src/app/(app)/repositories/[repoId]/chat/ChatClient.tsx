"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/components/dashboard/Sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import EmptyState from "@/components/chat/EmptyState";
import ChatInput from "@/components/chat/ChatInput";
import { saveMessageAction } from "./actions";
import { Repository } from "@/src/types/repository";
import type { Message } from "@/src/types/message";

interface ChatClientProps {
  repository: Repository;
  initialMessages: Message[];
  sessionUser: {
    avatarUrl?: string;
    name?: string | null;
  };
}

export default function ChatClient({ repository, initialMessages, sessionUser }: ChatClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages or sending state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Handle send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (repository.status !== "ready") return;

    const queryText = input.trim();
    if (!queryText || isSending) return;

    setInput("");
    setIsSending(true);

    const userMessage: Message = { role: "user", content: queryText };

    // Update UI immediately
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Save User Message to DB via Server Action
      await saveMessageAction(repository._id, "user", queryText);

      // Call the existing Chat API route
      const response = await axios.post(`/api/repositories/${repository._id}/chat`, {
        query: queryText,
        githubRepoId: repository.githubRepoId,
      });

      if (response.data && response.data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: response.data.answer,
        };

        // Save Assistant Message to DB via Server Action
        await saveMessageAction(repository._id, "assistant", response.data.answer);

        // Update UI with response
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(response.data.message || "Failed to get AI answer");
      }
    } catch (error: unknown) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-on-surface font-body-md">
      <Sidebar />

      <div className="flex-1 ml-[260px] flex flex-col h-screen bg-[#0B0B0C] relative overflow-hidden">
        <ChatHeader repository={repository} onBack={() => router.push("/dashboard")} />

        {/* Expansive Chat Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar bg-[#0B0B0C]">
          {messages.length === 0 ? (
            <EmptyState repository={repository} />
          ) : (
            <MessageList
              messages={messages}
              isSending={isSending}
              sessionUser={sessionUser}
              messagesEndRef={messagesEndRef}
            />
          )}
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSendMessage}
          isSending={isSending}
          repository={repository}
        />
      </div>
    </div>
  );
}
