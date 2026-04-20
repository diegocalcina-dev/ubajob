"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { create } from "zustand";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: Toast[];
  add: (message: string, type?: ToastType) => void;
  remove: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = "success") => {
    const id = `t-${Date.now()}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

const icons = { success: CheckCircle, error: XCircle, info: Info };
const styles = {
  success: "bg-white border-green-200 text-green-700",
  error: "bg-white border-red-200 text-red-600",
  info: "bg-white border-primary/20 text-primary",
};

export function ToastContainer() {
  const { toasts, remove } = useToast();
  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-[0_4px_24px_rgba(0,0,0,0.12)] pointer-events-auto",
              "animate-in slide-in-from-bottom-4 fade-in duration-300 min-w-64 max-w-sm",
              styles[t.type]
            )}
          >
            <Icon size={16} className="shrink-0" />
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button onClick={() => remove(t.id)} className="opacity-50 hover:opacity-100 transition-opacity">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
