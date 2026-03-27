<template>
  <div>
    <!-- Mobile Overlay -->
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[2px] lg:hidden"
        @click="$emit('close')" />
    </transition>

    <!-- Sidebar -->
    <aside :class="[
      'fixed top-0 left-0 z-50 h-dvh bg-white border-r border-slate-200 shadow-xl transition-transform duration-300 ease-in-out',
      'w-[280px] sm:w-[300px] lg:w-72',
      open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">
      <div class="flex h-full min-h-0 flex-col">
        <!-- Header -->
        <div class="shrink-0 border-b border-slate-200 bg-white px-4 sm:px-5 py-4 sm:py-5">
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <div
                class="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
                <i class="fa-solid fa-cubes text-base sm:text-lg"></i>
              </div>

              <div class="min-w-0">
                <p class="mb-1 text-xs sm:text-sm font-medium leading-none text-slate-400">
                  Control Panel
                </p>
                <h2 class="truncate text-lg sm:text-xl font-bold text-slate-800">
                  {{ superAdmin ? "System Owner" : "Business Admin" }}
                </h2>
              </div>
            </div>

            <button type="button"
              class="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
              @click="$emit('close')">
              <i class="fa-solid fa-xmark text-lg sm:text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Nav -->
        <nav class="sidebar-scroll flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-4 sm:py-5">
          <div v-if="superAdmin" class="space-y-5 sm:space-y-6">
            <section>
              <p class="section-title">Overview</p>
              <ul class="space-y-1.5">
                <li v-for="item in superAdminOverviewLinks" :key="item.to">
                  <RouterLink :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }"
                    @click="handleLinkClick">
                    <span class="nav-icon">
                      <i :class="item.icon"></i>
                    </span>
                    <span class="truncate">{{ item.label }}</span>
                  </RouterLink>
                </li>
              </ul>
            </section>

            <section>
              <p class="section-title">Management</p>
              <ul class="space-y-1.5">
                <li v-for="item in superAdminManagementLinks" :key="item.to">
                  <RouterLink :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }"
                    @click="handleLinkClick">
                    <span class="nav-icon">
                      <i :class="item.icon"></i>
                    </span>
                    <span class="truncate">{{ item.label }}</span>
                  </RouterLink>
                </li>
              </ul>
            </section>

            <section>
              <p class="section-title">Platform</p>
              <ul class="space-y-1.5">
                <li v-for="item in superAdminPlatformLinks" :key="item.to">
                  <RouterLink :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }"
                    @click="handleLinkClick">
                    <span class="nav-icon">
                      <i :class="item.icon"></i>
                    </span>
                    <span class="truncate">{{ item.label }}</span>
                  </RouterLink>
                </li>
              </ul>
            </section>
          </div>

          <div v-else class="space-y-5 sm:space-y-6">
            <section>
              <p class="section-title">Overview</p>
              <ul class="space-y-1.5">
                <li v-for="item in businessAdminOverviewLinks" :key="item.to">
                  <RouterLink :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }"
                    @click="handleLinkClick">
                    <span class="nav-icon">
                      <i :class="item.icon"></i>
                    </span>
                    <span class="truncate">{{ item.label }}</span>
                  </RouterLink>
                </li>
              </ul>
            </section>

            <section>
              <p class="section-title">Sales & Stock</p>
              <ul class="space-y-1.5">
                <li v-for="item in businessAdminOperationsLinks" :key="item.to">
                  <RouterLink :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }"
                    @click="handleLinkClick">
                    <span class="nav-icon">
                      <i :class="item.icon"></i>
                    </span>
                    <span class="truncate">{{ item.label }}</span>
                  </RouterLink>
                </li>
              </ul>
            </section>

            <section>
              <p class="section-title">People & Insights</p>
              <ul class="space-y-1.5">
                <li v-for="item in businessAdminPeopleLinks" :key="item.to">
                  <RouterLink :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }"
                    @click="handleLinkClick">
                    <span class="nav-icon">
                      <i :class="item.icon"></i>
                    </span>
                    <span class="truncate">{{ item.label }}</span>
                  </RouterLink>
                </li>
              </ul>
            </section>
          </div>

          <div class="mt-4 sm:mt-5 border-t border-slate-200 pt-4">
            <RouterLink to="/settings" class="nav-link" :class="{ active: isActive('/settings') }"
              @click="handleLinkClick">
              <span class="nav-icon">
                <i class="fa-solid fa-gear"></i>
              </span>
              <span class="truncate">Settings</span>
            </RouterLink>
          </div>
        </nav>

        <!-- Footer -->
        <div class="shrink-0 border-t border-slate-200 bg-white px-3 sm:px-4 py-3 sm:py-4">
          <button type="button" @click="logout"
            class="flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-orange-600 px-4 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-orange-700 active:scale-[0.99]">
            <i class="fa-solid fa-right-from-bracket text-sm"></i>
            <span class="truncate">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  superAdmin: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const superAdminOverviewLinks = [
  { label: "Dashboard", icon: "fa-solid fa-gauge", to: "/admin" },
  { label: "Reports", icon: "fa-solid fa-chart-line", to: "/system/reports" },
];

const superAdminManagementLinks = [
  { label: "Businesses", icon: "fa-solid fa-building", to: "/businesses" },
  { label: "Users", icon: "fa-solid fa-users", to: "/users" },
  { label: "System Admins", icon: "fa-solid fa-user-shield", to: "/admins" },
];

const superAdminPlatformLinks = [
  { label: "Revenue", icon: "fa-solid fa-coins", to: "/system/revenue" },
  { label: "Notifications", icon: "fa-solid fa-bell", to: "/system/notifications" },
  { label: "Purchase Orders", icon: "fa-solid fa-bag-shopping", to: "/system/purchase-orders" },
  { label: "Audit Logs", icon: "fa-solid fa-shield-halved", to: "/system/logs" },
  { label: "System Health", icon: "fa-solid fa-server", to: "/system/health" },
];

const businessAdminOverviewLinks = [
  { label: "Dashboard", icon: "fa-solid fa-gauge", to: "/dashboard" },
  { label: "Inventory", icon: "fa-solid fa-warehouse", to: "/inventory" },
];

const businessAdminOperationsLinks = [
  { label: "Products", icon: "fa-solid fa-box", to: "/products" },
  { label: "Sales", icon: "fa-solid fa-chart-line", to: "/sales" },
  { label: "Purchase Orders", icon: "fa-solid fa-bag-shopping", to: "/purchase-orders" },
  { label: "Suppliers", icon: "fa-solid fa-truck", to: "/suppliers" },
];

const businessAdminPeopleLinks = [
  { label: "Customers", icon: "fa-solid fa-users", to: "/customers" },
  { label: "Reports", icon: "fa-solid fa-file-lines", to: "/reports" },
];

const lockBodyScroll = (shouldLock) => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  if (window.innerWidth < 1024) {
    document.body.style.overflow = shouldLock ? "hidden" : "";
  } else {
    document.body.style.overflow = "";
  }
};

watch(
  () => props.open,
  (isOpen) => {
    lockBodyScroll(isOpen);
  },
  { immediate: true }
);

watch(
  () => route.fullPath,
  () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      emit("close");
    }
  }
);

const handleResize = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  document.body.style.overflow = window.innerWidth >= 1024 ? "" : props.open ? "hidden" : "";
};

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("resize", handleResize);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleResize);
  }
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});

const handleLinkClick = () => {
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    emit("close");
  }
};

const logout = async () => {
  const ok = window.confirm("Are you sure you want to logout?");
  if (!ok) return;

  try {
    await auth.logout();
  } finally {
    router.replace("/login");
  }
};

const isActive = (path) => {
  if (path === "/") return route.path === "/";
  return route.path === path || route.path.startsWith(`${path}/`);
};
</script>

<style scoped>
.section-title {
  padding: 0 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #94a3b8;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: 100%;
  padding: 0.8rem 0.95rem;
  border-radius: 1rem;
  color: #334155;
  font-weight: 600;
  font-size: 0.98rem;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: #fff7ed;
  color: #ea580c;
}

.nav-link.active {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #ffffff;
  box-shadow: 0 10px 30px -12px rgba(249, 115, 22, 0.55);
}

.nav-icon {
  width: 1.2rem;
  display: inline-flex;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-scroll::-webkit-scrollbar {
  width: 6px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background: #fdba74;
  border-radius: 999px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>