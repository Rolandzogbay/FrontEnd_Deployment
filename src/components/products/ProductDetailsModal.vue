<template>
  <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="isOpen && product"
      class="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      @click="$emit('close')">
      <div
        class="w-full sm:max-w-6xl h-[92dvh] sm:h-auto sm:max-h-[90vh] bg-white rounded-t-[28px] sm:rounded-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        @click.stop>
        <div
          class="sticky top-0 z-10 px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-200 bg-slate-50/95 backdrop-blur shrink-0">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3 sm:gap-4 min-w-0">
              <div
                class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center text-xl sm:text-2xl shrink-0">
                <i class="fa-solid fa-box"></i>
              </div>

              <div class="min-w-0">
                <p class="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
                  Product Details
                </p>
                <h3 class="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                  {{ product.name }}
                </h3>
                <p class="text-xs sm:text-sm text-slate-500 mt-1">
                  ID: #PRD{{ String(product.id).padStart(4, "0") }}
                </p>
              </div>
            </div>

            <button @click="$emit('close')"
              class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 grid place-items-center shrink-0">
              <i class="fa-solid fa-xmark text-base sm:text-lg"></i>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 sm:p-7">
          <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-5 sm:mb-6">
            <InfoCard label="Cost Price" :value="formatMoney(product.price)" />
            <InfoCard label="Selling Price" :value="formatMoney(product.selling_price)" highlighted />
            <InfoCard label="Quantity" :value="formatNumber(product.stock_quantity)" dark />
            <InfoCard label="Barcode" :value="product.barcode || '—'" />
            <InfoCard label="SKU" :value="product.sku || '—'" />
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
            <div class="xl:col-span-2 rounded-3xl sm:rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5">
              <h4 class="text-base sm:text-lg font-semibold text-slate-900 mb-4">Product Overview</h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <MetaBlock label="Category" :value="product.category || '—'" />
                <MetaBlock label="Unit" :value="product.unit || '—'" />
                <MetaBlock label="Low Stock Threshold" :value="formatNumber(product.low_stock_threshold || 0)" />
                <MetaBlock label="Track Expiry" :value="product.track_expiry ? 'Yes' : 'No'" />
              </div>

              <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                  Description
                </p>
                <p class="text-sm sm:text-base text-slate-700 mt-2 leading-7">
                  {{ product.description?.trim() || "No description has been added for this product yet." }}
                </p>
              </div>

              <div v-if="product.batches?.length" class="mt-5">
                <h5 class="font-semibold text-slate-900 mb-3">Stock Batches</h5>
                <div class="space-y-3">
                  <div v-for="batch in product.batches" :key="batch.id"
                    class="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p class="text-slate-400">Batch Number</p>
                        <p class="font-semibold text-slate-900 mt-1">{{ batch.batch_number ||
                          "—" }}</p>
                      </div>
                      <div>
                        <p class="text-slate-400">Received</p>
                        <p class="font-semibold text-slate-900 mt-1">{{
                          formatNumber(batch.quantity_received) }}</p>
                      </div>
                      <div>
                        <p class="text-slate-400">Remaining</p>
                        <p class="font-semibold text-slate-900 mt-1">{{
                          formatNumber(batch.quantity_remaining) }}</p>
                      </div>
                      <div>
                        <p class="text-slate-400">Expiry</p>
                        <p class="font-semibold text-slate-900 mt-1">{{ batch.expiry_date || "—"
                          }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-[24px] sm:rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5">
              <h4 class="text-base sm:text-lg font-semibold text-slate-900 mb-4">Quick Actions</h4>

              <div class="grid grid-cols-1 gap-3">
                <button v-if="product.is_active" @click="$emit('edit', product)"
                  class="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition">
                  <i class="fa-solid fa-pen-to-square mr-2"></i>
                  Edit Product
                </button>

                <button v-if="product.is_active" @click="$emit('add-batch', product)"
                  class="w-full px-4 py-3 border border-orange-200 hover:bg-orange-50 text-orange-700 rounded-2xl font-medium transition">
                  <i class="fa-solid fa-layer-group mr-2"></i>
                  Add Stock Batch
                </button>

                <button @click="$emit('close')"
                  class="w-full px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-medium transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineComponent, h } from "vue";

defineProps({
  isOpen: Boolean,
  product: {
    type: Object,
    default: null,
  },
});

defineEmits(["close", "edit", "add-batch"]);

const formatMoney = (value) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const formatNumber = (value) =>
  new Intl.NumberFormat().format(Number(value || 0));

const InfoCard = defineComponent({
  props: ["label", "value", "highlighted", "dark"],
  setup(props) {
    return () =>
      h(
        "div",
        {
          class: [
            "rounded-3xl border p-4",
            props.highlighted
              ? "border-orange-200 bg-orange-500 text-white"
              : props.dark
                ? "border-slate-800 bg-slate-950 text-white"
                : "border-slate-200 bg-white",
          ],
        },
        [
          h(
            "p",
            {
              class: [
                "text-xs sm:text-sm font-medium",
                props.highlighted
                  ? "text-orange-100"
                  : props.dark
                    ? "text-slate-300"
                    : "text-slate-500",
              ],
            },
            props.label
          ),
          h(
            "p",
            {
              class: [
                "text-lg sm:text-2xl font-extrabold mt-2 break-words",
                props.highlighted || props.dark ? "text-white" : "text-slate-900",
              ],
            },
            props.value
          ),
        ]
      );
  },
});

const MetaBlock = defineComponent({
  props: ["label", "value"],
  setup(props) {
    return () =>
      h("div", { class: "rounded-2xl bg-slate-50 p-4 border border-slate-100" }, [
        h(
          "p",
          {
            class:
              "text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold",
          },
          props.label
        ),
        h(
          "p",
          { class: "text-sm sm:text-base text-slate-900 font-semibold mt-2" },
          props.value
        ),
      ]);
  },
});
</script>