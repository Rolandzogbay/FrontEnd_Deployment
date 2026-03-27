<template>
  <div class="min-h-screen bg-slate-50">
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="true" />

    <div class="min-h-screen flex flex-col lg:pl-72">
      <!-- Header -->
      <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div class="mx-auto max-w-[1800px]">
            <div class="flex flex-col gap-4">
              <div class="flex items-start sm:items-center justify-between gap-3">
                <div class="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <button
                    class="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50"
                    @click="sidebarOpen = true" aria-label="Open sidebar">
                    <i class="fa-solid fa-bars"></i>
                  </button>

                  <div class="min-w-0">
                    <p class="truncate text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
                      System Control Center
                    </p>
                    <p class="mt-1 truncate text-sm sm:text-base text-slate-500">
                      Platform-wide visibility into businesses, users, revenue, operations, and growth
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div
                    class="hidden sm:flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-2">
                    <span class="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span class="text-xs font-semibold text-orange-700">
                      {{ autoRefreshEnabled ? "Live updates on" : "Live updates off" }}
                    </span>
                  </div>

                  <button @click="toggleAutoRefresh"
                    class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50"
                    :aria-label="autoRefreshEnabled ? 'Turn off live updates' : 'Turn on live updates'">
                    <i :class="autoRefreshEnabled ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
                  </button>

                  <button @click="refreshDashboard"
                    class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50"
                    aria-label="Refresh dashboard">
                    <i class="fa-solid fa-rotate-right" :class="{ 'animate-spin': loadingDashboard }"></i>
                  </button>

                  <div class="relative">
                    <button
                      class="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50"
                      @click="toggleNotifications" aria-label="Notifications">
                      <i class="fa-solid fa-bell"></i>
                      <span v-if="unreadNotificationsCount > 0"
                        class="absolute -right-1 -top-1 min-w-[1.15rem] h-[1.15rem] px-1 rounded-full border-2 border-white bg-orange-500 text-[10px] font-bold text-white grid place-items-center">
                        {{ unreadNotificationsCount }}
                      </span>
                    </button>

                    <div v-if="showNotifications"
                      class="absolute right-0 mt-3 w-[92vw] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                      <div class="border-b border-orange-100 bg-orange-50 px-4 py-4">
                        <div class="flex items-center justify-between gap-3">
                          <div>
                            <p class="text-sm font-bold text-slate-900">Platform Alerts</p>
                            <p class="text-xs text-slate-500">Notifications, low stock alerts, and system events</p>
                          </div>
                          <button class="text-xs font-semibold text-orange-600 hover:text-orange-700"
                            @click="clearNotifications">
                            Clear
                          </button>
                        </div>
                      </div>

                      <ul class="max-h-96 overflow-y-auto">
                        <li v-if="notificationsLoading" class="px-4 py-8 text-sm text-slate-500">
                          Loading alerts...
                        </li>

                        <li v-for="n in filteredNotifications" :key="n.id"
                          class="cursor-pointer border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50"
                          :class="n.is_read ? 'bg-white' : 'bg-orange-50/50'" @click="markNotificationRead(n.id)">
                          <p class="text-sm font-semibold text-slate-900">{{ n.title || "Notification" }}</p>
                          <p class="mt-1 text-sm text-slate-600">{{ n.message }}</p>
                          <p class="mt-1 text-xs text-slate-400">{{ formatRelativeTime(n.createdAt) }}</p>
                        </li>

                        <li v-if="!notificationsLoading && filteredNotifications.length === 0"
                          class="px-4 py-10 text-center text-sm text-slate-500">
                          No alerts available
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div
                    class="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-sm">
                    <i class="fa-solid fa-user-shield text-sm"></i>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-3">
                <div class="relative">
                  <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input v-model="searchQuery" type="text" placeholder="Search businesses, users, activities..."
                    class="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-100" />
                </div>

                <select v-model="range"
                  class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100">
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>

                <button @click="exportSummary"
                  class="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-orange-600 hover:to-orange-700">
                  <i class="fa-solid fa-file-export"></i>
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="px-4 sm:px-6 lg:px-8 py-6">
        <div class="mx-auto max-w-[1800px] space-y-6">
          <div v-if="errorMessage"
            class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
            {{ errorMessage }}
          </div>

          <div v-if="loadingDashboard && !hasLoadedOnce"
            class="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div class="mx-auto h-12 w-12 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin">
            </div>
            <p class="mt-4 text-sm text-slate-500">Loading dashboard...</p>
          </div>

          <template v-else>
            <section class="grid grid-cols-1 2xl:grid-cols-[1.45fr_.95fr] gap-5 items-start">
              <div class="admin-hero">
                <div class="grid grid-cols-1 xl:grid-cols-[1.25fr_.95fr] gap-6">
                  <div>
                    <p class="text-xs font-extrabold uppercase tracking-[0.28em] text-orange-200">
                      System overview
                    </p>
                    <h1 class="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">
                      Good {{ greetingPart }}, {{ currentUserName }}
                    </h1>
                    <p class="mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-7 text-slate-200">
                      Monitor platform growth, business performance, operational risk, and financial activity from one
                      executive dashboard.
                    </p>

                    <div class="mt-6 flex flex-wrap gap-3">
                      <button class="hero-primary" @click="goTo('/super-admin/reports')">
                        <i class="fa-solid fa-chart-line"></i>
                        Reports
                      </button>

                      <button class="hero-secondary" @click="goTo('/super-admin/businesses')">
                        <i class="fa-solid fa-building"></i>
                        Businesses
                      </button>

                      <button class="hero-secondary" @click="goTo('/super-admin/users')">
                        <i class="fa-solid fa-users"></i>
                        Users
                      </button>
                    </div>

                    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div v-for="(insight, i) in roleInsights" :key="i"
                        class="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                        <p class="text-sm font-semibold text-orange-100">{{ insight.title }}</p>
                        <p class="mt-2 text-2xl font-black tracking-tight text-white">{{ insight.value }}</p>
                        <p class="mt-1 text-xs text-slate-300">{{ insight.note }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-3 self-start">
                    <MiniControlCard label="Businesses" :value="stats.totalBusinesses" icon="fa-solid fa-building" />
                    <MiniControlCard label="Users" :value="stats.totalUsers" icon="fa-solid fa-users" />
                    <MiniControlCard label="Unread Alerts" :value="unreadNotificationsCount" icon="fa-solid fa-bell" />
                    <MiniControlCard label="PO Records" :value="stats.totalPurchaseOrders"
                      icon="fa-solid fa-file-invoice" />
                  </div>
                </div>
              </div>

              <div class="control-card">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="text-2xl font-black tracking-tight text-slate-950">Quick Actions</h3>
                    <p class="mt-1 text-sm text-slate-500">Fast access to core administrative sections.</p>
                  </div>
                  <div class="grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-orange-600">
                    <i class="fa-solid fa-bolt"></i>
                  </div>
                </div>

                <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button class="action-card" @click="goTo('/super-admin/businesses')">
                    <div class="action-icon bg-orange-100 text-orange-700">
                      <i class="fa-solid fa-building"></i>
                    </div>
                    <p class="action-title">Businesses</p>
                    <p class="action-text">Manage all registered businesses.</p>
                  </button>

                  <button class="action-card" @click="goTo('/super-admin/users')">
                    <div class="action-icon bg-orange-100 text-orange-700">
                      <i class="fa-solid fa-users"></i>
                    </div>
                    <p class="action-title">Users</p>
                    <p class="action-text">Monitor and manage user accounts.</p>
                  </button>

                  <button class="action-card" @click="goTo('/super-admin/system-admins')">
                    <div class="action-icon bg-orange-100 text-orange-700">
                      <i class="fa-solid fa-user-shield"></i>
                    </div>
                    <p class="action-title">System Admins</p>
                    <p class="action-text">Control system-level administrators.</p>
                  </button>

                  <button class="action-card" @click="goTo('/super-admin/audit-logs')">
                    <div class="action-icon bg-orange-100 text-orange-700">
                      <i class="fa-solid fa-clipboard-list"></i>
                    </div>
                    <p class="action-title">Audit Logs</p>
                    <p class="action-text">Review platform-wide activities.</p>
                  </button>
                </div>
              </div>
            </section>

            <section class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5">
              <ExecutiveKpiCard title="Total Businesses" :value="stats.totalBusinesses"
                :subValue="`+${stats.newBusinessesInRange} this range`" icon="fa-solid fa-building" tone="orange"
                :sparkSeries="spark.businesses" />
              <ExecutiveKpiCard title="Total Users" :value="stats.totalUsers"
                :subValue="`+${stats.newUsersInRange} this range`" icon="fa-solid fa-users" tone="slate"
                :sparkSeries="spark.users" />
              <ExecutiveKpiCard title="Platform Revenue" :value="formatMoney(stats.totalRevenue)"
                :subValue="`${stats.totalSales} total sales`" icon="fa-solid fa-coins" tone="green"
                :sparkSeries="spark.revenue" />
              <ExecutiveKpiCard title="Low Stock Items" :value="stats.lowStockItems"
                :subValue="`${stats.outOfStockItems} out of stock`" icon="fa-solid fa-triangle-exclamation" tone="rose"
                :sparkSeries="spark.lowStock" />
            </section>

            <section class="grid grid-cols-1 2xl:grid-cols-3 gap-5 items-start">
              <div class="control-card 2xl:col-span-2">
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h3 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                      Platform Movement
                    </h3>
                    <p class="mt-1 text-sm sm:text-base text-slate-500">
                      Revenue, business creation, and user growth over time
                    </p>
                  </div>
                  <span class="soft-pill">{{ rangeLabel }}</span>
                </div>

                <div class="mt-5">
                  <VueApexCharts v-if="hasLoadedOnce && growthSeries.length" type="area" height="320"
                    :options="growthOptions" :series="growthSeries" />
                  <div v-else
                    class="grid h-[320px] place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                    No movement data available
                  </div>
                </div>

                <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div class="mini-panel">
                    <p class="mini-label">New Businesses</p>
                    <p class="mini-value">+{{ stats.newBusinessesInRange }}</p>
                    <p class="mini-text">within selected range</p>
                  </div>
                  <div class="mini-panel">
                    <p class="mini-label">Average Sale Value</p>
                    <p class="mini-value">{{ formatMoney(stats.averageSaleValue) }}</p>
                    <p class="mini-text">platform average</p>
                  </div>
                  <div class="mini-panel">
                    <p class="mini-label">Purchase Orders</p>
                    <p class="mini-value">{{ stats.totalPurchaseOrders }}</p>
                    <p class="mini-text">all recorded orders</p>
                  </div>
                </div>
              </div>

              <div class="space-y-5">
                <div class="control-card">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <h3 class="text-2xl font-black tracking-tight text-slate-950">Payment Methods</h3>
                      <p class="mt-1 text-sm text-slate-500">Sales by payment type</p>
                    </div>
                    <span class="soft-pill">Live</span>
                  </div>

                  <div class="mt-5">
                    <VueApexCharts v-if="hasLoadedOnce && hasSalesData" type="donut" height="250"
                      :options="paymentOptions" :series="paymentSeries" />
                    <div v-else
                      class="grid h-[250px] place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                      No sales data available
                    </div>
                  </div>
                </div>

                <div class="control-card">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <h3 class="text-2xl font-black tracking-tight text-slate-950">PO Status</h3>
                      <p class="mt-1 text-sm text-slate-500">Purchase order breakdown</p>
                    </div>
                    <span class="soft-pill">Monitor</span>
                  </div>

                  <div class="mt-5">
                    <VueApexCharts v-if="hasLoadedOnce && hasPurchaseOrdersData" type="bar" height="220"
                      :options="purchaseOrderBarOptions" :series="purchaseOrderBarSeries" />
                    <div v-else
                      class="grid h-[220px] place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                      No purchase order data available
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section class="control-card">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h3 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                    Top Performing Businesses
                  </h3>
                  <p class="mt-1 text-sm sm:text-base text-slate-500">
                    Revenue contribution by business
                  </p>
                </div>
                <span class="soft-pill">Top 6</span>
              </div>

              <div class="mt-5">
                <VueApexCharts v-if="hasLoadedOnce && revenuePerBusiness.length" type="bar" height="280"
                  :options="revenueBusinessOptions" :series="revenueBusinessSeries" />
                <div v-else
                  class="grid h-[240px] place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                  No revenue per business data available
                </div>
              </div>
            </section>

            <section class="grid grid-cols-1 2xl:grid-cols-3 gap-5 items-start">
              <div class="control-card 2xl:col-span-2 overflow-hidden">
                <div class="flex items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                      Newest Businesses
                    </h3>
                    <p class="mt-1 text-sm sm:text-base text-slate-500">
                      Top 6 newest business registrations
                    </p>
                  </div>

                  <button class="text-sm font-semibold text-orange-600 hover:text-orange-700"
                    @click="goTo('/super-admin/businesses')">
                    See all
                  </button>
                </div>

                <div class="mt-5 hidden lg:block overflow-x-auto">
                  <table class="min-w-full text-sm">
                    <thead>
                      <tr class="bg-slate-50 text-left">
                        <th class="rounded-l-2xl px-4 py-3 font-bold text-slate-600">Business</th>
                        <th class="px-4 py-3 font-bold text-slate-600">Owner</th>
                        <th class="px-4 py-3 font-bold text-slate-600">Email</th>
                        <th class="rounded-r-2xl px-4 py-3 font-bold text-slate-600">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="b in newestBusinesses" :key="b.id"
                        class="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50">
                        <td class="px-4 py-4">
                          <div class="flex items-center gap-3">
                            <div class="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                              <i class="fa-solid fa-building"></i>
                            </div>
                            <div class="min-w-0">
                              <p class="truncate font-semibold text-slate-900">{{ b.name || "Unnamed business" }}</p>
                              <p class="truncate text-xs text-slate-400">ID #{{ b.id }}</p>
                            </div>
                          </div>
                        </td>
                        <td class="px-4 py-4 text-slate-600">{{ b.owner_name || "N/A" }}</td>
                        <td class="px-4 py-4 text-slate-600">{{ b.email || "N/A" }}</td>
                        <td class="px-4 py-4 text-slate-600">{{ formatDate(b.createdAt) }}</td>
                      </tr>

                      <tr v-if="newestBusinesses.length === 0">
                        <td colspan="4" class="px-4 py-10 text-center text-sm text-slate-400">
                          No businesses found
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="mt-5 grid grid-cols-1 gap-3 lg:hidden">
                  <div v-for="b in newestBusinesses" :key="b.id"
                    class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div class="flex items-start gap-3">
                      <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-100 text-orange-600">
                        <i class="fa-solid fa-building"></i>
                      </div>

                      <div class="min-w-0 flex-1">
                        <p class="truncate font-semibold text-slate-900">{{ b.name || "Unnamed business" }}</p>
                        <p class="mt-1 text-sm text-slate-500">Owner: {{ b.owner_name || "N/A" }}</p>
                        <p class="truncate text-sm text-slate-500">Email: {{ b.email || "N/A" }}</p>
                        <p class="mt-1 text-xs text-slate-400">Created {{ formatDate(b.createdAt) }}</p>
                      </div>
                    </div>
                  </div>

                  <div v-if="newestBusinesses.length === 0"
                    class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
                    No businesses found
                  </div>
                </div>
              </div>

              <div class="space-y-5">
                <div class="control-card">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <h3 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                        Recent Activity
                      </h3>
                      <p class="mt-1 text-sm text-slate-500">
                        Top 6 latest platform actions
                      </p>
                    </div>

                    <button class="text-sm font-semibold text-orange-600 hover:text-orange-700"
                      @click="goTo('/super-admin/audit-logs')">
                      View logs
                    </button>
                  </div>

                  <ul class="mt-5 space-y-3">
                    <li v-for="l in recentActivityTop" :key="l.id"
                      class="rounded-2xl border border-slate-200 p-4 transition hover:border-orange-200 hover:bg-orange-50/30">
                      <div class="flex items-start gap-3">
                        <div
                          class="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                          <i class="fa-solid fa-clock-rotate-left"></i>
                        </div>
                        <div class="min-w-0">
                          <p class="font-semibold text-slate-900">{{ l.title }}</p>
                          <p class="mt-1 text-sm text-slate-500">{{ l.meta }}</p>
                        </div>
                      </div>
                    </li>

                    <li v-if="recentActivityTop.length === 0"
                      class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
                      No activity found
                    </li>
                  </ul>
                </div>

                <div class="control-card">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p class="text-sm font-bold text-slate-900">System Snapshot</p>
                      <p class="mt-1 text-xs text-slate-500">Current live entity totals</p>
                    </div>
                    <div class="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-orange-600">
                      <i class="fa-solid fa-wave-square"></i>
                    </div>
                  </div>

                  <div class="mt-4 grid grid-cols-2 gap-3">
                    <div class="rounded-2xl border border-slate-200 bg-white p-3">
                      <p class="text-xs text-slate-500">Products</p>
                      <p class="mt-1 text-xl font-black text-slate-900">{{ stats.totalProducts }}</p>
                    </div>
                    <div class="rounded-2xl border border-slate-200 bg-white p-3">
                      <p class="text-xs text-slate-500">Customers</p>
                      <p class="mt-1 text-xl font-black text-slate-900">{{ stats.totalCustomers }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </template>

          <footer class="pb-8 text-center text-xs text-slate-400">
            © {{ new Date().getFullYear() }} Check it NaNa • System Administration
          </footer>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import SideBar from "@/components/SideBar.vue";
import VueApexCharts from "vue3-apexcharts";

const router = useRouter();

const rawBase = (import.meta.env.VITE_API_BASE_URL || "https://checkit-nana-api.up.railway.app").replace(/\/$/, "");
const API_BASE = rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`;

const ENDPOINTS = {
  businesses: `${API_BASE}/business`,
  users: `${API_BASE}/users`,
  sales: `${API_BASE}/sales`,
  products: `${API_BASE}/products`,
  notifications: `${API_BASE}/notifications`,
  purchaseOrders: `${API_BASE}/purchase-orders/all-purchaseorders`,
  customers: `${API_BASE}/customers`
};

const sidebarOpen = ref(false);
const searchQuery = ref("");
const showNotifications = ref(false);
const range = ref("30d");

const loadingDashboard = ref(false);
const notificationsLoading = ref(false);
const errorMessage = ref("");
const hasLoadedOnce = ref(false);
const autoRefreshEnabled = ref(false);

const businesses = ref([]);
const users = ref([]);
const sales = ref([]);
const products = ref([]);
const notifications = ref([]);
const purchaseOrders = ref([]);
const customers = ref([]);
const currentUser = ref(null);

const sectionErrors = ref({
  businesses: false,
  users: false,
  sales: false,
  products: false,
  notifications: false,
  purchaseOrders: false,
  customers: false
});

let pollingInterval = null;

const getToken = () => localStorage.getItem("token");

const axiosConfig = () => {
  const token = getToken();
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const normalizeListResponse = (data, keys = []) => {
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  const commonCollections = [
    "rows",
    "data",
    "result",
    "items",
    "payload",
    "businesses",
    "users",
    "sales",
    "products",
    "customers",
    "notifications",
    "orders",
    "purchaseOrders"
  ];

  for (const key of commonCollections) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  if (data?.data && typeof data.data === "object") {
    for (const key of keys) {
      if (Array.isArray(data.data?.[key])) return data.data[key];
    }
    for (const key of commonCollections) {
      if (Array.isArray(data.data?.[key])) return data.data[key];
    }
  }

  return [];
};

const safeGet = async (url, keys = [], sectionKey = "") => {
  try {
    const response = await axios.get(url, axiosConfig());
    sectionErrors.value[sectionKey] = false;
    return normalizeListResponse(response.data, keys);
  } catch (error) {
    console.error(`Failed loading ${sectionKey}:`, error?.response?.data || error.message);
    sectionErrors.value[sectionKey] = true;
    return [];
  }
};

const decodeUser = () => {
  try {
    const token = getToken();
    if (!token) return;
    const payload = JSON.parse(atob(token.split(".")[1]));
    currentUser.value = payload;
  } catch (error) {
    console.error("Failed to decode user token:", error);
    currentUser.value = null;
  }
};

const currentUserName = computed(() => {
  return currentUser.value?.name || currentUser.value?.full_name || "System Owner";
});

const getRangeDays = () => {
  if (range.value === "7d") return 7;
  if (range.value === "90d") return 90;
  return 30;
};

const rangeLabel = computed(() =>
  range.value === "7d" ? "Last 7 days" : range.value === "90d" ? "Last 90 days" : "Last 30 days"
);

const greetingPart = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
});

const withinSelectedRange = (dateValue) => {
  if (!dateValue) return false;
  const now = new Date();
  const then = new Date(dateValue);
  if (Number.isNaN(then.getTime())) return false;
  const diffMs = now - then;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= getRangeDays();
};

const fetchDashboardData = async (showLoader = true) => {
  if (showLoader) loadingDashboard.value = true;
  errorMessage.value = "";

  const [
    businessesData,
    usersData,
    salesData,
    productsData,
    notificationsData,
    purchaseOrdersData,
    customersData
  ] = await Promise.all([
    safeGet(ENDPOINTS.businesses, ["businesses"], "businesses"),
    safeGet(ENDPOINTS.users, ["users"], "users"),
    safeGet(ENDPOINTS.sales, ["sales"], "sales"),
    safeGet(ENDPOINTS.products, ["products"], "products"),
    safeGet(ENDPOINTS.notifications, ["notifications"], "notifications"),
    safeGet(ENDPOINTS.purchaseOrders, ["purchaseOrders", "orders"], "purchaseOrders"),
    safeGet(ENDPOINTS.customers, ["customers"], "customers")
  ]);

  businesses.value = businessesData;
  users.value = usersData;
  sales.value = salesData;
  products.value = productsData;
  notifications.value = notificationsData;
  purchaseOrders.value = purchaseOrdersData;
  customers.value = customersData;

  const failedCount = Object.values(sectionErrors.value).filter(Boolean).length;
  const coreLoaded =
    businesses.value.length > 0 ||
    users.value.length > 0 ||
    sales.value.length > 0 ||
    purchaseOrders.value.length > 0;

  if (failedCount > 0 && coreLoaded) {
    errorMessage.value = "Some dashboard sections could not be loaded properly. Available sections are still displayed.";
  } else if (failedCount > 0 && !coreLoaded) {
    errorMessage.value = "Unable to load dashboard data. Please confirm your route names and authorization token.";
  }

  loadingDashboard.value = false;
  hasLoadedOnce.value = true;
};

const refreshDashboard = async () => {
  await fetchDashboardData(true);
};

const startRealtime = () => {
  stopRealtime();
  if (!autoRefreshEnabled.value) return;

  pollingInterval = setInterval(async () => {
    await fetchDashboardData(false);
  }, 60000);
};

const stopRealtime = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

const toggleAutoRefresh = () => {
  autoRefreshEnabled.value = !autoRefreshEnabled.value;
  if (autoRefreshEnabled.value) startRealtime();
  else stopRealtime();
};

const fetchNotifications = async () => {
  notificationsLoading.value = true;
  try {
    const response = await axios.get(ENDPOINTS.notifications, axiosConfig());
    notifications.value = normalizeListResponse(response.data, ["notifications"]);
    sectionErrors.value.notifications = false;
  } catch (error) {
    sectionErrors.value.notifications = true;
    console.error("Failed to fetch notifications:", error?.response?.data || error.message);
  } finally {
    notificationsLoading.value = false;
  }
};

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) await fetchNotifications();
};

const clearNotifications = async () => {
  try {
    await axios.delete(ENDPOINTS.notifications, axiosConfig());
    notifications.value = [];
  } catch (error) {
    console.error("Failed to clear notifications:", error?.response?.data || error.message);
  }
};

const markNotificationRead = async (id) => {
  try {
    await axios.patch(`${ENDPOINTS.notifications}/${id}/read`, {}, axiosConfig());
    notifications.value = notifications.value.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
  } catch (error) {
    console.error("Failed to mark notification as read:", error?.response?.data || error.message);
  }
};

const goTo = (path) => {
  router.push(path);
};

const unreadNotificationsCount = computed(() =>
  notifications.value.filter((n) => !n.is_read).length
);

const filteredNotifications = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();
  if (!term) return notifications.value;

  return notifications.value.filter((n) => {
    const title = String(n.title || "").toLowerCase();
    const message = String(n.message || "").toLowerCase();
    return title.includes(term) || message.includes(term);
  });
});

const newestBusinesses = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();

  let result = [...businesses.value]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  if (!term) return result;

  return result.filter((b) => {
    const name = String(b.name || "").toLowerCase();
    const owner = String(b.owner_name || "").toLowerCase();
    const email = String(b.email || "").toLowerCase();
    return name.includes(term) || owner.includes(term) || email.includes(term);
  });
});

const recentActivity = computed(() => {
  const businessActivities = businesses.value.map((business) => ({
    id: `business-${business.id}`,
    title: "New business created",
    createdAt: business.createdAt,
    meta: `${business.name || "Business"} • ${formatRelativeTime(business.createdAt)}`
  }));

  const saleActivities = sales.value.map((sale) => ({
    id: `sale-${sale.id}`,
    title: "Sale recorded",
    createdAt: sale.createdAt || sale.sale_date,
    meta: `Sale #SAL${String(sale.id).padStart(4, "0")} • ${formatRelativeTime(sale.createdAt || sale.sale_date)}`
  }));

  const purchaseActivities = purchaseOrders.value.map((po) => ({
    id: `po-${po.id}`,
    title: "Purchase order created",
    createdAt: po.createdAt,
    meta: `${po.supplier_name || "Supplier"} • ${formatRelativeTime(po.createdAt)}`
  }));

  const userActivities = users.value.map((user) => ({
    id: `user-${user.id}`,
    title: "New user registered",
    createdAt: user.createdAt,
    meta: `${user.name || user.full_name || user.email || "User"} • ${formatRelativeTime(user.createdAt)}`
  }));

  return [...businessActivities, ...saleActivities, ...purchaseActivities, ...userActivities]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
});

const recentActivityTop = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();
  let result = recentActivity.value.slice(0, 6);

  if (!term) return result;

  return result.filter((a) => {
    const title = String(a.title || "").toLowerCase();
    const meta = String(a.meta || "").toLowerCase();
    return title.includes(term) || meta.includes(term);
  });
});

const stats = computed(() => {
  const totalRevenue = sales.value.reduce(
    (sum, sale) => sum + Number(sale.total_price || sale.total || sale.amount || 0),
    0
  );

  const lowStockItems = products.value.filter((product) => {
    const qty = Number(product.stock_quantity ?? product.stock ?? product.quantity ?? 0);
    const threshold = Number(product.low_stock_threshold ?? 10);
    return qty > 0 && qty <= threshold;
  }).length;

  const outOfStockItems = products.value.filter((product) => {
    const qty = Number(product.stock_quantity ?? product.stock ?? product.quantity ?? 0);
    return qty <= 0;
  }).length;

  const businessesInRange = businesses.value.filter((business) =>
    withinSelectedRange(business.createdAt)
  );

  const usersInRange = users.value.filter((user) =>
    withinSelectedRange(user.createdAt)
  );

  return {
    totalBusinesses: businesses.value.length,
    totalUsers: users.value.length,
    totalRevenue,
    totalSales: sales.value.length,
    totalProducts: products.value.length,
    totalCustomers: customers.value.length,
    totalPurchaseOrders: purchaseOrders.value.length,
    newBusinessesInRange: businessesInRange.length,
    newUsersInRange: usersInRange.length,
    averageSaleValue: sales.value.length ? totalRevenue / sales.value.length : 0,
    lowStockItems,
    outOfStockItems
  };
});

const roleInsights = computed(() => {
  const role = String(currentUser.value?.role || "").toLowerCase();

  if (role === "super_admin" || role === "system_owner") {
    return [
      {
        title: "Platform Growth",
        value: `${stats.value.totalBusinesses} businesses`,
        note: "Total registered businesses on the platform"
      },
      {
        title: "Revenue Health",
        value: formatMoney(stats.value.totalRevenue),
        note: "Total platform revenue across all sales"
      }
    ];
  }

  return [
    {
      title: "User Growth",
      value: `${stats.value.totalUsers} users`,
      note: "Current platform user count"
    },
    {
      title: "Activity Volume",
      value: `${recentActivityTop.value.length} recent events`,
      note: "Top visible events from the latest activity stream"
    }
  ];
});

const buildTimeBuckets = (days) => {
  const now = new Date();
  const buckets = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);

    buckets.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString([], { month: "short", day: "numeric" }),
      businesses: 0,
      users: 0,
      revenue: 0,
      lowStock: 0
    });
  }

  return buckets;
};

const timeSeriesBuckets = computed(() => {
  const days = getRangeDays();
  const buckets = buildTimeBuckets(days);
  const bucketMap = Object.fromEntries(buckets.map((b) => [b.key, b]));

  businesses.value.forEach((business) => {
    if (!business.createdAt) return;
    const key = new Date(business.createdAt).toISOString().slice(0, 10);
    if (bucketMap[key]) bucketMap[key].businesses += 1;
  });

  users.value.forEach((user) => {
    if (!user.createdAt) return;
    const key = new Date(user.createdAt).toISOString().slice(0, 10);
    if (bucketMap[key]) bucketMap[key].users += 1;
  });

  sales.value.forEach((sale) => {
    const dateValue = sale.createdAt || sale.sale_date;
    if (!dateValue) return;
    const key = new Date(dateValue).toISOString().slice(0, 10);
    if (bucketMap[key]) bucketMap[key].revenue += Number(sale.total_price || sale.total || sale.amount || 0);
  });

  products.value.forEach((product) => {
    const created = product.createdAt;
    if (!created) return;
    const key = new Date(created).toISOString().slice(0, 10);
    const qty = Number(product.stock_quantity ?? product.stock ?? product.quantity ?? 0);
    const threshold = Number(product.low_stock_threshold ?? 10);

    if (bucketMap[key] && qty > 0 && qty <= threshold) {
      bucketMap[key].lowStock += 1;
    }
  });

  return buckets;
});

const spark = computed(() => ({
  businesses: timeSeriesBuckets.value.map((b) => b.businesses),
  users: timeSeriesBuckets.value.map((b) => b.users),
  revenue: timeSeriesBuckets.value.map((b) => b.revenue),
  lowStock: timeSeriesBuckets.value.map((b) => b.lowStock)
}));

const growthSeries = computed(() => {
  if (!timeSeriesBuckets.value.length) return [];
  return [
    {
      name: "Revenue",
      data: timeSeriesBuckets.value.map((b) => b.revenue || 0)
    },
    {
      name: "New Businesses",
      data: timeSeriesBuckets.value.map((b) => b.businesses || 0)
    },
    {
      name: "New Users",
      data: timeSeriesBuckets.value.map((b) => b.users || 0)
    }
  ];
});

const growthOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
    foreColor: "#64748b"
  },
  colors: ["#f97316", "#10b981", "#0f172a"],
  stroke: { curve: "smooth", width: 3 },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(148,163,184,.16)",
    strokeDashArray: 4
  },
  xaxis: {
    categories: timeSeriesBuckets.value.map((b) => b.label),
    labels: { style: { colors: "#94a3b8", fontSize: "11px" } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { style: { colors: "#94a3b8", fontSize: "11px" } }
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    fontSize: "12px",
    labels: { colors: "#334155" }
  },
  tooltip: {
    theme: "light",
    y: {
      formatter: (value, { seriesIndex }) => (seriesIndex === 0 ? formatMoney(value) : `${value}`)
    }
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.24,
      opacityTo: 0.04,
      stops: [0, 90, 100]
    }
  }
}));

const paymentMethodCounts = computed(() => {
  const counts = { cash: 0, card: 0, mobile_money: 0 };

  sales.value.forEach((sale) => {
    const method = String(sale.payment_method || "").toLowerCase().trim();
    if (method === "cash") counts.cash += 1;
    else if (method === "card") counts.card += 1;
    else if (method.includes("mobile")) counts.mobile_money += 1;
  });

  return counts;
});

const paymentSeries = computed(() => [
  paymentMethodCounts.value.cash,
  paymentMethodCounts.value.card,
  paymentMethodCounts.value.mobile_money
]);

const paymentOptions = computed(() => ({
  labels: ["Cash", "Card", "Mobile Money"],
  colors: ["#f97316", "#fb923c", "#fdba74"],
  legend: {
    position: "bottom",
    fontSize: "12px"
  },
  dataLabels: { enabled: false },
  stroke: {
    width: 4,
    colors: ["#ffffff"]
  },
  plotOptions: {
    pie: {
      donut: {
        size: "68%"
      }
    }
  }
}));

const purchaseOrderStatusCounts = computed(() => {
  const counts = {
    pending: 0,
    received: 0,
    cancelled: 0
  };

  purchaseOrders.value.forEach((po) => {
    const status = String(po.status || "").toLowerCase().trim();
    if (status === "pending") counts.pending += 1;
    else if (status === "received") counts.received += 1;
    else if (status === "cancelled" || status === "canceled") counts.cancelled += 1;
  });

  return counts;
});

const purchaseOrderBarSeries = computed(() => [
  {
    name: "Purchase Orders",
    data: [
      purchaseOrderStatusCounts.value.pending,
      purchaseOrderStatusCounts.value.received,
      purchaseOrderStatusCounts.value.cancelled
    ]
  }
]);

const purchaseOrderBarOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  colors: ["#f97316"],
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "42%"
    }
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(148,163,184,.16)",
    strokeDashArray: 4
  },
  xaxis: {
    categories: ["Pending", "Received", "Cancelled"],
    labels: { style: { colors: "#64748b", fontSize: "12px" } }
  },
  yaxis: {
    labels: { style: { colors: "#64748b", fontSize: "12px" } }
  },
  tooltip: { theme: "light" }
}));

const revenuePerBusiness = computed(() => {
  const revenueMap = {};

  sales.value.forEach((sale) => {
    const businessKey =
      sale.businessId ||
      sale.business_id ||
      sale.BusinessId ||
      sale.business?.id ||
      sale.business?.name ||
      sale.business_name ||
      sale.businessName ||
      sale.Business?.name;

    const amount = Number(sale.total_price || sale.total || sale.amount || 0);
    if (!businessKey || amount <= 0) return;

    if (!revenueMap[businessKey]) {
      revenueMap[businessKey] = {
        key: businessKey,
        name: "Unknown Business",
        revenue: 0
      };
    }

    revenueMap[businessKey].revenue += amount;
  });

  businesses.value.forEach((business) => {
    const idKeys = [business.id, String(business.id)];
    idKeys.forEach((idKey) => {
      if (revenueMap[idKey]) {
        revenueMap[idKey].name = business.name || "Unnamed business";
      }
    });

    if (revenueMap[business.name]) {
      revenueMap[business.name].name = business.name || "Unnamed business";
    }
  });

  return Object.values(revenueMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);
});

const revenueBusinessSeries = computed(() => [
  {
    name: "Revenue",
    data: revenuePerBusiness.value.map((b) => Number(b.revenue || 0))
  }
]);

const revenueBusinessOptions = computed(() => ({
  chart: {
    toolbar: { show: false }
  },
  colors: ["#f97316"],
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "48%"
    }
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: "rgba(148,163,184,.16)",
    strokeDashArray: 4
  },
  xaxis: {
    categories: revenuePerBusiness.value.map((b) => b.name),
    labels: {
      rotate: -18,
      trim: true,
      style: { colors: "#64748b", fontSize: "11px" }
    }
  },
  yaxis: {
    labels: {
      style: { colors: "#64748b", fontSize: "11px" },
      formatter: (value) => formatMoney(value)
    }
  },
  tooltip: {
    theme: "light",
    y: {
      formatter: (value) => formatMoney(value)
    }
  }
}));

const hasSalesData = computed(() => paymentSeries.value.some((n) => n > 0));
const hasPurchaseOrdersData = computed(() => purchaseOrderBarSeries.value[0].data.some((n) => n > 0));

function formatMoney(v) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD"
  }).format(Number(v || 0));
}

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatRelativeTime(value) {
  if (!value) return "";
  const now = new Date();
  const then = new Date(value);
  if (Number.isNaN(then.getTime())) return "";

  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

const exportSummary = () => {
  const rows = [
    ["Metric", "Value"],
    ["Total Businesses", stats.value.totalBusinesses],
    ["Total Users", stats.value.totalUsers],
    ["Platform Revenue", stats.value.totalRevenue],
    ["Total Sales", stats.value.totalSales],
    ["Total Products", stats.value.totalProducts],
    ["Total Customers", stats.value.totalCustomers],
    ["Total Purchase Orders", stats.value.totalPurchaseOrders],
    ["Low Stock Items", stats.value.lowStockItems],
    ["Out Of Stock Items", stats.value.outOfStockItems]
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `system_dashboard_summary_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const sparkOptions = {
  chart: {
    type: "line",
    sparkline: { enabled: true },
    toolbar: { show: false }
  },
  stroke: {
    curve: "smooth",
    width: 3
  },
  dataLabels: { enabled: false },
  tooltip: { enabled: false },
  grid: { show: false }
};

const MiniControlCard = defineComponent({
  props: {
    label: String,
    value: [String, Number],
    icon: String
  },
  template: `
    <div class="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm text-slate-200">{{ label }}</p>
          <p class="mt-2 text-3xl font-black tracking-tight text-white">{{ value }}</p>
        </div>
        <div class="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-orange-100">
          <i :class="icon"></i>
        </div>
      </div>
    </div>
  `
});

const ExecutiveKpiCard = defineComponent({
  props: {
    title: String,
    value: [String, Number],
    subValue: String,
    icon: String,
    sparkSeries: { type: Array, default: () => [] },
    tone: { type: String, default: "slate" }
  },
  components: { VueApexCharts },
  setup(props) {
    const toneClass = computed(() => {
      if (props.tone === "orange") return "kpi-orange";
      if (props.tone === "green") return "kpi-green";
      if (props.tone === "rose") return "kpi-rose";
      return "kpi-slate";
    });

    const options = {
      ...sparkOptions,
      colors: ["rgba(255,255,255,0.9)"]
    };

    return { options, toneClass };
  },
  template: `
    <div :class="['kpi-card', toneClass]">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-sm font-semibold opacity-85">{{ title }}</p>
          <p class="mt-3 truncate text-3xl font-black tracking-tight">{{ value }}</p>
          <p class="mt-2 text-xs opacity-80">{{ subValue }}</p>
        </div>

        <div class="flex flex-col items-end gap-3">
          <div class="grid h-14 w-14 place-items-center rounded-2xl bg-white/12 text-white">
            <i :class="icon"></i>
          </div>
          <div class="w-28">
            <VueApexCharts
              type="line"
              height="50"
              :options="options"
              :series="[{ data: sparkSeries }]"
            />
          </div>
        </div>
      </div>
    </div>
  `
});

onMounted(async () => {
  decodeUser();
  await fetchDashboardData(true);
  startRealtime();
});

onUnmounted(() => {
  stopRealtime();
});
</script>

<style scoped>
.admin-hero {
  background:
    radial-gradient(circle at top right, rgba(249, 115, 22, 0.28), transparent 26%),
    radial-gradient(circle at bottom left, rgba(251, 146, 60, 0.18), transparent 24%),
    linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 1.9rem;
  padding: 1.5rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
}

@media (min-width: 640px) {
  .admin-hero {
    padding: 1.75rem;
  }
}

.control-card {
  background: white;
  border: 1px solid rgb(226 232 240);
  border-radius: 1.75rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  padding: 1.25rem;
}

@media (min-width: 640px) {
  .control-card {
    padding: 1.5rem;
  }
}

.hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  border-radius: 1rem;
  background: linear-gradient(to right, #f97316, #ea580c);
  color: white;
  padding: 0.9rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 700;
  transition: 0.2s ease;
}

.hero-primary:hover {
  background: linear-gradient(to right, #ea580c, #c2410c);
}

.hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: white;
  padding: 0.9rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 700;
  transition: 0.2s ease;
}

.hero-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
}

.action-card {
  border: 1px solid rgb(226 232 240);
  background: rgb(248 250 252);
  border-radius: 1.4rem;
  padding: 1rem;
  text-align: left;
  transition: 0.2s ease;
}

.action-card:hover {
  background: white;
  border-color: rgb(254 215 170);
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.04);
}

.action-icon {
  display: grid;
  place-items: center;
  width: 2.9rem;
  height: 2.9rem;
  border-radius: 1rem;
}

.action-title {
  margin-top: 0.9rem;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}

.action-text {
  margin-top: 0.35rem;
  font-size: 0.88rem;
  line-height: 1.45rem;
  color: #64748b;
}

.kpi-card {
  border-radius: 1.75rem;
  padding: 1.25rem;
  color: white;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  transition: 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-1px);
}

.kpi-orange {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.kpi-slate {
  background: linear-gradient(135deg, #0f172a, #1e293b);
}

.kpi-green {
  background: linear-gradient(135deg, #047857, #10b981);
}

.kpi-rose {
  background: linear-gradient(135deg, #be123c, #f43f5e);
}

.soft-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  background: rgb(255 237 213);
  color: #f97316;
  padding: 0.45rem 0.8rem;
  font-size: 0.78rem;
  font-weight: 800;
}

.mini-panel {
  background: rgb(248 250 252);
  border: 1px solid rgb(241 245 249);
  border-radius: 1.25rem;
  padding: 1rem;
}

.mini-label {
  font-size: 0.88rem;
  color: #64748b;
}

.mini-value {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  font-weight: 900;
  color: #0f172a;
}

.mini-text {
  margin-top: 0.3rem;
  font-size: 0.76rem;
  color: #94a3b8;
}
</style>