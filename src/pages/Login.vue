<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
    <div
      class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100">
      <!-- Left: Brand / Illustration -->
      <div
        class="relative hidden md:block overflow-hidden bg-linear-to-br from-[#f97316] via-[#fb923c] to-[#fdba74] p-8 text-white lg:p-10">
        <div
          class="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.85),transparent_55%)]">
        </div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/15 blur-2xl">
        </div>

        <div class="relative">
          <div class="inline-flex items-center gap-2 rounded-2xl bg-white/15 border border-white/20 px-4 py-2">
            <span class="grid place-items-center w-8 h-8 rounded-xl bg-white/15">
              <i class="fa-solid fa-boxes-stacked"></i>
            </span>
            <div class="leading-tight">
              <p class="font-extrabold">Check it NaNa</p>
              <p class="text-xs text-white/80">Inventory & Sales Tracker</p>
            </div>
          </div>

          <h1 class="mt-10 text-4xl font-extrabold tracking-tight">
            Welcome back.
          </h1>
          <p class="mt-4 text-white/90 text-base leading-relaxed">
            Sign in to manage products, track sales, monitor stock, and keep your workspace organized.
          </p>

          <div class="mt-10 bg-white/10 border border-white/15 rounded-3xl p-8">
            <svg width="260" height="220" viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="120" cy="110" r="95" fill="white" fill-opacity="0.18" />
              <rect x="70" y="78" width="120" height="72" rx="16" fill="white" fill-opacity="0.22" />
              <rect x="92" y="102" width="76" height="20" rx="8" fill="white" fill-opacity="0.75" />
              <circle cx="130" cy="114" r="22" fill="white" fill-opacity="0.75" />
              <path d="M130 128c-8 0-16-5-16-11h32c0 6-8 11-16 11Zm0-22a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z" fill="white"
                fill-opacity="0.9" />
            </svg>

            <p class="mt-4 text-lg text-white/80 leading-relaxed">
              Stay consistent with daily updates so your inventory, low-stock alerts, and sales records remain accurate.
            </p>
          </div>

          <div class="mt-8 space-y-3 text-sm">
            <div class="flex items-center gap-3 text-white/85">
              <span class="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
                <i class="fa-solid fa-shield-halved"></i>
              </span>
              <span>Secure login for business and personal workspaces</span>
            </div>
            <div class="flex items-center gap-3 text-white/85">
              <span class="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
                <i class="fa-solid fa-chart-line"></i>
              </span>
              <span>Designed to help you stay on top of stock and sales</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Login Form -->
      <div class="p-8 sm:p-10 flex flex-col justify-center">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">Sign in</p>
            <h2 class="mt-2 md:text-4xl text-2xl font-extrabold tracking-tight text-slate-900">
              Access your account
            </h2>
            <p class="mt-2 text-sm text-slate-500">
              Enter your details to continue to your dashboard.
            </p>
          </div>

          <router-link to="/signup"
            class="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:border-orange-200 hover:bg-orange-50">
            <i class="fa-solid fa-user-plus"></i>
            Sign Up
          </router-link>
        </div>

        <form @submit.prevent="handleLogin" class="mt-8 space-y-5">
          <!-- Email -->
          <div>
            <label for="email" class="field-label">Email Address</label>
            <div class="input-wrap">
              <i class="fa-solid fa-envelope input-ico"></i>
              <input v-model="form.email" type="email" id="email" name="email" placeholder="example@gmail.com"
                class="input" :disabled="isSubmitting" autocomplete="email" required />
            </div>
            <p v-if="fieldErrors.email" class="err">{{ fieldErrors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="field-label">Password</label>
            <div class="input-wrap">
              <i class="fa-solid fa-lock input-ico"></i>
              <input :type="showPassword ? 'text' : 'password'" v-model="form.password" id="password" name="password"
                placeholder="Enter your password" class="input pr-12" :disabled="isSubmitting"
                autocomplete="current-password" required />
              <button type="button" @click="showPassword = !showPassword" tabindex="-1" class="eye-btn"
                :disabled="isSubmitting" aria-label="Toggle password visibility">
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <p v-if="fieldErrors.password" class="err">
              {{ fieldErrors.password }}
            </p>
          </div>

          <!-- Remember + Forgot -->
          <div class="flex items-center justify-between gap-4">
            <label class="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" v-model="form.remember"
                class="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                :disabled="isSubmitting" />
              <span>Remember me</span>
            </label>

            <router-link to="/forgot-password"
              class="text-sm font-semibold text-orange-700 hover:text-orange-800 hover:underline">
              Forgot password?
            </router-link>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-primary w-full" :disabled="isSubmitting">
            <span v-if="!isSubmitting" class="inline-flex items-center">
              Login
              <i class="fa-solid fa-arrow-right ml-2"></i>
            </span>
            <span v-else class="inline-flex items-center gap-2">
              <span class="spinner"></span>
              Signing in...
            </span>
          </button>
        </form>

        <div v-if="statusMessage" class="mt-4 rounded-2xl px-4 py-3 text-sm border" :class="statusType === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-red-200 bg-red-50 text-red-600'">
          {{ statusMessage }}
        </div>

        <div class="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?
          <router-link to="/signup" class="text-orange-700 font-extrabold hover:underline">
            Create one
          </router-link>
        </div>

        <p class="mt-6 text-sm text-slate-400 text-center">
          Secure login • Built for businesses and personal inventory use
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "vue-toast-notification";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const form = ref({
  email: "",
  password: "",
  remember: false,
});

const showPassword = ref(false);
const isSubmitting = ref(false);

const statusMessage = ref("");
const statusType = ref("error");

const fieldErrors = reactive({
  email: "",
  password: "",
});

function clearErrors() {
  fieldErrors.email = "";
  fieldErrors.password = "";
  statusMessage.value = "";
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email || "").trim());
}

function resolveRedirectPath() {
  if (route.query.redirect) return route.query.redirect;

  if (auth.userRole === "system_admin") return "/admin";

  return "/dashboard";
}

onMounted(() => {
  const verified = route.query.verified;

  if (verified === "1") {
    toast.success("Your account has been verified. You can now log in.");
  } else if (verified === "expired") {
    toast.error("That verification link has expired.");
  } else if (verified === "0") {
    toast.error("That verification link is invalid.");
  } else if (route.query.reset === "success") {
    toast.success("Password reset successful. You can now log in.");
  }
});

async function handleLogin() {
  clearErrors();
  statusType.value = "error";

  let valid = true;

  if (!form.value.email || !form.value.email.trim()) {
    fieldErrors.email = "Email is required.";
    valid = false;
  } else if (!validateEmail(form.value.email)) {
    fieldErrors.email = "Invalid email format.";
    valid = false;
  }

  if (!form.value.password) {
    fieldErrors.password = "Password is required.";
    valid = false;
  }

  if (!valid) return;

  isSubmitting.value = true;

  try {
    const data = await auth.login(form.value.email.trim(), form.value.password);

    statusType.value = "success";
    statusMessage.value =
      data?.message ||
      "Login successful.";

    toast.success("Login successful");

    router.replace(resolveRedirectPath());
  } catch (err) {
    const msg = err?.response?.data?.message || "Login failed.";
    console.error("Login error:", err?.response?.data || err);
    toast.error(msg);
    statusMessage.value = msg;
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped></style>