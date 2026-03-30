<template>
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md overflow-visible">
        <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div class="mx-auto max-w-[1800px]">
                <div class="flex flex-col gap-4">
                    <div class="flex items-start sm:items-center justify-between gap-3">
                        <div class="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                            <button
                                class="lg:hidden mt-0.5 sm:mt-0 h-11 w-11 rounded-2xl border border-slate-200 bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition grid place-items-center shrink-0"
                                @click="$emit('open-sidebar')">
                                <i class="fa-solid fa-bars text-lg"></i>
                            </button>

                            <div class="min-w-0">
                                <h1
                                    class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight truncate">
                                    Products
                                </h1>
                                <p
                                    class="mt-1 text-xs sm:text-sm lg:text-base text-slate-500 line-clamp-2 sm:line-clamp-1 max-w-4xl">
                                    Manage inventory, pricing, stock movement, and product performance from one
                                    professional workspace.
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                            <slot name="notifications"></slot>
                        </div>
                    </div>

                    <div class="w-full">
                        <div class="relative">
                            <i
                                class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)"
                                type="text" placeholder="Search by name, ID, description, barcode, or SKU..."
                                class="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base transition" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
defineProps({
    searchQuery: {
        type: String,
        default: "",
    },
});

defineEmits(["open-sidebar", "update:searchQuery"]);
</script>