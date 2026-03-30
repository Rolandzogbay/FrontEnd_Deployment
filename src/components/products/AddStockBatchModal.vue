<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <div class="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col">
      <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Add Stock Batch</h2>
          <p class="text-sm text-slate-500 mt-1">
            {{ product?.name || "Selected product" }}
          </p>
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

        <form @submit.prevent="submitForm" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Quantity Received <span class="text-red-500">*</span>
              </label>
              <input v-model="form.quantity_received" type="number" min="1" step="1" class="field-input"
                placeholder="Enter quantity" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Cost Price
              </label>
              <input v-model="form.cost_price" type="number" min="0" step="0.01" class="field-input"
                placeholder="Enter cost price" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Batch Number</label>
              <input v-model="form.batch_number" type="text" class="field-input" placeholder="Optional batch number" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Received Date</label>
              <input v-model="form.received_date" type="date" class="field-input" />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Expiry Date
                <span v-if="product?.track_expiry" class="text-red-500">*</span>
              </label>
              <input v-model="form.expiry_date" type="date" class="field-input" />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="$emit('close')"
              class="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition">
              Cancel
            </button>

            <button type="submit"
              class="px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition">
              Add Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";

const props = defineProps({
  isOpen: Boolean,
  product: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit"]);

const form = reactive({
  quantity_received: "",
  cost_price: "",
  batch_number: "",
  received_date: "",
  expiry_date: "",
});

const formError = ref("");

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      form.quantity_received = "";
      form.cost_price = props.product?.price ?? "";
      form.batch_number = "";
      form.received_date = "";
      form.expiry_date = "";
      formError.value = "";
    }
  }
);

const submitForm = () => {
  formError.value = "";

  if (!Number.isInteger(Number(form.quantity_received)) || Number(form.quantity_received) <= 0) {
    formError.value = "Quantity received must be a valid whole number greater than 0.";
    return;
  }

  if (props.product?.track_expiry && !form.expiry_date) {
    formError.value = "Expiry date is required for expiry-tracked products.";
    return;
  }

  emit("submit", {
    quantity_received: Number(form.quantity_received),
    cost_price: form.cost_price !== "" ? Number(form.cost_price) : null,
    batch_number: form.batch_number?.trim() || "",
    received_date: form.received_date || "",
    expiry_date: form.expiry_date || "",
  });
};
</script>