// src/composables/usePagination.js
import { computed, ref, watch } from "vue";

export function usePagination(source, initialPerPage = 10) {
    const currentPage = ref(1);
    const itemsPerPage = ref(initialPerPage);

    const totalCount = computed(() => source.value.length);
    const totalPages = computed(() =>
        Math.max(1, Math.ceil(totalCount.value / Number(itemsPerPage.value)))
    );

    const paginatedItems = computed(() => {
        const start = (currentPage.value - 1) * Number(itemsPerPage.value);
        const end = start + Number(itemsPerPage.value);
        return source.value.slice(start, end);
    });

    const paginationStart = computed(() => {
        if (totalCount.value === 0) return 0;
        return (currentPage.value - 1) * Number(itemsPerPage.value) + 1;
    });

    const paginationEnd = computed(() => {
        return Math.min(currentPage.value * Number(itemsPerPage.value), totalCount.value);
    });

    const visiblePageNumbers = computed(() => {
        const total = totalPages.value;
        const current = currentPage.value;

        let start = Math.max(1, current - 1);
        let end = Math.min(total, current + 1);

        if (current <= 2) end = Math.min(total, 3);
        if (current >= total - 1) start = Math.max(1, total - 2);

        const pages = [];
        for (let i = start; i <= end; i += 1) pages.push(i);
        return pages;
    });

    function goToPage(page) {
        if (page < 1 || page > totalPages.value) return;
        currentPage.value = page;
    }

    function goToPreviousPage() {
        if (currentPage.value > 1) currentPage.value -= 1;
    }

    function goToNextPage() {
        if (currentPage.value < totalPages.value) currentPage.value += 1;
    }

    watch(itemsPerPage, (value) => {
        itemsPerPage.value = Number(value);
    });

    watch(totalPages, (newTotal) => {
        if (currentPage.value > newTotal) currentPage.value = newTotal;
    });

    return {
        currentPage,
        itemsPerPage,
        totalCount,
        totalPages,
        paginatedItems,
        paginationStart,
        paginationEnd,
        visiblePageNumbers,
        goToPage,
        goToPreviousPage,
        goToNextPage,
    };
}