<template>
    <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Weekly Revenue</p>
                    <h3 class="mt-2 text-3xl font-extrabold text-slate-900">{{ formatMoney(weeklyRevenue) }}</h3>
                    <p class="mt-2 text-xs" :class="weeklyRevenueChange >= 0 ? 'text-green-600' : 'text-red-500'">
                        <i :class="weeklyRevenueChange >= 0 ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down'"
                            class="mr-1"></i>
                        {{ Math.abs(weeklyRevenueChange).toFixed(1) }}% compared to previous week
                    </p>
                </div>
                <div class="h-14 w-14 rounded-3xl bg-orange-100 text-orange-600 grid place-items-center shrink-0">
                    <i class="fa-solid fa-sack-dollar text-2xl"></i>
                </div>
            </div>
        </div>

        <div
            class="rounded-[28px] border border-orange-200 bg-orange-500 p-5 shadow-sm hover:shadow-md transition text-white">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-orange-100">Total Sales</p>
                    <h3 class="mt-2 text-3xl font-extrabold">{{ totalSales }}</h3>
                    <p class="mt-2 text-xs text-orange-100">Number of completed transactions</p>
                </div>
                <div class="h-14 w-14 rounded-3xl bg-white/15 text-white grid place-items-center shrink-0">
                    <i class="fa-solid fa-cart-shopping text-2xl"></i>
                </div>
            </div>
        </div>

        <div
            class="rounded-[28px] border border-slate-200 bg-slate-900 p-5 shadow-sm hover:shadow-md transition text-white">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-300">Items Sold</p>
                    <h3 class="mt-2 text-3xl font-extrabold">{{ totalItemsSold }}</h3>
                    <p class="mt-2 text-xs text-slate-300">Units sold across all sales</p>
                </div>
                <div class="h-14 w-14 rounded-3xl bg-white/10 text-white grid place-items-center shrink-0">
                    <i class="fa-solid fa-boxes-stacked text-2xl"></i>
                </div>
            </div>
        </div>

        <div class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-sm font-medium text-slate-500">Cashless Payments</p>
                    <h3 class="mt-2 text-3xl font-extrabold text-slate-900">{{ nonCashSalesCount }}</h3>
                    <p class="mt-2 text-xs text-slate-400">Card and mobile money transactions</p>
                </div>
                <div class="h-14 w-14 rounded-3xl bg-purple-100 text-purple-600 grid place-items-center shrink-0">
                    <i class="fa-solid fa-credit-card text-2xl"></i>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    weeklyRevenue: Number,
    weeklyRevenueChange: Number,
    totalSales: Number,
    totalItemsSold: Number,
    nonCashSalesCount: Number,
    formatMoney: Function,
});
</script>