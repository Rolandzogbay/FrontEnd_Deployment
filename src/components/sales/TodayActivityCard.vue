<template>
    <section class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm flex-1 flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
                <h3 class="text-lg font-semibold text-slate-900">Today’s Activity</h3>
                <p class="mt-1 text-sm text-slate-500">Quick snapshot of today's sales performance</p>
            </div>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">Today</span>
        </div>

        <div class="flex-1 p-5 flex flex-col gap-4">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Transactions</p>
                    <p class="mt-1 text-2xl font-bold text-slate-900">{{ stats.todaysSalesCount }}</p>
                </div>

                <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Revenue</p>
                    <p class="mt-1 text-2xl font-bold text-orange-600">{{ formatMoney(stats.todaysRevenue) }}</p>
                </div>

                <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Items Sold</p>
                    <p class="mt-1 text-2xl font-bold text-slate-900">{{ stats.todaysItemsSold }}</p>
                </div>

                <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Average Sale</p>
                    <p class="mt-1 text-2xl font-bold text-slate-900">{{ formatMoney(stats.todaysAverageSale) }}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3">
                <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-500">Most used payment</span>
                        <span class="font-semibold text-slate-900">{{ stats.todaysTopPaymentMethod }}</span>
                    </div>
                </div>

                <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-500">Cash Sales</span>
                        <span class="font-semibold text-slate-900">{{ stats.todaysCashSalesCount }}</span>
                    </div>
                </div>

                <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-500">Card / Mobile Sales</span>
                        <span class="font-semibold text-slate-900">{{ stats.todaysNonCashSalesCount }}</span>
                    </div>
                </div>

                <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-500">Top customer today</span>
                        <span class="font-semibold text-slate-900 truncate ml-4">{{ stats.todaysTopCustomer }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    stats: { type: Object, required: true },
    formatMoney: { type: Function, required: true },
});
</script>