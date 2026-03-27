<template>
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md overflow-visible">
        <div class="px-4 sm:px-6 lg:px-8 py-5">
            <div class="mx-auto max-w-450 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div class="flex items-start gap-3 min-w-0">
                    <button
                        class="md:hidden h-11 w-11 rounded-xl border border-slate-200 text-orange-600 hover:bg-orange-50 transition"
                        @click="$emit('open-sidebar')" aria-label="Open sidebar">
                        <i class="fa-solid fa-bars"></i>
                    </button>

                    <div class="min-w-0">
                        <div
                            class="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 border border-orange-100 mb-2">
                            <i class="fa-solid fa-chart-line"></i>
                            Sales & POS
                        </div>
                        <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">Sales</h1>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <div
                        class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                        <i class="fa-regular fa-calendar"></i>
                        <span>{{ dashboardDateRangeLabel }}</span>
                    </div>

                    <button @click="$emit('refresh')" :disabled="loading"
                        class="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:bg-slate-50 transition disabled:opacity-50">
                        <i class="fa-solid fa-rotate-right" :class="{ 'animate-spin': loading }"></i>
                        Refresh
                    </button>

                    <button @click="$emit('new-sale')"
                        class="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-600 transition">
                        <i class="fa-solid fa-plus"></i>
                        New Sale
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
defineProps({
    dashboardDateRangeLabel: { type: String, required: true },
    loading: { type: Boolean, default: false },
});

defineEmits(["open-sidebar", "refresh", "new-sale"]);
</script>