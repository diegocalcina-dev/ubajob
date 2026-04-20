"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  User, Job, Application, Conversation, Notification,
  CandidateProfile, EmployerProfile,
} from "@/lib/types";
import {
  mockUsers, mockJobs, mockApplications, mockConversations,
  mockNotifications, mockCandidateProfiles, mockEmployerProfiles,
} from "@/lib/mock-data";
import { api } from "@/lib/api";

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, role: "candidate" | "employer") => void;
  loginWithApi: (email: string, password: string) => Promise<void>;
  registerWithApi: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;

  // Jobs
  jobs: Job[];
  savedJobs: string[];
  toggleSaveJob: (jobId: string) => void;

  // Applications
  applications: Application[];
  applyToJob: (jobId: string, coverLetter?: string) => void;
  applyToJobApi: (jobId: string, coverLetter?: string) => Promise<void>;

  // Conversations
  conversations: Conversation[];
  sendMessage: (conversationId: string, text: string) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Profiles
  candidateProfiles: CandidateProfile[];
  employerProfiles: EmployerProfile[];

  // UI
  theme: "light" | "dark";
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,
      token: null,

      login: (email, role) => {
        const user = mockUsers.find((u) => u.role === role) ?? {
          id: "demo-" + role,
          name: role === "candidate" ? "Lucas Ferreira" : "Fernanda Costa",
          email,
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          createdAt: new Date().toISOString(),
        };
        set({ currentUser: user, isAuthenticated: true, token: null });
      },

      loginWithApi: async (email, password) => {
        const res = await api.auth.login({ email, password });
        const me = await api.users.me();
        const user: User = {
          id: me.id,
          name: me.name,
          email: me.email,
          role: me.role as "candidate" | "employer",
          avatar: me.avatar ?? undefined,
          createdAt: me.createdAt,
        };
        set({ currentUser: user, isAuthenticated: true, token: res.access_token });
      },

      registerWithApi: async (name, email, password, role) => {
        const res = await api.auth.register({ name, email, password, role });
        const me = await api.users.me();
        const user: User = {
          id: me.id,
          name: me.name,
          email: me.email,
          role: me.role as "candidate" | "employer",
          avatar: me.avatar ?? undefined,
          createdAt: me.createdAt,
        };
        set({ currentUser: user, isAuthenticated: true, token: res.access_token });
      },

      logout: () => set({ currentUser: null, isAuthenticated: false, token: null }),

      // Jobs
      jobs: mockJobs,
      savedJobs: [],
      toggleSaveJob: (jobId) => {
        const { savedJobs } = get();
        if (savedJobs.includes(jobId)) {
          set({ savedJobs: savedJobs.filter((id) => id !== jobId) });
        } else {
          set({ savedJobs: [...savedJobs, jobId] });
        }
      },

      // Applications
      applications: mockApplications,
      applyToJob: (jobId, coverLetter) => {
        const { currentUser, applications, jobs } = get();
        if (!currentUser) return;
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return;
        const existing = applications.find(
          (a) => a.jobId === jobId && a.candidateId === currentUser.id
        );
        if (existing) return;
        const newApp: Application = {
          id: `app-${Date.now()}`,
          jobId,
          jobTitle: job.title,
          employerName: job.employerName,
          employerLogo: job.employerLogo,
          candidateId: currentUser.id,
          candidateName: currentUser.name,
          candidateAvatar: currentUser.avatar,
          status: "Aplicada",
          appliedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          coverLetter,
          matchScore: job.matchScore,
        };
        set({
          applications: [...applications, newApp],
          jobs: jobs.map((j) =>
            j.id === jobId ? { ...j, applications: j.applications + 1 } : j
          ),
        });
      },

      applyToJobApi: async (jobId, coverLetter) => {
        const newApp = await api.applications.apply(jobId, coverLetter);
        const { applications } = get();
        set({ applications: [...applications, newApp] });
      },

      // Conversations
      conversations: mockConversations,
      sendMessage: (conversationId, text) => {
        const { conversations, currentUser } = get();
        if (!currentUser) return;
        const msg = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId: currentUser.id,
          text,
          sentAt: new Date().toISOString(),
          read: false,
        };
        set({
          conversations: conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, msg], lastMessage: text, lastMessageAt: msg.sentAt }
              : c
          ),
        });
      },

      // Notifications
      notifications: mockNotifications,
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      // Profiles
      candidateProfiles: mockCandidateProfiles,
      employerProfiles: mockEmployerProfiles,

      // UI
      theme: "light",
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === "light" ? "dark" : "light";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", next === "dark");
          }
          return { theme: next };
        }),
      searchQuery: "",
      setSearchQuery: (q) => set({ searchQuery: q }),
    }),
    {
      name: "ubajob-storage",
      partialize: (s) => ({
        currentUser: s.currentUser,
        isAuthenticated: s.isAuthenticated,
        savedJobs: s.savedJobs,
        theme: s.theme,
        token: s.token,
      }),
    }
  )
);
