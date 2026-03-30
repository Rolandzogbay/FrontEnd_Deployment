<template>
  <div v-if="open && receiptData"
    class="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
    <div
      class="w-full max-w-5xl h-[94vh] overflow-hidden rounded-[24px] sm:rounded-[30px] bg-white shadow-2xl flex flex-col">
      <div
        class="flex items-start sm:items-center justify-between gap-4 border-b border-slate-100 px-4 sm:px-5 md:px-6 py-4">
        <div class="flex items-start gap-3 min-w-0">
          <div class="h-12 w-12 rounded-2xl bg-green-100 text-green-600 grid place-items-center shrink-0">
            <i class="fa-solid fa-check text-xl"></i>
          </div>
          <div class="min-w-0">
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900">Sale Completed</h3>
            <p class="text-sm text-slate-500 mt-1">Receipt generated successfully.</p>
          </div>
        </div>

        <button @click="$emit('close')"
          class="h-10 w-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition shrink-0">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div id="receipt-print-area" class="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 bg-slate-50">
        <div
          class="mx-auto max-w-4xl rounded-[24px] sm:rounded-[30px] border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div
            class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 sm:px-6 md:px-8 py-6 sm:py-8 text-white">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div class="min-w-0">
                <div class="flex items-start gap-4">
                  <div v-if="businessLogo"
                    class="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden bg-white border border-white/10 shrink-0">
                    <img :src="businessLogo" :alt="businessName" class="h-full w-full object-cover" />
                  </div>

                  <div class="min-w-0">
                    <h2 class="text-2xl md:text-3xl font-extrabold truncate">
                      {{ businessName }}
                    </h2>
                    <p class="mt-2 text-sm text-slate-300">Official Sales Receipt</p>

                    <div class="mt-4 space-y-1 text-sm text-slate-300">
                      <p>{{ businessInfo.address || "Business address unavailable" }}</p>
                      <p v-if="businessInfo.phone || businessInfo.email">
                        {{ businessInfo.phone || "" }}
                        <span v-if="businessInfo.phone && businessInfo.email">•</span>
                        {{ businessInfo.email || "" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 w-full lg:max-w-[360px]">
                <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p class="text-xs uppercase tracking-wide text-slate-300">Receipt</p>
                  <p class="mt-1 font-bold">#SAL{{ String(receiptData.sale.id).padStart(4, "0") }}</p>
                </div>

                <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p class="text-xs uppercase tracking-wide text-slate-300">Date</p>
                  <p class="mt-1 font-bold text-sm">
                    {{ formatDateTime(receiptData.sale.createdAt || receiptData.sale.sale_date || new Date()) }}
                  </p>
                </div>

                <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p class="text-xs uppercase tracking-wide text-slate-300">Customer</p>
                  <p class="mt-1 font-bold">{{ receiptData.customer_name || "Walk-in Customer" }}</p>
                </div>

                <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <p class="text-xs uppercase tracking-wide text-slate-300">Payment</p>
                  <p class="mt-1 font-bold">{{ formatPaymentMethod(receiptData.sale.payment_method) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="px-4 sm:px-6 md:px-8 py-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-400 mb-2">Bill To</p>
                <p class="font-semibold text-slate-900">{{ receiptData.customer_name || "Walk-in Customer" }}</p>
                <p class="text-sm text-slate-500 mt-1">{{ getCustomerEmail(receiptData.sale) }}</p>
                <p class="text-sm text-slate-500">{{ getCustomerPhone(receiptData.sale) }}</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-400 mb-2">Business</p>
                <p class="font-semibold text-slate-900">{{ businessName }}</p>
                <p class="text-sm text-slate-500 mt-1 break-all">{{ businessInfo.email || "No business email" }}</p>
                <p class="text-sm text-slate-500">{{ businessInfo.phone || "No business phone" }}</p>
              </div>
            </div>

            <div class="hidden md:block overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-slate-100 text-left text-sm text-slate-500">
                    <th class="py-3 pr-4 font-semibold">Item</th>
                    <th class="py-3 pr-4 font-semibold">Product Code</th>
                    <th class="py-3 pr-4 font-semibold">Barcode</th>
                    <th class="py-3 pr-4 font-semibold">Qty</th>
                    <th class="py-3 pr-4 font-semibold">Unit Price</th>
                    <th class="py-3 text-right font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in receiptData.items"
                    :key="`${receiptData.sale.id}-${item.productId}-${item.id || item.name}`"
                    class="border-b border-slate-50">
                    <td class="py-4 pr-4">
                      <div>
                        <p class="font-medium text-slate-900">
                          {{ item.name || item.product?.name || `Product #${item.productId}` }}
                        </p>
                        <p class="text-xs text-slate-500 mt-1">Product ID: {{ item.productId || "N/A" }}</p>
                      </div>
                    </td>
                    <td class="py-4 pr-4 text-slate-700">{{ item.sku || item.product?.sku || "No product code" }}</td>
                    <td class="py-4 pr-4 text-slate-700">{{ item.barcode || item.product?.barcode || "No barcode" }}
                    </td>
                    <td class="py-4 pr-4 text-slate-700">{{ item.quantity }}</td>
                    <td class="py-4 pr-4 text-slate-700">{{ formatMoney(item.unit_price) }}</td>
                    <td class="py-4 text-right font-semibold text-slate-900">
                      {{ formatMoney(item.sub_total_price) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="md:hidden space-y-3">
              <div v-for="item in receiptData.items"
                :key="`${receiptData.sale.id}-${item.productId}-${item.id || item.name}`"
                class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p class="font-medium text-slate-900">
                  {{ item.name || item.product?.name || `Product #${item.productId}` }}
                </p>
                <p class="text-xs text-slate-500 mt-1">Product ID: {{ item.productId || "N/A" }}</p>

                <div class="mt-2 space-y-1 text-xs text-slate-500">
                  <p><span class="font-medium text-slate-700">Product Code:</span> {{ item.sku || item.product?.sku ||
                    "No product code" }}</p>
                  <p><span class="font-medium text-slate-700">Barcode:</span> {{ item.barcode || item.product?.barcode
                    || "No barcode" }}</p>
                </div>

                <div class="grid grid-cols-3 gap-3 mt-4 text-sm">
                  <div>
                    <p class="text-slate-400">Qty</p>
                    <p class="font-semibold text-slate-800">{{ item.quantity }}</p>
                  </div>
                  <div>
                    <p class="text-slate-400">Unit</p>
                    <p class="font-semibold text-slate-800">{{ formatMoney(item.unit_price) }}</p>
                  </div>
                  <div>
                    <p class="text-slate-400">Subtotal</p>
                    <p class="font-semibold text-orange-600">{{ formatMoney(item.sub_total_price) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <p class="text-sm text-slate-500">Prepared by</p>
                <p class="font-semibold text-slate-900 mt-1">
                  {{ receiptData.sale.user?.name || authUserName || "System User" }}
                </p>

                <p class="mt-6 text-xs text-slate-400">
                  Thank you for your business.
                </p>
              </div>

              <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <div class="flex items-center justify-between text-sm text-slate-600">
                  <span>Total Items</span>
                  <span>{{ receiptTotalItems }}</span>
                </div>

                <div class="flex items-center justify-between text-sm text-slate-600">
                  <span>Payment Method</span>
                  <span>{{ formatPaymentMethod(receiptData.sale.payment_method) }}</span>
                </div>

                <div
                  class="border-t border-slate-200 pt-3 flex items-center justify-between text-xl font-bold text-slate-900">
                  <span>Grand Total</span>
                  <span class="text-orange-600">{{ formatMoney(receiptData.sale.total_price) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100 bg-slate-50 px-4 sm:px-5 md:px-6 py-4">
        <button @click="$emit('close')"
          class="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white transition">
          Close
        </button>

        <button @click="$emit('print', receiptData.sale, receiptData)"
          class="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition">
          <i class="fa-solid fa-print mr-2"></i>
          Print Receipt
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  receiptData: { type: Object, default: null },
  receiptBusiness: { type: Object, default: () => ({}) },
  authUserName: { type: String, default: "" },
  formatMoney: { type: Function, required: true },
  formatDateTime: { type: Function, required: true },
  formatPaymentMethod: { type: Function, required: true },
  getCustomerEmail: { type: Function, required: true },
  getCustomerPhone: { type: Function, required: true },
});

defineEmits(["close", "print"]);

const businessInfo = computed(() => {
  const business = props.receiptData?.sale?.business || {};
  return {
    name: business.name || props.receiptBusiness?.name || "Your Business",
    email: business.email || props.receiptBusiness?.email || "",
    phone: business.phone || props.receiptBusiness?.phone || "",
    address: business.address || props.receiptBusiness?.address || "",
    logo:
      business.logo ||
      business.logo_url ||
      business.logoUrl ||
      business.image ||
      business.image_url ||
      business.photo ||
      props.receiptBusiness?.logo ||
      props.receiptBusiness?.logo_url ||
      props.receiptBusiness?.logoUrl ||
      "",
  };
});

const businessName = computed(() => businessInfo.value.name);
const businessLogo = computed(() => businessInfo.value.logo || "");

const receiptTotalItems = computed(() => {
  if (!props.receiptData?.items?.length) return 0;
  return props.receiptData.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
});
</script>