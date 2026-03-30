<template>
    <section class="mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
            <div
                class="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4">
                <div class="min-w-0">
                    <p class="text-slate-500 text-sm sm:text-base font-medium">Total Products</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2">
                        {{ formatNumber(totalProductsCount) }}
                    </h3>
                    <p class="text-emerald-600 text-sm mt-2 flex items-center gap-2">
                        <i class="fa-solid fa-arrow-trend-up text-xs"></i>
                        Visible in current filter
                    </p>
                </div>
                <div
                    class="w-14 h-14 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-boxes-stacked"></i>
                </div>
            </div>

            <div
                class="rounded-[28px] border border-orange-300 bg-orange-500 px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4 text-white">
                <div class="min-w-0">
                    <p class="text-orange-100 text-sm sm:text-base font-medium">In Stock</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-2">
                        {{ formatNumber(inStockCount) }}
                    </h3>
                    <p class="text-orange-50/90 text-sm mt-2">Products available for sale right now</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-white/15 text-white grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
            </div>

            <div
                class="rounded-[28px] border border-slate-800 bg-slate-950 px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4 text-white">
                <div class="min-w-0">
                    <p class="text-slate-300 text-sm sm:text-base font-medium">Low Stock</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-2">
                        {{ formatNumber(lowStockCount) }}
                    </h3>
                    <p class="text-slate-300 text-sm mt-2">Items nearing reorder threshold</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-white/10 text-white grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
            </div>

            <div
                class="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4">
                <div class="min-w-0">
                    <p class="text-slate-500 text-sm sm:text-base font-medium">Stock Value</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2 break-words">
                        {{ formatMoney(stockValue) }}
                    </h3>
                    <p class="text-violet-500 text-sm mt-2">Estimated retail inventory value</p>
                </div>
                <div
                    class="w-14 h-14 rounded-full bg-violet-100 text-violet-600 grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-sack-dollar"></i>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    totalProductsCount: Number,
    inStockCount: Number,
    lowStockCount: Number,
    stockValue: Number,
});

const formatMoney = (value) =>
    new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
    }).format(Number(value || 0));

const formatNumber = (value) =>
    new Intl.NumberFormat().format(Number(value || 0));
</script>