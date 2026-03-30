<template>
    <div class="hidden xl:block overflow-x-auto">
        <table class="min-w-full">
            <thead class="bg-slate-50">
                <tr class="text-left text-sm text-slate-600">
                    <th class="px-6 py-4 font-semibold">#</th>
                    <th class="px-6 py-4 font-semibold">Order Details</th>
                    <th class="px-6 py-4 font-semibold">Items</th>
                    <th class="px-6 py-4 font-semibold">Payment</th>
                    <th class="px-6 py-4 font-semibold">Status</th>
                    <th class="px-6 py-4 font-semibold">Amount</th>
                    <th class="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(sale, index) in sales" :key="sale.id"
                    class="border-t border-slate-100 hover:bg-slate-50 transition">
                    <td class="px-6 py-5 text-slate-500 font-medium">
                        {{ paginationStart + index - 1 }}
                    </td>

                    <td class="px-6 py-5 cursor-pointer" @click="$emit('view', sale.id)">
                        <div class="flex items-center gap-3 min-w-0">
                            <div
                                class="h-11 w-11 rounded-2xl bg-slate-100 text-slate-700 grid place-items-center shrink-0">
                                <i class="fa-solid fa-receipt"></i>
                            </div>

                            <div class="min-w-0">
                                <p class="font-semibold text-slate-900 truncate">{{ getCustomerDisplayName(sale) }}</p>
                                <p class="text-xs text-slate-500 mt-1">#SAL{{ String(sale.id).padStart(4, "0") }}</p>
                                <p class="text-xs text-slate-400 mt-1">
                                    <i class="fa-regular fa-clock mr-1"></i>
                                    {{ formatDateTime(sale.createdAt || sale.sale_date) }}
                                </p>
                            </div>
                        </div>
                    </td>

                    <td class="px-6 py-5">
                        <div>
                            <p class="font-medium text-slate-800">{{ formatSaleItemsSummary(sale) }}</p>
                            <p class="text-xs text-slate-500 mt-1">
                                {{ sale.items?.length || 0 }} item(s)
                            </p>
                        </div>
                    </td>

                    <td class="px-6 py-5">
                        <div>
                            <p class="font-medium text-slate-800">{{ formatPaymentMethod(sale.payment_method) }}</p>
                            <p class="text-xs text-blue-600 mt-1 break-all">{{ getCustomerEmail(sale) }}</p>
                        </div>
                    </td>

                    <td class="px-6 py-5">
                        <span
                            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
                            Completed
                        </span>
                    </td>

                    <td class="px-6 py-5 font-bold text-slate-900">
                        {{ formatMoney(sale.total_price) }}
                    </td>

                    <td class="px-6 py-5" @click.stop>
                        <div class="flex items-center justify-center gap-2">
                            <button @click="$emit('view', sale.id)"
                                class="h-10 w-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                                title="View sale">
                                <i class="fa-regular fa-eye"></i>
                            </button>

                            <button @click="$emit('print', sale)"
                                class="h-10 w-10 rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition"
                                title="Print receipt">
                                <i class="fa-solid fa-print"></i>
                            </button>

                            <button @click="$emit('delete', sale.id)" :disabled="deletingSaleId === sale.id"
                                class="h-10 w-10 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                                title="Delete sale">
                                <i v-if="deletingSaleId !== sale.id" class="fa-regular fa-trash-can"></i>
                                <i v-else class="fa-solid fa-spinner animate-spin"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
defineProps({
    sales: Array,
    paginationStart: Number,
    deletingSaleId: [String, Number, null],
    getCustomerDisplayName: Function,
    getCustomerEmail: Function,
    formatDateTime: Function,
    formatPaymentMethod: Function,
    formatMoney: Function,
    formatSaleItemsSummary: Function,
});

defineEmits(["view", "print", "delete"]);
</script>