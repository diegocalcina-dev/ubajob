"use client";
import { Bell, Briefcase, MessageSquare, Waves, CheckCheck } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { formatRelativeDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Notification } from "@/lib/types";

const iconMap: Record<Notification["type"], React.ElementType> = {
  new_job: Briefcase,
  application_update: Bell,
  new_message: MessageSquare,
  job_expiring: Briefcase,
  seasonal: Waves,
};

const colorMap: Record<Notification["type"], string> = {
  new_job: "bg-primary/10 text-primary",
  application_update: "bg-accent/20 text-accent-500",
  new_message: "bg-blue-100 text-blue-600",
  job_expiring: "bg-amber-100 text-amber-600",
  seasonal: "bg-orange-100 text-orange-600",
};

export default function NotificacoesPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Notificações</h1>
          {unread > 0 && <p className="text-sm text-gray-500">{unread} não lidas</p>}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-700 transition-colors"
          >
            <CheckCheck size={15} /> Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((n) => {
          const Icon = iconMap[n.type];
          const color = colorMap[n.type];
          return (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={cn(
                "flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-[0_2px_12px_rgba(0,0,0,0.07)]",
                n.read
                  ? "bg-white border-sand-200"
                  : "bg-primary/5 border-primary/20"
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", color)}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className={cn("text-sm font-semibold", n.read ? "text-gray-800" : "text-gray-900")}>{n.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{n.body}</p>
                <p className="text-xs text-gray-300 mt-1.5">{formatRelativeDate(n.createdAt)}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
