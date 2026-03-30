<template>
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

        <div
            class="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col">
            <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-slate-900">Import Products</h2>
                    <p class="text-sm text-slate-500 mt-1">Upload a CSV or Excel file and preview before import.</p>
                </div>

                <button @click="$emit('close')"
                    class="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-5">
                <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <input ref="fileInputRef" type="file" class="hidden" accept=".csv,.xlsx,.xls"
                        @change="handleFileChange" />

                    <div
                        class="w-14 h-14 mx-auto rounded-2xl bg-orange-100 text-orange-600 grid place-items-center text-xl">
                        <i class="fa-solid fa-file-arrow-up"></i>
                    </div>

                    <h3 class="mt-4 text-lg font-semibold text-slate-900">Choose a file to import</h3>
                    <p class="mt-1 text-sm text-slate-500">Accepted formats: CSV, XLSX, XLS</p>

                    <button type="button" @click="fileInputRef?.click()"
                        class="mt-4 px-5 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition">
                        Select File
                    </button>

                    <p v-if="selectedFile" class="mt-3 text-sm text-slate-700 font-medium">
                        {{ selectedFile.name }}
                    </p>
                </div>

                <div v-if="previewSummary" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div class="bg-white border border-slate-200 rounded-xl p-4">
                            <p class="text-slate-500 text-sm">Total Rows</p>
                            <p class="text-xl font-bold text-slate-900 mt-1">{{ previewSummary.totalRows }}</p>
                        </div>
                        <div class="bg-white border border-slate-200 rounded-xl p-4">
                            <p class="text-slate-500 text-sm">Valid Rows</p>
                            <p class="text-xl font-bold text-emerald-600 mt-1">{{ previewSummary.validRows }}</p>
                        </div>
                        <div class="bg-white border border-slate-200 rounded-xl p-4">
                            <p class="text-slate-500 text-sm">Invalid Rows</p>
                            <p class="text-xl font-bold text-red-600 mt-1">{{ previewSummary.invalidRows }}</p>
                        </div>
                    </div>
                </div>

                <div v-if="previewRows.length" class="rounded-2xl border border-slate-200 overflow-hidden">
                    <div class="px-4 py-3 bg-slate-50 border-b border-slate-200">
                        <h3 class="font-semibold text-slate-900">Preview</h3>
                    </div>

                    <div class="max-h-[320px] overflow-auto">
                        <table class="w-full text-sm">
                            <thead class="bg-white border-b border-slate-200">
                                <tr class="text-slate-500">
                                    <th class="text-left px-4 py-3">Row</th>
                                    <th class="text-left px-4 py-3">Name</th>
                                    <th class="text-left px-4 py-3">Status</th>
                                    <th class="text-left px-4 py-3">Errors</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="row in previewRows" :key="row.rowNumber">
                                    <td class="px-4 py-3">#{{ row.rowNumber }}</td>
                                    <td class="px-4 py-3">{{ row.row?.name || "—" }}</td>
                                    <td class="px-4 py-3">
                                        <span class="px-3 py-1 rounded-full text-xs font-semibold"
                                            :class="row.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">
                                            {{ row.isValid ? "Valid" : "Invalid" }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-red-600 text-xs">
                                        {{ row.errors?.join(", ") || "—" }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {{ errorMessage }}
                </div>

                <div class="flex justify-end gap-3 pt-2">
                    <button type="button" @click="$emit('close')"
                        class="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition">
                        Cancel
                    </button>

                    <button type="button" @click="previewImport"
                        class="px-6 py-3 border border-orange-300 text-orange-700 font-medium rounded-xl hover:bg-orange-50 transition"
                        :disabled="!selectedFile || loading">
                        Preview Import
                    </button>

                    <button type="button" @click="confirmImport"
                        class="px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition disabled:opacity-60"
                        :disabled="!selectedFile || !previewSummary || loading">
                        Confirm Import
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
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["close", "preview", "confirm"]);

const fileInputRef = ref(null);
const selectedFile = ref(null);
const previewSummary = ref(null);
const previewRows = ref([]);
const errorMessage = ref("");

const handleFileChange = (event) => {
    errorMessage.value = "";
    previewSummary.value = null;
    previewRows.value = [];
    selectedFile.value = event.target.files?.[0] || null;
};

const previewImport = () => {
    if (!selectedFile.value) {
        errorMessage.value = "Please select a file first.";
        return;
    }

    errorMessage.value = "";
    emit("preview", {
        file: selectedFile.value,
        onSuccess: (data) => {
            previewSummary.value = {
                totalRows: data.totalRows || 0,
                validRows: data.validRows || 0,
                invalidRows: data.invalidRows || 0,
            };
            previewRows.value = data.preview || [];
        },
        onError: (message) => {
            errorMessage.value = message || "Failed to preview import.";
        },
    });
};

const confirmImport = () => {
    if (!selectedFile.value) {
        errorMessage.value = "Please select a file first.";
        return;
    }

    emit("confirm", {
        file: selectedFile.value,
        onSuccess: () => {
            selectedFile.value = null;
            previewSummary.value = null;
            previewRows.value = [];
            errorMessage.value = "";
            if (fileInputRef.value) fileInputRef.value.value = "";
        },
        onError: (message) => {
            errorMessage.value = message || "Failed to import file.";
        },
    });
};
</script>