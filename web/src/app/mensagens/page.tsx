"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, MessageSquare, ArrowLeft } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { formatRelativeDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function MensagensPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated, conversations, sendMessage } = useAppStore();
  const [activeConv, setActiveConv] = useState<string | null>(
    conversations.length > 0 ? null : null // mobile começa na lista
  );
  const [text, setText] = useState("");

  if (!isAuthenticated) {
    router.replace("/auth/login");
    return null;
  }

  const conv = conversations.find((c) => c.id === activeConv);

  function handleSend() {
    if (!text.trim() || !activeConv) return;
    sendMessage(activeConv, text.trim());
    setText("");
  }

  function openConversation(id: string) {
    setActiveConv(id);
  }

  function backToList() {
    setActiveConv(null);
  }

  const ConversationList = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sand-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Conversas</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare size={28} className="text-sand-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Sem conversas ainda.</p>
          </div>
        ) : (
          conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => openConversation(c.id)}
              className={cn(
                "w-full text-left flex gap-3 p-4 border-b border-sand-50 hover:bg-sand-50 transition-colors",
                activeConv === c.id && "bg-primary/5 border-l-4 border-primary"
              )}
            >
              <img
                src={
                  currentUser?.role === "candidate"
                    ? (c.employerLogo ?? `https://api.dicebear.com/7.x/shapes/svg?seed=${c.employerId}`)
                    : (c.candidateAvatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.candidateId}`)
                }
                alt=""
                className="w-10 h-10 rounded-full bg-sand-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {currentUser?.role === "candidate" ? c.employerName : c.candidateName}
                </p>
                <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
                <p className="text-xs text-gray-300 mt-0.5">{formatRelativeDate(c.lastMessageAt)}</p>
              </div>
              {c.unread > 0 && (
                <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0 mt-1">
                  {c.unread}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );

  const ChatArea = conv ? (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-4 border-b border-sand-100">
        {/* Botão voltar — só visível em mobile */}
        <button
          onClick={backToList}
          className="md:hidden p-1.5 -ml-1 text-gray-500 hover:text-primary transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <img
          src={currentUser?.role === "candidate"
            ? (conv.employerLogo ?? `https://api.dicebear.com/7.x/shapes/svg?seed=${conv.employerId}`)
            : (conv.candidateAvatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.candidateId}`)}
          alt=""
          className="w-9 h-9 rounded-full bg-sand-100"
        />
        <div>
          <p className="font-semibold text-sm text-gray-900">
            {currentUser?.role === "candidate" ? conv.employerName : conv.candidateName}
          </p>
          <p className="text-xs text-gray-400">{conv.jobTitle}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conv.messages.map((msg) => {
          const isMine = msg.senderId === currentUser?.id;
          return (
            <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm",
                isMine
                  ? "bg-primary text-white rounded-br-sm"
                  : "bg-sand-100 text-gray-800 rounded-bl-sm"
              )}>
                {msg.text}
                <p className={cn("text-xs mt-1 opacity-60", isMine ? "text-right" : "")}>
                  {new Date(msg.sentAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-sand-100 flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Escreva uma mensagem..."
          className="flex-1 px-4 py-3 rounded-xl border border-sand-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-sand-50"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-600 transition-colors disabled:opacity-40 shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  ) : (
    <div className="flex-1 hidden md:flex items-center justify-center">
      <div className="text-center">
        <MessageSquare size={40} className="text-sand-300 mx-auto mb-3" />
        <p className="text-gray-500 font-semibold">Selecione uma conversa</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Mensagens</h1>

      <div className="bg-white rounded-2xl border border-sand-200 shadow-[0_2px_20px_rgba(0,0,0,0.07)] overflow-hidden" style={{ height: "70vh" }}>

        {/* Desktop: lista + chat lado a lado */}
        <div className="hidden md:flex h-full">
          <div className="w-72 shrink-0 border-r border-sand-100 flex flex-col">
            {ConversationList}
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            {ChatArea}
          </div>
        </div>

        {/* Mobile: ou lista ou chat, nunca os dois */}
        <div className="flex md:hidden h-full flex-col">
          {activeConv ? ChatArea : ConversationList}
        </div>
      </div>
    </div>
  );
}
