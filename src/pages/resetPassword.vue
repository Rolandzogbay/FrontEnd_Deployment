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
                        Set a new password.
                    </h1>
                    <p class="mt-4 text-white/90 text-base leading-relaxed">
                        Create a strong new password to secure your workspace and continue using the system safely.
                    </p>

                    <div class="mt-10 rounded-3xl border border-white/15 bg-white/10 p-8">
                        <div class="space-y-3 text-sm text-white/85">
                            <div class="flex items-center gap-3">
                                <span class="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
                                    <i class="fa-solid fa-check"></i>
                                </span>
                                <span>Use at least 8 characters</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
                                    <i class="fa-solid fa-check"></i>
                                </span>
                                <span>Include uppercase, lowercase, and a number</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
                                    <i class="fa-solid fa-check"></i>
                                </span>
                                <span>Keep your password private and strong</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="isDemoMode"
                        class="mt-6 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/90">
                        <span class="font-semibold">Demo mode:</span>
                        this page was opened using an in-app reset token for presentation/testing.
                    </div>
                </div>
            </div>

            <!-- Right -->
            <div class="p-8 sm:p-10 flex flex-col justify-center">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">Reset password</p>
                        <h2 class="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                            Create a new password
                        </h2>
                        <p class="mt-2 text-sm text-slate-500">
                            Confirm your details and finish your password reset.
                        </p>
                    </div>

                    <router-link to="/login"
                        class="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:border-orange-200 hover:bg-orange-50">
                        <i class="fa-solid fa-arrow-left"></i>
                        Login
                    </router-link>
                </div>

                <div v-if="isDemoMode"
                    class="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <span class="font-semibold">Demo mode:</span>
                    token and email were auto-filled for the presentation flow.
                </div>

                <form @submit.prevent="handleSubmit" class="mt-8 space-y-5">
                    <div>
                        <label for="email" class="field-label">Email Address</label>
                        <div class="input-wrap">
                            <i class="fa-solid fa-envelope input-ico"></i>
                            <input v-model="form.email" type="email" id="email" placeholder="example@gmail.com"
                                class="input" :disabled="isSubmitting" />
                        </div>
                        <p v-if="fieldErrors.email" class="err">{{ fieldErrors.email }}</p>
                    </div>

                    <div>
                        <label for="token" class="field-label">Reset Token</label>
                        <div class="input-wrap">
                            <i class="fa-solid fa-key input-ico"></i>
                            <input v-model="form.token" type="text" id="token" placeholder="Paste your reset token"
                                class="input" :readonly="isDemoMode" :disabled="isSubmitting" />
                        </div>
                        <p v-if="fieldErrors.token" class="err">{{ fieldErrors.token }}</p>
                    </div>

                    <div>
                        <label for="password" class="field-label">New Password</label>
                        <div class="input-wrap">
                            <i class="fa-solid fa-lock input-ico"></i>
                            <input :type="showPassword ? 'text' : 'password'" v-model="form.password" id="password"
                                placeholder="Enter new password" class="input pr-12" :disabled="isSubmitting" />
                            <button type="button" class="eye-btn" @click="showPassword = !showPassword"
                                :disabled="isSubmitting">
                                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                            </button>
                        </div>

                        <div class="mt-3">
                            <div class="flex items-center justify-between">
                                <p class="text-sm text-slate-500">Password strength</p>
                                <p class="text-sm font-semibold" :class="strengthTextClass">{{ strengthLabel }}</p>
                            </div>
                            <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                <div class="h-full rounded-full transition-all" :class="strengthBarClass"
                                    :style="{ width: strengthPercent + '%' }"></div>
                            </div>
                        </div>

                        <p v-if="fieldErrors.password" class="err">{{ fieldErrors.password }}</p>
                    </div>

                    <div>
                        <label for="confirmPassword" class="field-label">Confirm Password</label>
                        <div class="input-wrap">
                            <i class="fa-solid fa-shield input-ico"></i>
                            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword"
                                id="confirmPassword" placeholder="Confirm new password" class="input pr-12"
                                :disabled="isSubmitting" />
                            <button type="button" class="eye-btn" @click="showConfirmPassword = !showConfirmPassword"
                                :disabled="isSubmitting">
                                <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                            </button>
                        </div>
                        <p v-if="fieldErrors.confirmPassword" class="err">{{ fieldErrors.confirmPassword }}</p>
                    </div>

                    <button type="submit" class="btn-primary w-full" :disabled="isSubmitting">
                        <span v-if="!isSubmitting" class="inline-flex items-center">
                            Reset password
                            <i class="fa-solid fa-arrow-right ml-2"></i>
                        </span>
                        <span v-else class="inline-flex items-center gap-2">
                            <span class="spinner"></span>
                            Updating...
                        </span>
                    </button>
                </form>

                <div v-if="statusMessage" class="mt-4 rounded-2xl px-4 py-3 text-sm border" :class="statusType === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-red-200 bg-red-50 text-red-600'">
                    {{ statusMessage }}
                </div>

                <p class="mt-6 text-sm text-slate-400 text-center">
                    Password security • Temporary demo reset flow
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";
import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);
const statusMessage = ref("");
const statusType = ref("error");

const form = reactive({
    email: "",
    token: "",
    password: "",
    confirmPassword: "",
});

const fieldErrors = reactive({
    email: "",
    token: "",
    password: "",
    confirmPassword: "",
});

const isDemoMode = computed(() => route.query.mode === "demo");

onMounted(() => {
    form.email = String(route.query.email || "");
    form.token = String(route.query.token || "");

    if (form.email && form.token) {
        toast.success("Reset token loaded. You can now create a new password.");
    }
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

function clearErrors() {
    fieldErrors.email = "";
    fieldErrors.token = "";
    fieldErrors.password = "";
    fieldErrors.confirmPassword = "";
    statusMessage.value = "";
}

const strengthScore = computed(() => {
    const p = form.password || "";
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
});

const strengthPercent = computed(() =>
    Math.min(100, Math.round((strengthScore.value / 4) * 100))
);

const strengthLabel = computed(() => {
    const s = strengthScore.value;
    if (s <= 1) return "Weak";
    if (s === 2) return "Fair";
    if (s === 3) return "Good";
    return "Strong";
});

const strengthBarClass = computed(() => {
    const s = strengthScore.value;
    if (s <= 1) return "bg-red-500";
    if (s === 2) return "bg-amber-500";
    if (s === 3) return "bg-orange-600";
    return "bg-emerald-500";
});

const strengthTextClass = computed(() => {
    const s = strengthScore.value;
    if (s <= 1) return "text-red-600";
    if (s === 2) return "text-amber-600";
    if (s === 3) return "text-orange-700";
    return "text-emerald-600";
});

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

    if (!form.token.trim()) {
        fieldErrors.token = "Reset token is required.";
        valid = false;
    }

    if (!form.password) {
        fieldErrors.password = "New password is required.";
        valid = false;
    } else if (!validatePassword(form.password)) {
        fieldErrors.password =
            "Password must be 8+ chars, include uppercase, lowercase, and a number.";
        valid = false;
    }

    if (!form.confirmPassword) {
        fieldErrors.confirmPassword = "Please confirm your password.";
        valid = false;
    } else if (form.password !== form.confirmPassword) {
        fieldErrors.confirmPassword = "Passwords do not match.";
        valid = false;
    }

    if (!valid) return;

    isSubmitting.value = true;
    statusType.value = "error";

    try {
        const res = await auth.resetPassword({
            email: form.email.trim(),
            token: form.token.trim(),
            newPassword: form.password,
        });

        statusType.value = "success";
        statusMessage.value =
            res?.message || "Password reset successful. You can now log in.";

        toast.success(statusMessage.value);

        setTimeout(() => {
            router.replace("/login?reset=success");
        }, 800);
    } catch (err) {
        const msg = err?.response?.data?.message || "Unable to reset password.";
        statusMessage.value = msg;
        toast.error(msg);
    } finally {
        isSubmitting.value = false;
    }
}
</script>
