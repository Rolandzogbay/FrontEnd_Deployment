<template>
  <header class="fixed inset-x-0 top-0 z-[100] border-b border-orange-100/80 bg-white/95 backdrop-blur-xl shadow-sm">
    <nav class="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
      <!-- Brand -->
      <RouterLink to="/" class="group flex min-w-0 items-center gap-3">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200 transition-transform duration-300 group-hover:scale-105"
        >
          <i class="fa-solid fa-boxes-stacked text-lg"></i>
        </div>

        <div class="min-w-0">
          <h1 class="truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
            Check it NaNa
          </h1>
          <p class="hidden truncate text-xs font-medium text-slate-500 sm:block">
            Smart inventory for modern businesses
          </p>
        </div>
      </RouterLink>

      <!-- Desktop Nav -->
      <div class="hidden items-center gap-2 lg:flex">
        <a
          v-for="item in navLinks"
          :key="item.label"
          :href="item.to"
          class="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600"
        >
          {{ item.label }}
        </a>

        <div class="ml-3">
          <template v-if="!auth.isAuthenticated">
            <RouterLink to="/signup">
              <Button
                class="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500"
              >
                Get Started
              </Button>
            </RouterLink>
          </template>

          <template v-else>
            <RouterLink :to="dashboardPath">
              <Button
                class="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500"
              >
                Go to Dashboard
              </Button>
            </RouterLink>
          </template>
        </div>
      </div>

      <!-- Mobile Toggle -->
      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:border-orange-200 hover:text-orange-600 lg:hidden"
        @click="mobileMenuOpen = !mobileMenuOpen"
        aria-label="Toggle navigation menu"
        :aria-expanded="mobileMenuOpen"
      >
        <i :class="mobileMenuOpen ? 'fa-solid fa-xmark text-xl' : 'fa-solid fa-bars text-xl'"></i>
      </button>
    </nav>

    <!-- Mobile Menu -->
    <transition name="fade-slide">
      <div
        v-if="mobileMenuOpen"
        class="border-t border-orange-100 bg-white/95 shadow-lg backdrop-blur-xl lg:hidden"
      >
        <div class="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-5 md:px-6">
          <div class="flex flex-col gap-2">
            <a
              v-for="item in navLinks"
              :key="item.label"
              :href="item.to"
              class="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-600"
              @click="closeMobileMenu"
            >
              {{ item.label }}
            </a>
          </div>

          <div class="mt-4">
            <template v-if="!auth.isAuthenticated">
              <RouterLink to="/signup" @click="closeMobileMenu">
                <Button
                  class="w-full rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:bg-orange-500"
                >
                  Get Started
                </Button>
              </RouterLink>

              <p class="mt-3 text-center text-sm text-slate-500">
                Already have an account?
                <RouterLink
                  to="/login"
                  class="font-semibold text-orange-600 transition hover:text-orange-500"
                  @click="closeMobileMenu"
                >
                  Log in
                </RouterLink>
              </p>
            </template>

            <template v-else>
              <RouterLink :to="dashboardPath" @click="closeMobileMenu">
                <Button
                  class="w-full rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:bg-orange-500"
                >
                  Go to Dashboard
                </Button>
              </RouterLink>

              <p class="mt-3 text-center text-sm text-slate-500">
                You’re already signed in.
              </p>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import Button from "@/components/Button.vue";

const auth = useAuthStore();
const mobileMenuOpen = ref(false);

const navLinks = [
  { label: "Features", to: "#features" },
  { label: "Pricing", to: "#pricing" },
  { label: "Testimonials", to: "#testimonials" },
  { label: "Contact", to: "#contact" },
];

const dashboardPath = computed(() =>
  auth.user?.role === "system_admin" ? "/admin" : "/dashboard"
);

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

function handleResize() {
  if (window.innerWidth >= 1024) {
    mobileMenuOpen.value = false;
  }
}

function handleEscape(event) {
  if (event.key === "Escape") {
    mobileMenuOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  window.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("keydown", handleEscape);
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.22s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>