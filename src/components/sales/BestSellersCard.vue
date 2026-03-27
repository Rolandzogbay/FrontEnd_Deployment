<template>
    <section class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
                <h3 class="text-lg font-semibold text-slate-900">Best Sellers</h3>
                <p class="mt-1 text-sm text-slate-500">Top performing products by quantity sold</p>
            </div>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">Top 5</span>
        </div>

        <div v-if="items.length === 0" class="px-5 py-10 text-center text-sm text-slate-500">
            No product sales yet.
        </div>

        <div v-else class="divide-y divide-slate-100">
            <div v-for="(product, index) in items.slice(0, 5)" :key="`${product.name}-${index}`"
                class="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-slate-50">
                <div class="flex min-w-0 items-center gap-3">
                    <div class="w-5 text-xs font-bold text-slate-400">{{ index + 1 }}</div>

                    <div
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                        <i class="fa-solid fa-box text-sm"></i>
                    </div>

                    <div class="min-w-0">
                        <p class="truncate text-sm font-semibold text-slate-900">{{ product.name }}</p>
                        <p class="text-xs text-slate-500">{{ product.quantity }} sold</p>
                    </div>
                </div>

                <div class="shrink-0 text-right">
                    <p class="text-sm font-bold text-slate-900">{{ formatMoney(product.revenue) }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    items: { type: Array, default: () => [] },
    formatMoney: { type: Function, required: true },
});
</script>