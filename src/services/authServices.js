import api from "./api";

const authService = {
  signup(payload) {
    const isFormData = payload instanceof FormData;

    return api.post("/auth/register", payload, isFormData ? {} : undefined);
  },

  login(payload) {
    return api.post("/auth/login", payload);
  },

  logOut() {
    return api.post("/auth/logout");
  },

  resendVerificationEmail(email) {
    return api.post("/auth/resend-verification", { email });
  },

  getProfile() {
    return api.get("/profile/me");
  },
};

export { authService };