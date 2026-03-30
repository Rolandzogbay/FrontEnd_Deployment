<template>
    <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div
            class="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100">
            <!-- Left -->
            <div
                class="relative hidden md:block overflow-hidden bg-linear-to-br from-[#f97316] via-[#fb923c] to-[#fdba74] p-8 text-white lg:p-10">
                <div
                    class="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.85),transparent_55%)]">
                </div>
                <div
                    class="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/15 blur-2xl">
                </div>

                <div class="relative">
                    <div
                        class="inline-flex items-center gap-2 rounded-2xl bg-white/15 border border-white/20 px-4 py-2">
                        <span class="grid place-items-center w-8 h-8 rounded-xl bg-white/15">
                            <i class="fa-solid fa-boxes-stacked"></i>
                        </span>
                        <div class="leading-tight">
                            <p class="font-extrabold">Check it NaNa</p>
                            <p class="text-xs text-white/80">Inventory & Sales Tracker</p>
                        </div>
                    </div>

                    <h1 class="mt-10 text-4xl font-extrabold tracking-tight">
                        Recover your access.
                    </h1>
                    <p class="mt-4 text-white/90 text-base leading-relaxed">
                        Enter the email linked to your account and we’ll generate a reset token so you can create a new
                        password.
                    </p>

                    <div class="mt-10 rounded-3xl border border-white/15 bg-white/10 p-8">
                        <div class="grid h-16 w-16 place-items-center rounded-2xl bg-white/15">
                            <i class="fa-solid fa-key text-2xl"></i>
                        </div>
                        <p class="mt-5 text-lg text-white/85 leading-relaxed">
                            For this presentation build, password recovery runs in demo mode. The production version
                            will deliver reset links through email.
                        </p>
                    </div>

                    <div class="mt-8 space-y-3 text-sm text-white/85">
                        <div class="flex items-center gap-3">
                            <span class="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
                                <i class="fa-solid fa-shield-halved"></i>
                            </span>
                            <span>Temporary demo recovery flow</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
                                <i class="fa-solid fa-envelope-circle-check"></i>
                            </span>
                            <span>Email delivery will be enabled in production</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right -->
            <div class="p-8 sm:p-10 flex flex-col justify-center">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">Password recovery
                        </p>
                        <h2 class="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                            Forgot password?
                        </h2>
                        <p class="mt-2 text-sm text-slate-500">
                            Enter your email to continue to the reset step.
                        </p>
                    </div>

                    <router-link to="/login"
                        class="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:border-orange-200 hover:bg-orange-50">
                        <i class="fa-solid fa-arrow-left"></i>
                        Login
                    </router-link>
                </div>

                <div class="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <span class="font-semibold">Demo mode:</span>
                    reset tokens are handled in-app for testing and presentation purposes.
                </div>

                <form @submit.prevent="handleSubmit" class="mt-8 space-y-5">
                    <div>
                        <label for="email" class="field-label">Email Address</label>
                        <div class="input-wrap">
                            <i class="fa-solid fa-envelope input-ico"></i>
                            <input v-model="form.email" type="email" id="email" placeholder="example@gmail.com"
                                class="input" :disabled="isSubmitting" autocomplete="email" />
                        </div>
                        <p v-if="fieldErrors.email" class="err">{{ fieldErrors.email }}</p>
                    </div>

                    <button type="submit" class="btn-primary w-full" :disabled="isSubmitting">
                        <span v-if="!isSubmitting" class="inline-flex items-center">
                            Generate reset token
                            <i class="fa-solid fa-arrow-right ml-2"></i>
                        </span>
                        <span v-else class="inline-flex items-center gap-2">
                            <span class="spinner"></span>
                            Processing...
                        </span>
                    </button>
                </form>

                <div v-if="statusMessage" class="mt-4 rounded-2xl px-4 py-3 text-sm border" :class="statusType === 'success'
                    ? ' bg-red-500 text-white'
                    : 'border-red-200 bg-red-50 text-orange-600'">
                    {{ statusMessage }}
                </div>

                <p class="mt-6 text-sm text-slate-400 text-center">
                    Secure recovery • Presentation-friendly demo flow
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useToast } from "vue-toast-notification";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const toast = useToast();
const router = useRouter();

const form = reactive({
    email: "",
});

const isSubmitting = ref(false);
const statusMessage = ref("");
const statusType = ref("error");

const fieldErrors = reactive({
    email: "",
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function clearErrors() {
    fieldErrors.email = "";
    statusMessage.value = "";
}

async function handleSubmit() {
    clearErrors();

    let valid = true;

    if (!form.email.trim()) {
        fieldErrors.email = "Email is required.";
        valid = false;
    } else if (!validateEmail(form.email)) {
        fieldErrors.email = "Invalid email format.";
        valid = false;
    }

    if (!valid) return;

    isSubmitting.value = true;
    statusType.value = "error";

    try {
        const res = await auth.forgotPassword(form.email.trim());

        statusType.value = "success";
        statusMessage.value =
            res?.message || "Reset token generated successfully.";

        if (res?.resetToken) {
            toast.success("Reset token generated. Redirecting you to reset password...");

            router.push({
                path: "/reset-password",
                query: {
                    email: form.email.trim(),
                    token: res.resetToken,
                    mode: "demo",
                },
            });
            return;
        }

        toast.warning("Reset token was not returned. Please try again.");
    } catch (err) {
        console.error("Forgot password full error", err)
        console.error("Forgot password full error", err?.stack)
        console.error("Forgot password response", err?.message)
        console.error("Forgot password response data:", err?.response?.data)
        const msg = err?.response?.data?.message || "Unable to process request.";
        statusMessage.value = msg;
        toast.error(msg);
    } finally {
        isSubmitting.value = false;
    }
}
</script>