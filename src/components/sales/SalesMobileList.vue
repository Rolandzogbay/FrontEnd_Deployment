<template>
  <div class="xl:hidden p-4 space-y-4">
    <div
      v-for="sale in sales"
      :key="sale.id"
      class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="font-bold text-slate-900">#SAL{{ String(sale.id).padStart(4, '0') }}</p>
          <p class="text-sm text-slate-700 truncate mt-1">{{ getCustomerDisplayName(sale) }}</p>
          <p class="text-xs text-slate-500 mt-1">{{ formatDateTime(sale.createdAt || sale.sale_date) }}</p>
        </div>

        <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
          Completed
        </span>
      </div>

      <div class="grid grid-cols-2 gap-3 mt-4 text-sm">
        <div>
          <p class="text-slate-400">Payment</p>
          <p class="font-medium text-slate-800">{{ formatPaymentMethod(sale.payment_method) }}</p>
        </div>
        <div>
          <p class="text-slate-400">Total</p>
          <p class="font-bold text-orange-600">{{ formatMoney(sale.total_price) }}</p>
        </div>
        <div class="col-span-2">
          <p class="text-slate-400">Items</p>
          <p class="font-medium text-slate-800">{{ formatSaleItemsSummary(sale) }}</p>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-3 gap-2">
        <button
          @click="$emit('view', sale.id)"
          class="rounded-2xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          View
        </button>

        <button
          @click="$emit('print', sale)"
          class="rounded-2xl border border-orange-200 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50"
        >
          Print
        </button>

        <button
          @click="$emit('delete', sale.id)"
          :disabled="deletingSaleId === sale.id"
          class="rounded-2xl border border-red-200 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          {{ deletingSaleId === sale.id ? "Deleting..." : "Delete" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sales: Array,
  deletingSaleId: [String, Number, null],
  getCustomerDisplayName: Function,
  formatDateTime: Function,
  formatPaymentMethod: Function,
  formatMoney: Function,
  formatSaleItemsSummary: Function,
});

defineEmits(["view", "print", "delete"]);
</script>