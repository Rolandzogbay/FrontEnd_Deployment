<template>
  <div class="border-t border-slate-100 bg-slate-50 px-4 md:px-6 py-4">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <p class="text-sm text-slate-600">
        Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalCount }} sales
      </p>

      <div class="flex items-center gap-3">
        <label class="text-sm text-slate-600">Items per page:</label>
        <select
          :value="itemsPerPage"
          @change="$emit('update:itemsPerPage', Number($event.target.value))"
          class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <div class="mt-4 flex items-center gap-2 flex-wrap">
      <button
        @click="$emit('prev')"
        :disabled="currentPage === 1"
        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="fa-solid fa-chevron-left text-xs"></i>
        Previous
      </button>

      <button
        v-for="page in visiblePageNumbers"
        :key="page"
        @click="$emit('page', page)"
        class="h-10 min-w-[2.5rem] rounded-xl px-3 text-sm font-semibold transition"
        :class="page === currentPage
          ? 'bg-orange-500 text-white shadow-sm'
          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
      >
        {{ page }}
      </button>

      <button
        @click="$emit('next')"
        :disabled="currentPage === totalPages"
        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <i class="fa-solid fa-chevron-right text-xs"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  paginationStart: Number,
  paginationEnd: Number,
  totalCount: Number,
  itemsPerPage: Number,
  currentPage: Number,
  totalPages: Number,
  visiblePageNumbers: Array,
});

defineEmits(["update:itemsPerPage", "page", "prev", "next"]);
</script>