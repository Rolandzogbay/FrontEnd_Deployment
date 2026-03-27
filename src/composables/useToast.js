// src/composables/useToast.js
import { ref } from "vue";

export function useToast() {
    const toasts = ref([]);

    function removeToast(id) {
        toasts.value = toasts.value.filter((toast) => toast.id !== id);
    }

    function pushToast(type = "info", title = "Notice", message = "") {
        const id = Date.now() + Math.random();
        toasts.value.push({ id, type, title, message });
        setTimeout(() => removeToast(id), 3200);
    }

    function toastClass(type) {
        if (type === "success") return "border-green-200";
        if (type === "error") return "border-red-200";
        if (type === "warning") return "border-amber-200";
        return "border-slate-200";
    }

    function toastIconClass(type) {
        if (type === "success") return "bg-green-100 text-green-600";
        if (type === "error") return "bg-red-100 text-red-600";
        if (type === "warning") return "bg-amber-100 text-amber-600";
        return "bg-blue-100 text-blue-600";
    }

    function toastBarClass(type) {
        if (type === "success") return "bg-green-500";
        if (type === "error") return "bg-red-500";
        if (type === "warning") return "bg-amber-500";
        return "bg-blue-500";
    }

    function toastIcon(type) {
        if (type === "success") return "fa-solid fa-check";
        if (type === "error") return "fa-solid fa-circle-exclamation";
        if (type === "warning") return "fa-solid fa-triangle-exclamation";
        return "fa-solid fa-circle-info";
    }

    return {
        toasts,
        pushToast,
        removeToast,
        toastClass,
        toastIconClass,
        toastBarClass,
        toastIcon,
    };
}