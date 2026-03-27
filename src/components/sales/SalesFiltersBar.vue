<template>
    <div class="border-b border-slate-100 px-5 py-4">
        <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
                <h2 class="text-xl font-bold text-slate-900">Recent Transactions</h2>
                <p class="text-sm text-slate-500 mt-1">
                    Search, filter, inspect, print, and manage all sales entries.
                </p>
            </div>

            <div class="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                <div class="relative w-full md:w-80">
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input :value="search" @input="$emit('update:search', $event.target.value)" type="text"
                        placeholder="Search by receipt, customer, cashier, payment..."
                        class="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100" />
                </div>

                <select :value="paymentFilter" @change="$emit('update:paymentFilter', $event.target.value)"
                    class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100">
                    <option value="">All Payments</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile_money">Mobile Money</option>
                </select>

                <select :value="sortBy" @change="$emit('update:sortBy', $event.target.value)"
                    class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Amount</option>
                    <option value="lowest">Lowest Amount</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    search: String,
    paymentFilter: String,
    sortBy: String,
});

defineEmits(["update:search", "update:paymentFilter", "update:sortBy"]);
</script>