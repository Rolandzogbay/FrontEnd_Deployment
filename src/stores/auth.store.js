import { defineStore } from "pinia";
import { authService } from "@/services/authServices";

function normalizeAuthPayload(payload = {}) {
  const user = payload.user || null;
  const business = payload.business || user?.business || null;

  return {
    user,
    business,
  };
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: null,
    business: null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || "",
    businessName: (state) => state.business?.name || "",
    userRole: (state) => state.user?.role || "",
    userAvatar: (state) =>
      state.user?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        state.user?.name || "User"
      )}&background=f97316&color=fff`,
    accountType: (state) =>
      state.business?.is_personal ? "personal" : "business",
    isPersonalWorkspace: (state) => !!state.business?.is_personal,
  },

  actions: {
    setToken(token) {
      this.token = token || "";

      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    },

    setAuthData(payload = {}) {
      const { user, business } = normalizeAuthPayload(payload);

      this.user = user;
      this.business = business;

      if (this.user) {
        localStorage.setItem("user", JSON.stringify(this.user));
      } else {
        localStorage.removeItem("user");
      }

      if (this.business) {
        localStorage.setItem("business", JSON.stringify(this.business));
      } else {
        localStorage.removeItem("business");
      }
    },

    loadStoredAuth() {
      try {
        this.user = JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        this.user = null;
      }

      try {
        this.business = JSON.parse(localStorage.getItem("business") || "null");
      } catch {
        this.business = null;
      }

      // fallback: if user exists and already contains business, sync it
      if (!this.business && this.user?.business) {
        this.business = this.user.business;
        localStorage.setItem("business", JSON.stringify(this.business));
      }
    },

    clearAuthData() {
      this.token = "";
      this.user = null;
      this.business = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("business");
    },

    async register(payload) {
      this.loading = true;
      try {
        const { data } = await authService.signup(payload);
        return data;
      } finally {
        this.loading = false;
      }
    },

    async login(email, password) {
      this.loading = true;

      try {
        const { data } = await authService.login({ email, password });

        if (data?.token) {
          this.setToken(data.token);
        }

        if (data?.user || data?.business) {
          this.setAuthData(data);
        }

        return data;
      } finally {
        this.loading = false;
      }
    },

    async fetchProfile() {
      if (!this.token) return null;

      this.loading = true;

      try {
        const { data } = await authService.getProfile();

        this.setAuthData({
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            avatar_url: data.avatar_url || "",
            role: data.role || "",
            email_verified: data.email_verified ?? false,
            business: data.business || null,
          },
          business: data.business || null,
        });

        return data;
      } catch (error) {
        if (error?.response?.status === 401) {
          this.clearAuthData();
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(email) {
      this.loading = true;
      try {
        const { data } = await authService.forgotPassword(email);
        return data;
      } finally {
        this.loading = false
      }
    },
    async resetPassword(payload) {
      this.loading = true
      try {
        const { data } = await authService.resetPassword(payload);
        return data;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await authService.logOut();
      } catch (error) {
        console.error("Logout request failed:", error);
      } finally {
        this.clearAuthData();
      }
    },

    async resendVerificationEmail(email) {
      const { data } = await authService.resendVerificationEmail(email);
      return data;
    },

    updateLocalUser(patch = {}) {
      this.user = {
        ...(this.user || {}),
        ...patch,
      };

      if (this.user) {
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },

    updateLocalBusiness(patch = {}) {
      this.business = {
        ...(this.business || {}),
        ...patch,
      };

      if (this.business) {
        localStorage.setItem("business", JSON.stringify(this.business));
      }

      if (this.user) {
        this.user = {
          ...this.user,
          business: this.business,
        };
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },
  },
});