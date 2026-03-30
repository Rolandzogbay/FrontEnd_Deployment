<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <div class="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[92vh] overflow-hidden flex flex-col">
      <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Add Multiple Products</h2>
          <p class="text-sm text-slate-500 mt-1">Create several products in one action.</p>
        </div>

        <button @click="$emit('close')"
          class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <div v-if="formError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {{ formError }}
        </div>

        <div class="flex items-center justify-between gap-3 mb-4">
          <p class="text-sm text-slate-500">
            Add products and submit them all at once.
          </p>

          <button type="button" @click="addRow"
            class="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition text-sm font-medium">
            <i class="fa-solid fa-plus mr-2"></i>
            Add Product
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="(row, index) in rows" :key="row.key" class="rounded-2xl border border-slate-200 p-4 bg-slate-50">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-slate-900">Product {{ index + 1 }}</h3>
              <button type="button" @click="removeRow(index)"
                class="text-red-600 hover:text-red-700 text-sm font-medium" :disabled="rows.length === 1">
                Remove
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input v-model="row.name" type="text" placeholder="Enter product name" class="field-input" />
              <input v-model="row.sku" type="text" placeholder="Product code (e.g., BEANS-001)" class="field-input" />
              <input v-model="row.barcode" type="text" placeholder="Barcode (e.g., 123456789012)" class="field-input" />

              <input v-model="row.category" type="text" placeholder="Category (e.g Groceries)" class="field-input" />
              <input v-model="row.unit" type="text" placeholder="Unit (e.g, Bags, Cartoon)" class="field-input" />
              <input v-model="row.stock_quantity" type="number" min="0" placeholder="Stock quantity"
                class="field-input" />

              <input v-model="row.price" type="number" min="0" step="0.01" placeholder="Cost price"
                class="field-input" />
              <input v-model="row.selling_price" type="number" min="0" step="0.01" placeholder="Selling price"
                class="field-input" />

              <input v-model="row.low_stock_threshold" type="number" min="0" step="0.01"
                placeholder="Low stock threshold" class="field-input" />

              <div class="md:col-span-3">
                <textarea v-model="row.description" rows="2" placeholder="Enter the product description"
                  class="field-textarea w-full border border-gray-400 rounded p-5"></textarea>
              </div>

              <div class="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="font-medium text-slate-900">Track expiry</p>
                    <p class="text-xs text-slate-500">Enable expiry fields for this product row.</p>
                  </div>

                  <label class="inline-flex items-center cursor-pointer">
                    <input v-model="row.track_expiry" type="checkbox" class="sr-only peer" />
                    <div class="relative w-12 h-7 bg-slate-200 rounded-full peer-checked:bg-orange-600 transition">
                      <span class="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform"
                        :class="row.track_expiry ? 'translate-x-5' : ''"></span>
                    </div>
                  </label>
                </div>

                <div v-if="row.track_expiry" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <input v-model="row.expiry_date" type="date" class="field-input" />
                  <input v-model="row.batch_number" type="text" placeholder="Batch number" class="field-input" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-6">
          <button type="button" @click="$emit('close')"
            class="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition">
            Cancel
          </button>

          <button type="button" @click="submitRows"
            class="px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition">
            Submit Products
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close", "submit"]);

const createRow = () => ({
  key: `${Date.now()}-${Math.random()}`,
  name: "",
  description: "",
  sku: "",
  barcode: "",
  category: "",
  unit: "",
  price: "",
  selling_price: "",
  stock_quantity: "",
  low_stock_threshold: 10,
  track_expiry: false,
  expiry_date: "",
  batch_number: "",
});

const rows = ref([createRow()]);
const formError = ref("");

const addRow = () => {
  rows.value.push(createRow());
};

const removeRow = (index) => {
  if (rows.value.length === 1) return;
  rows.value.splice(index, 1);
};

const submitRows = () => {
  formError.value = "";

  const cleaned = rows.value.map((row) => ({
    name: row.name?.trim() || "",
    description: row.description?.trim() || "",
    sku: row.sku?.trim() || "",
    barcode: row.barcode?.trim() || "",
    category: row.category?.trim() || "",
    unit: row.unit?.trim() || "",
    price: Number(row.price),
    selling_price: Number(row.selling_price),
    stock_quantity: Number(row.stock_quantity),
    low_stock_threshold: Number(row.low_stock_threshold ?? 10),
    track_expiry: !!row.track_expiry,
    expiry_date: row.track_expiry ? row.expiry_date || "" : "",
    batch_number: row.track_expiry ? row.batch_number?.trim() || "" : "",
  }));

  const hasInvalid = cleaned.some((row) => {
    if (!row.name) return true;
    if (!Number.isFinite(row.price) || row.price < 0) return true;
    if (!Number.isFinite(row.selling_price) || row.selling_price < 0) return true;
    if (!Number.isInteger(row.stock_quantity) || row.stock_quantity < 0) return true;
    if (!Number.isInteger(row.low_stock_threshold) || row.low_stock_threshold < 0) return true;
    if (row.track_expiry && !row.expiry_date) return true;
    return false;
  });

  if (hasInvalid) {
    formError.value = "Please complete all required fields correctly for every row.";
    return;
  }

  emit("submit", cleaned);
  rows.value = [createRow()];
};
</script>

<style scoped></style>