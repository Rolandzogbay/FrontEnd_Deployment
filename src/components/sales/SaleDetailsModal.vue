<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6"
  >
    <div
      class="w-full max-w-7xl h-[95vh] sm:h-[92vh] overflow-hidden rounded-[24px] sm:rounded-[30px] bg-white shadow-2xl flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-start sm:items-center justify-between gap-4 border-b border-slate-100 px-4 sm:px-5 md:px-6 py-4">
        <div class="min-w-0">
          <h3 class="text-xl sm:text-2xl font-bold text-slate-900">
            Sale Details
          </h3>
          <p class="text-sm text-slate-500 mt-1" v-if="sale">
            Receipt #SAL{{ String(sale.id).padStart(4, "0") }}
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            v-if="sale"
            @click="$emit('print', sale)"
            class="hidden sm:inline-flex rounded-2xl border border-orange-200 px-4 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition"
          >
            <i class="fa-solid fa-print mr-2"></i>
            Print
          </button>

          <button
            @click="$emit('close')"
            class="h-10 w-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-10 text-center">
        <div class="mx-auto h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin"></div>
        <p class="mt-4 text-slate-500">Loading sale details...</p>
      </div>

      <!-- Body -->
      <div v-else-if="sale" class="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-5 sm:space-y-6 bg-slate-50">
        <!-- Hero -->
        <section class="rounded-[24px] sm:rounded-[28px] border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 text-white overflow-hidden">
          <div class="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
            <div class="min-w-0">
              <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-orange-200 border border-white/10 mb-3">
                <i class="fa-solid fa-receipt"></i>
                Transaction Overview
              </div>

              <div class="flex items-start gap-4">
                <div
                  v-if="businessLogo"
                  class="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden border border-white/10 bg-white shrink-0"
                >
                  <img
                    :src="businessLogo"
                    :alt="businessName"
                    class="h-full w-full object-cover"
                  />
                </div>

                <div class="min-w-0">
                  <h4 class="text-2xl md:text-3xl font-extrabold truncate">
                    {{ businessName }}
                  </h4>
                  <p class="text-slate-300 mt-2 max-w-2xl text-sm sm:text-base">
                    Detailed sales transaction summary including business details, customer information, items sold, payment method, and printable receipt details.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 w-full xl:max-w-[380px]">
              <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-300">Receipt</p>
                <p class="mt-1 font-bold text-base sm:text-lg">#SAL{{ String(sale.id).padStart(4, "0") }}</p>
              </div>

              <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-300">Payment</p>
                <p class="mt-1 font-bold text-base sm:text-lg">{{ formatPaymentMethod(sale.payment_method) }}</p>
              </div>

              <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-300">Total</p>
                <p class="mt-1 font-bold text-base sm:text-lg text-orange-300">{{ formatMoney(sale.total_price) }}</p>
              </div>

              <div class="rounded-2xl bg-white/10 border border-white/10 p-4">
                <p class="text-xs uppercase tracking-wide text-slate-300">Date</p>
                <p class="mt-1 font-bold text-sm">{{ formatDateTime(sale.createdAt || sale.sale_date) }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Info cards -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Business Information -->
          <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex items-start gap-4 mb-5">
              <div
                v-if="businessLogo"
                class="h-14 w-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0"
              >
                <img
                  :src="businessLogo"
                  :alt="businessName"
                  class="h-full w-full object-cover"
                />
              </div>

              <div class="min-w-0">
                <p class="text-sm text-slate-500">Business Information</p>
                <p class="font-bold text-slate-900 text-lg truncate">{{ businessName }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-slate-400">Email</p>
                <p class="font-medium text-slate-800 break-all">{{ businessInfo.email || "No business email" }}</p>
              </div>

              <div>
                <p class="text-slate-400">Phone</p>
                <p class="font-medium text-slate-800">{{ businessInfo.phone || "No business phone" }}</p>
              </div>

              <div class="sm:col-span-2">
                <p class="text-slate-400">Address</p>
                <p class="font-medium text-slate-800">{{ businessInfo.address || "No business address" }}</p>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="mb-5">
              <p class="text-sm text-slate-500">Customer Information</p>
              <p class="font-bold text-slate-900 text-lg">{{ getCustomerDisplayName(sale) }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-slate-400">Email</p>
                <p class="font-medium text-slate-800 break-all">{{ getCustomerEmail(sale) }}</p>
              </div>

              <div>
                <p class="text-slate-400">Phone</p>
                <p class="font-medium text-slate-800">{{ getCustomerPhone(sale) }}</p>
              </div>

              <div class="sm:col-span-2">
                <p class="text-slate-400">Customer Type</p>
                <p class="font-medium text-slate-800">
                  {{ isWalkInCustomer(sale) ? "Walk-in Customer" : "Registered Customer" }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Metrics -->
        <section class="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="rounded-3xl border border-slate-200 bg-white p-4">
            <p class="text-sm text-slate-500">Payment Method</p>
            <p class="mt-1 font-bold text-slate-900">{{ formatPaymentMethod(sale.payment_method) }}</p>
          </div>

          <div class="rounded-3xl border border-slate-200 bg-white p-4">
            <p class="text-sm text-slate-500">Receipt Number</p>
            <p class="mt-1 font-bold text-slate-900">#SAL{{ String(sale.id).padStart(4, "0") }}</p>
          </div>

          <div class="rounded-3xl border border-slate-200 bg-white p-4">
            <p class="text-sm text-slate-500">Line Items</p>
            <p class="mt-1 font-bold text-slate-900">{{ sale.items?.length || 0 }}</p>
          </div>

          <div class="rounded-3xl border border-slate-200 bg-white p-4">
            <p class="text-sm text-slate-500">Grand Total</p>
            <p class="mt-1 font-bold text-orange-600">{{ formatMoney(sale.total_price) }}</p>
          </div>
        </section>

        <!-- Sold items -->
        <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div class="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-4">
            <div>
              <h4 class="font-semibold text-slate-900">Sold Items</h4>
              <p class="text-xs text-slate-500 mt-1">Detailed breakdown of all items in this transaction</p>
            </div>
            <span class="text-xs font-semibold text-slate-500">
              {{ sale.items?.length || 0 }} line item(s)
            </span>
          </div>

          <!-- Desktop table -->
          <div v-if="sale.items?.length" class="hidden md:block overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-white">
                <tr class="text-left text-sm text-slate-600">
                  <th class="px-4 py-4 font-semibold">Product</th>
                  <th class="px-4 py-4 font-semibold">Quantity</th>
                  <th class="px-4 py-4 font-semibold">Unit Price</th>
                  <th class="px-4 py-4 font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in sale.items"
                  :key="item.id || `${item.productId}-${item.name}`"
                  class="border-t border-slate-100"
                >
                  <td class="px-4 py-4">
                    <div>
                      <p class="font-semibold text-slate-900">
                        {{ item.name || item.product?.name || `Product #${item.productId}` }}
                      </p>
                      <p class="text-xs text-slate-500 mt-1">
                        Product ID: {{ item.productId || "N/A" }}
                      </p>
                    </div>
                  </td>
                  <td class="px-4 py-4 font-medium text-slate-800">{{ item.quantity }}</td>
                  <td class="px-4 py-4 text-slate-700">{{ formatMoney(item.unit_price) }}</td>
                  <td class="px-4 py-4 font-semibold text-orange-600">{{ formatMoney(item.sub_total_price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile cards -->
          <div v-if="sale.items?.length" class="md:hidden p-4 space-y-3">
            <div
              v-for="item in sale.items"
              :key="item.id || `${item.productId}-${item.name}`"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p class="font-semibold text-slate-900">
                {{ item.name || item.product?.name || `Product #${item.productId}` }}
              </p>
              <p class="text-xs text-slate-500 mt-1">Product ID: {{ item.productId || "N/A" }}</p>

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

          <div v-else class="p-6 text-center text-slate-500">
            No items found for this sale.
          </div>
        </section>
      </div>

      <!-- Footer for mobile -->
      <div
        v-if="sale"
        class="sm:hidden border-t border-slate-100 bg-white px-4 py-3"
      >
        <button
          @click="$emit('print', sale)"
          class="w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition"
        >
          <i class="fa-solid fa-print mr-2"></i>
          Print
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  sale: { type: Object, default: null },
  receiptBusiness: { type: Object, default: () => ({}) },
  formatMoney: { type: Function, required: true },
  formatDateTime: { type: Function, required: true },
  formatPaymentMethod: { type: Function, required: true },
  getCustomerDisplayName: { type: Function, required: true },
  getCustomerEmail: { type: Function, required: true },
  getCustomerPhone: { type: Function, required: true },
  isWalkInCustomer: { type: Function, required: true },
});

defineEmits(["close", "print"]);

const businessInfo = computed(() => {
  const business = props.sale?.business || {};

  return {
    name:
      business.name ||
      props.receiptBusiness?.name ||
      "Your Business",

    email:
      business.email ||
      business.business_email ||
      props.receiptBusiness?.email ||
      "",

    phone:
      business.phone ||
      business.phone_number ||
      business.business_phone ||
      props.receiptBusiness?.phone ||
      "",

    address:
      business.address ||
      business.location ||
      business.business_address ||
      props.receiptBusiness?.address ||
      "",

    logo:
      business.logo ||
      business.logo_url ||
      business.logoUrl ||
      business.image ||
      business.image_url ||
      business.photo ||
      props.receiptBusiness?.logo ||
      "",
  };
});

const businessName = computed(() => businessInfo.value.name);
const businessLogo = computed(() => businessInfo.value.logo || "");
</script>