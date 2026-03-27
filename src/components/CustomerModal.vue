<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      @click="handleClose"
    >
      <div
        ref="modalRef"
        class="w-full sm:max-w-2xl h-[92dvh] sm:h-auto sm:max-h-[90vh] bg-white rounded-t-[28px] sm:rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        @click.stop
        tabindex="-1"
      >
        <div class="sticky top-0 z-10 px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-200 bg-slate-50/95 backdrop-blur shrink-0">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3 sm:gap-4 min-w-0">
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center text-xl sm:text-2xl shrink-0">
                <i :class="isEditMode ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'"></i>
              </div>

              <div class="min-w-0">
                <p class="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
                  Customer Management
                </p>
                <h3 class="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                  {{ isEditMode ? "Edit Customer" : "Add New Customer" }}
                </h3>
                <p class="text-xs sm:text-sm text-slate-500 mt-1">
                  {{ isEditMode ? "Update customer information." : "Create a new customer record." }}
                </p>
              </div>
            </div>

            <button
              @click="handleClose"
              class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 grid place-items-center shrink-0 transition"
              type="button"
            >
              <i class="fa-solid fa-xmark text-base sm:text-lg"></i>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 sm:p-7">
          <div
            v-if="formError"
            class="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3"
          >
            <i class="fa-solid fa-circle-exclamation text-red-600 mt-0.5"></i>
            <div>
              <p class="text-sm font-medium text-red-800">{{ formError }}</p>
            </div>
          </div>

          <form class="space-y-5" @submit.prevent="handleSubmit">
            <section class="rounded-[24px] border border-slate-200 bg-white p-4 sm:p-5">
              <div class="mb-4">
                <h4 class="text-base sm:text-lg font-semibold text-slate-900">Basic Information</h4>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Enter full customer name"
                    class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base transition"
                  />
                  <p v-if="errors.name" class="text-xs text-red-600 mt-2">{{ errors.name }}</p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="example@email.com"
                    class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base transition"
                  />
                  <p v-if="errors.email" class="text-xs text-red-600 mt-2">{{ errors.email }}</p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                  <input
                    v-model="form.phone_number"
                    type="text"
                    placeholder="+231..."
                    class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base transition"
                  />
                  <p v-if="errors.phone_number" class="text-xs text-red-600 mt-2">{{ errors.phone_number }}</p>
                </div>
              </div>
            </section>

            <section class="rounded-[24px] border border-slate-200 bg-white p-4 sm:p-5">
              <div class="mb-4">
                <h4 class="text-base sm:text-lg font-semibold text-slate-900">Additional Information</h4>
              </div>

              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                  <textarea
                    v-model="form.address"
                    rows="3"
                    placeholder="Enter customer address"
                    class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base transition resize-none"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                  <textarea
                    v-model="form.notes"
                    rows="4"
                    placeholder="Add notes about this customer"
                    class="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base transition resize-none"
                  ></textarea>
                </div>
              </div>
            </section>
          </form>
        </div>

        <div class="shrink-0 border-t border-slate-200 bg-white px-4 sm:px-7 py-4">
          <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
            <button
              type="button"
              @click="handleClose"
              class="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition"
              :disabled="submitting"
            >
              Cancel
            </button>

            <button
              type="button"
              @click="handleSubmit"
              class="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="submitting"
            >
              <span v-if="!submitting">
                {{ isEditMode ? "Save Changes" : "Add Customer" }}
              </span>
              <span v-else class="inline-flex items-center gap-2">
                <i class="fa-solid fa-spinner animate-spin"></i>
                Processing...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  isOpen: Boolean,
  initialData: {
    type: Object,
    default: () => ({
      id: null,
      name: "",
      email: "",
      phone_number: "",
      address: "",
      notes: "",
    }),
  },
  isEditMode: Boolean,
});

const emit = defineEmits(["close", "submit"]);

const modalRef = ref(null);
const submitting = ref(false);
const formError = ref("");

const form = ref({
  id: null,
  name: "",
  email: "",
  phone_number: "",
  address: "",
  notes: "",
});

const errors = ref({
  name: "",
  email: "",
  phone_number: "",
});

const syncForm = () => {
  form.value = {
    id: props.initialData?.id ?? null,
    name: props.initialData?.name ?? "",
    email: props.initialData?.email ?? "",
    phone_number: props.initialData?.phone_number ?? "",
    address: props.initialData?.address ?? "",
    notes: props.initialData?.notes ?? "",
  };

  errors.value = {
    name: "",
    email: "",
    phone_number: "",
  };

  formError.value = "";
};

const validateForm = () => {
  errors.value = {
    name: "",
    email: "",
    phone_number: "",
  };
  formError.value = "";

  let valid = true;

  if (!String(form.value.name || "").trim()) {
    errors.value.name = "Customer name is required.";
    valid = false;
  }

  const email = String(form.value.email || "").trim();
  if (!email) {
    errors.value.email = "Customer email is required.";
    valid = false;
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errors.value.email = "Please enter a valid email address.";
      valid = false;
    }
  }

  const phone = String(form.value.phone_number || "").trim();
  if (phone && phone.length < 7) {
    errors.value.phone_number = "Phone number looks too short.";
    valid = false;
  }

  if (!valid) {
    formError.value = "Please correct the highlighted fields and try again.";
  }

  return valid;
};

const handleSubmit = async () => {
  if (submitting.value) return;
  if (!validateForm()) return;

  submitting.value = true;

  try {
    emit("submit", {
      id: form.value.id,
      name: String(form.value.name || "").trim(),
      email: String(form.value.email || "").trim(),
      phone_number: String(form.value.phone_number || "").trim(),
      address: String(form.value.address || "").trim(),
      notes: String(form.value.notes || "").trim(),
    });
  } finally {
    setTimeout(() => {
      submitting.value = false;
    }, 300);
  }
};

const handleClose = () => {
  if (submitting.value) return;
  emit("close");
};

const handleEscape = (event) => {
  if (event.key === "Escape" && props.isOpen) {
    handleClose();
  }
};

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      syncForm();
      await nextTick();
      modalRef.value?.focus();
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("keydown", handleEscape);
    }
  },
  { immediate: true }
);

watch(
  () => props.initialData,
  () => {
    if (props.isOpen) syncForm();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>