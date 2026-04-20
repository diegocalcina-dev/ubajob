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

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: "candidate" | "employer") => void;
  logout: () => void;

  // Jobs
  jobs: Job[];
  savedJobs: string[];
  toggleSaveJob: (jobId: string) => void;

  // Applications
  applications: Application[];
  applyToJob: (jobId: string, coverLetter?: string) => void;

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
      login: (email, role) => {
        const user = mockUsers.find((u) => u.role === role) ?? {
          id: "demo-" + role,
          name: role === "candidate" ? "Lucas Ferreira" : "Fernanda Costa",
          email,
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          createdAt: new Date().toISOString(),
        };
        set({ currentUser: user, isAuthenticated: true });
      },
      logout: () => set({ currentUser: null, isAuthenticated: false }),

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
      name: "ubajob-store",
      partialize: (s) => ({
        currentUser: s.currentUser,
        isAuthenticated: s.isAuthenticated,
        savedJobs: s.savedJobs,
        theme: s.theme,
      }),
    }
  )
);
