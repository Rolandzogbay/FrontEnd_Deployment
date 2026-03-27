<template>
    <div class="fixed top-4 right-4 z-[100] space-y-3 w-[92vw] max-w-sm">
        <transition-group name="toast">
            <div v-for="toast in toasts" :key="toast.id"
                class="rounded-2xl border shadow-lg backdrop-blur bg-white/95 overflow-hidden"
                :class="toastClass(toast.type)">
                <div class="flex items-start gap-3 p-4">
                    <div class="h-10 w-10 rounded-2xl grid place-items-center shrink-0"
                        :class="toastIconClass(toast.type)">
                        <i :class="toastIcon(toast.type)"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="font-semibold text-slate-900">{{ toast.title }}</p>
                        <p class="text-sm text-slate-600 mt-1">{{ toast.message }}</p>
                    </div>
                    <button @click="$emit('remove', toast.id)"
                        class="h-8 w-8 rounded-xl hover:bg-slate-100 text-slate-500 transition">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="h-1 bg-slate-100">
                    <div class="h-full animate-toast-progress" :class="toastBarClass(toast.type)"></div>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup>
defineProps({
    toasts: { type: Array, default: () => [] },
    toastClass: { type: Function, required: true },
    toastIconClass: { type: Function, required: true },
    toastBarClass: { type: Function, required: true },
    toastIcon: { type: Function, required: true },
});

defineEmits(["remove"]);
</script>

<style scoped>
@keyframes toast-progress {
    from {
        width: 100%;
    }

    to {
        width: 0%;
    }
}

.animate-toast-progress {
    animation: toast-progress 3.2s linear forwards;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(-8px) translateX(8px);
}
</style>