import { isTokenExpired } from '@/lib/jwt';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  userPermissions: string[];
  isAuthenticated: boolean;
  login: (user: User, token: string, permissions?: string[]) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      userPermissions: [],
      isAuthenticated: false,
      login: (user, token, permissions = []) => {
        // Chỉ chạy localStorage khi ở trình duyệt
        if (typeof window !== 'undefined') {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("userPermissions", JSON.stringify(permissions));
        }
        set({ user, token, userPermissions: permissions, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          localStorage.removeItem("userPermissions");
        }
        set({ user: null, token: null, userPermissions: [], isAuthenticated: false });
      },
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      // Dùng storage an toàn
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : dummyStorage)),
      onRehydrateStorage: () => (state) => {
        if (state?.token && isTokenExpired(state.token)) {
          state.logout();
        }
      },
    }
  )
);

// Fallback storage cho môi trường Server lúc build
const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};