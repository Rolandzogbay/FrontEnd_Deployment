<template>
    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="open"
            class="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
            @click="$emit('cancel')">
            <div class="w-full max-w-lg bg-white rounded-[28px] border border-slate-200 shadow-2xl overflow-hidden"
                @click.stop>
                <div class="p-6 border-b border-slate-100">
                    <div class="flex items-start gap-4">
                        <div :class="iconClass" class="w-12 h-12 rounded-2xl grid place-items-center text-lg shrink-0">
                            <i :class="icon"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-slate-900">{{ title }}</h3>
                            <p class="text-sm text-slate-500 mt-2 leading-6">{{ message }}</p>
                        </div>
                    </div>
                </div>

                <div class="p-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                    <button
                        class="px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition"
                        @click="$emit('cancel')" :disabled="loading">
                        Cancel
                    </button>
                    <button class="px-4 py-3 rounded-2xl text-white font-medium transition disabled:opacity-60"
                        :class="buttonClass" @click="$emit('confirm')" :disabled="loading">
                        <span v-if="!loading">{{ confirmText }}</span>
                        <span v-else class="inline-flex items-center gap-2">
                            <i class="fa-solid fa-spinner animate-spin"></i>
                            Processing...
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    open: Boolean,
    title: String,
    message: String,
    confirmText: {
        type: String,
        default: "Confirm",
    },
    variant: {
        type: String,
        default: "warning",
    },
    icon: {
        type: String,
        default: "fa-solid fa-circle-exclamation",
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

defineEmits(["cancel", "confirm"]);

const buttonClass = computed(() => {
    if (props.variant === "danger") return "bg-red-600 hover:bg-red-700";
    if (props.variant === "success") return "bg-emerald-600 hover:bg-emerald-700";
    return "bg-amber-600 hover:bg-amber-700";
});

const iconClass = computed(() => {
    if (props.variant === "danger") return "bg-red-100 text-red-600";
    if (props.variant === "success") return "bg-emerald-100 text-emerald-600";
    return "bg-amber-100 text-amber-600";
});
</script>