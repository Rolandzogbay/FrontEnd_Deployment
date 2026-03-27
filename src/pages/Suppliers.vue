<template>
  <div class="min-h-screen bg-slate-50">
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

    <div class="min-h-screen flex flex-col lg:pl-72">
      <!-- Header -->
      <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md overflow-visible">
        <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div class="mx-auto max-w-[1800px]">
            <div class="flex flex-col gap-4">
              <div class="flex items-start sm:items-center justify-between gap-3">
                <div class="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <button
                    class="lg:hidden mt-0.5 sm:mt-0 h-11 w-11 rounded-2xl border border-slate-200 bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition grid place-items-center shrink-0"
                    @click="sidebarOpen = true">
                    <i class="fa-solid fa-bars text-lg"></i>
                  </button>

                  <div class="min-w-0">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight truncate">
                      Suppliers
                    </h1>
                    <p
                      class="mt-1 text-xs sm:text-sm lg:text-base text-slate-500 line-clamp-2 sm:line-clamp-1 max-w-4xl">
                      Manage supplier relationships, contact records, sourcing information, and
                      purchasing support from one place.
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button class="group relative shrink-0" aria-label="Open profile" title="Profile" type="button">
                    <img src="../assets/Roland.jpg" alt="Profile"
                      class="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-orange-200 object-cover bg-white group-hover:border-orange-400 transition" />
                    <span
                      class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </button>
                </div>
              </div>

              <div class="w-full">
                <div class="relative">
                  <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input v-model="searchQuery" type="text"
                    placeholder="Search by supplier name, contact person, email, or phone..."
                    class="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base transition" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden">
        <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div class="mx-auto max-w-[1800px]">
            <!-- Success alert -->
            <transition enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="transform opacity-100 translate-y-0"
              leave-to-class="transform opacity-0 -translate-y-2">
              <div v-if="showAlert"
                class="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3">
                <i class="fa-solid fa-check-circle text-green-600 text-xl mt-0.5"></i>
                <div class="flex-1">
                  <p class="font-medium text-green-800">{{ alertMessage }}</p>
                </div>
                <button @click="showAlert = false" class="text-green-600 hover:text-green-700">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </transition>

            <!-- Error alert -->
            <transition enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="transform opacity-100 translate-y-0"
              leave-to-class="transform opacity-0 -translate-y-2">
              <div v-if="errorMessage"
                class="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <i class="fa-solid fa-circle-exclamation text-red-600 text-xl mt-0.5"></i>
                <div class="flex-1">
                  <p class="font-medium text-red-800">{{ errorMessage }}</p>
                </div>
                <button @click="errorMessage = ''" class="text-red-600 hover:text-red-700">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </transition>

            <!-- KPI -->
            <section class="mb-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
                <div
                  class="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4">
                  <div class="min-w-0">
                    <p class="text-slate-500 text-sm sm:text-base font-medium">Total Suppliers</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2">
                      {{ formatNumber(filteredSuppliers.length) }}
                    </h3>
                    <p class="text-emerald-600 text-sm mt-2 flex items-center gap-2">
                      <i class="fa-solid fa-arrow-trend-up text-xs"></i>
                      Visible in current filter
                    </p>
                  </div>
                  <div
                    class="w-14 h-14 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-truck-field"></i>
                  </div>
                </div>

                <div
                  class="rounded-[28px] border border-orange-300 bg-orange-500 px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4 text-white">
                  <div class="min-w-0">
                    <p class="text-orange-100 text-sm sm:text-base font-medium">With Email</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-2">
                      {{ formatNumber(suppliersWithEmailCount) }}
                    </h3>
                    <p class="text-orange-50/90 text-sm mt-2">Contactable by email</p>
                  </div>
                  <div class="w-14 h-14 rounded-full bg-white/15 text-white grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-envelope"></i>
                  </div>
                </div>

                <div
                  class="rounded-[28px] border border-slate-800 bg-slate-950 px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4 text-white">
                  <div class="min-w-0">
                    <p class="text-slate-300 text-sm sm:text-base font-medium">With Phone</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-2">
                      {{ formatNumber(suppliersWithPhoneCount) }}
                    </h3>
                    <p class="text-slate-300 text-sm mt-2">Ready for direct calls</p>
                  </div>
                  <div class="w-14 h-14 rounded-full bg-white/10 text-white grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-phone"></i>
                  </div>
                </div>

                <div
                  class="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4">
                  <div class="min-w-0">
                    <p class="text-slate-500 text-sm sm:text-base font-medium">New This Month</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2">
                      {{ formatNumber(newThisMonthCount) }}
                    </h3>
                    <p class="text-violet-500 text-sm mt-2">Based on supplier creation date</p>
                  </div>
                  <div
                    class="w-14 h-14 rounded-full bg-violet-100 text-violet-600 grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-building-circle-check"></i>
                  </div>
                </div>
              </div>
            </section>

            <!-- Main section -->
            <section class="bg-white p-5 sm:p-6 rounded-[28px] shadow-sm border border-slate-200">
              <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
                <div>
                  <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Supplier Directory</h2>
                  <p class="text-sm sm:text-base text-slate-500 mt-1">
                    Keep sourcing partners organized with their contact details, notes, and business
                    information.
                  </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-3 w-full xl:w-auto">
                  <select v-model="filterBy"
                    class="px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-sm sm:text-base">
                    <option value="">Sort By</option>
                    <option value="Newest">Newest First</option>
                    <option value="Oldest">Oldest First</option>
                    <option value="NameAZ">Name (A-Z)</option>
                    <option value="NameZA">Name (Z-A)</option>
                    <option value="ContactAZ">Contact Person (A-Z)</option>
                    <option value="Email">Has Email First</option>
                  </select>

                  <select v-model.number="itemsPerPage"
                    class="px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-sm sm:text-base">
                    <option :value="5">5 per page</option>
                    <option :value="10">10 per page</option>
                    <option :value="15">15 per page</option>
                    <option :value="20">20 per page</option>
                  </select>

                  <button
                    class="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    @click="openAddModal" :disabled="isMutating">
                    <i class="fa-solid fa-plus mr-2"></i>
                    Add Supplier
                  </button>
                </div>
              </div>

              <div v-if="loadingSuppliers" class="py-16 text-center">
                <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
                </div>
                <p class="text-slate-500 mt-4">Loading suppliers...</p>
              </div>

              <div v-else-if="filteredSuppliers.length === 0" class="py-16 text-center">
                <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center mx-auto mb-4">
                  <i class="fa-solid fa-truck-field text-2xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-slate-800">No suppliers found</h3>
                <p class="text-slate-500 mt-1">Try changing your search or add a new supplier.</p>
              </div>

              <!-- Desktop table -->
              <div v-else class="hidden xl:block overflow-x-auto">
                <table class="w-full min-w-[1200px] text-left">
                  <thead class="border-b border-slate-200 bg-slate-50/80">
                    <tr class="text-slate-500 text-sm">
                      <th class="py-4 px-4 font-semibold rounded-l-2xl">Supplier</th>
                      <th class="py-4 px-4 font-semibold">Contact Person</th>
                      <th class="py-4 px-4 font-semibold">Email</th>
                      <th class="py-4 px-4 font-semibold">Phone</th>
                      <th class="py-4 px-4 font-semibold">Address</th>
                      <th class="py-4 px-4 font-semibold rounded-r-2xl">Actions</th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="supplier in paginatedSuppliers" :key="supplier.id"
                      class="hover:bg-orange-50/40 transition cursor-pointer" @click="openDetailsModal(supplier)">
                      <td class="py-4 px-4">
                        <div class="flex items-center gap-3">
                          <div
                            class="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 grid place-items-center text-lg shrink-0">
                            <i class="fa-solid fa-truck-ramp-box"></i>
                          </div>
                          <div class="min-w-0">
                            <p class="font-semibold text-sm sm:text-base text-slate-900 truncate">
                              {{ supplier.name || "Unnamed Supplier" }}
                            </p>
                            <p class="text-xs text-slate-400">
                              ID: #SUP{{ String(supplier.id).padStart(4, "0") }}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td class="px-4 text-slate-700 text-sm sm:text-base">
                        {{ supplier.contact_person || "No contact person" }}
                      </td>

                      <td class="px-4 text-slate-700 text-sm sm:text-base">
                        <span class="truncate block max-w-[220px]">
                          {{ supplier.email
                            || "No email" }}
                        </span>
                      </td>

                      <td class="px-4 text-slate-700 text-sm sm:text-base">
                        {{ supplier.phone_number || "No phone number" }}
                      </td>

                      <td class="px-4 text-slate-700 text-sm sm:text-base">
                        <p class="line-clamp-2">{{ supplier.address || "No address added" }}</p>
                      </td>

                      <td class="px-4" @click.stop>
                        <div class="flex items-center gap-2">
                          <button @click="openDetailsModal(supplier)"
                            class="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition grid place-items-center"
                            title="View supplier">
                            <i class="fa-solid fa-eye"></i>
                          </button>

                          <button @click="openEditModal(supplier)"
                            class="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition grid place-items-center disabled:opacity-50"
                            :disabled="isMutating">
                            <i class="fa-solid fa-pen-to-square"></i>
                          </button>

                          <button @click="requestDeleteSupplier(supplier)" :disabled="isMutating"
                            class="w-10 h-10 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition grid place-items-center disabled:opacity-50">
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile cards -->
              <div v-if="!loadingSuppliers && filteredSuppliers.length > 0" class="xl:hidden p-4 sm:p-5 space-y-4">
                <div v-for="supplier in paginatedSuppliers" :key="supplier.id"
                  class="border border-slate-200 rounded-[24px] p-4 sm:p-5 bg-white shadow-sm">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="font-semibold text-slate-900 truncate">{{ supplier.name ||
                        "Unnamed Supplier" }}</p>
                      <p class="text-xs text-slate-400">ID: #SUP{{ String(supplier.id).padStart(4,
                        "0") }}</p>
                    </div>

                    <span
                      class="px-3 py-1 text-xs rounded-full font-semibold inline-flex items-center gap-2 shrink-0 bg-orange-50 text-orange-700">
                      <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                      Supplier
                    </span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                    <div>
                      <p class="text-slate-400">Contact Person</p>
                      <p class="font-medium text-slate-800">
                        {{ supplier.contact_person ||
                          "No contact person" }}
                      </p>
                    </div>

                    <div>
                      <p class="text-slate-400">Phone</p>
                      <p class="font-medium text-slate-800">
                        {{ supplier.phone_number
                          ||
                          "No phone number" }}
                      </p>
                    </div>

                    <div class="sm:col-span-2">
                      <p class="text-slate-400">Email</p>
                      <p class="font-medium text-slate-800 break-all">
                        {{ supplier.email
                          || "No email" }}
                      </p>
                    </div>

                    <div class="sm:col-span-2">
                      <p class="text-slate-400">Address</p>
                      <p class="font-medium text-slate-800">
                        {{ supplier.address
                          ||
                          "No address added" }}
                      </p>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-2 mt-4">
                    <button @click="openDetailsModal(supplier)"
                      class="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                      View
                    </button>

                    <button @click="openEditModal(supplier)"
                      class="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                      Edit
                    </button>

                    <button @click="requestDeleteSupplier(supplier)"
                      class="px-4 py-2.5 rounded-2xl border border-red-200 hover:bg-red-50 text-red-700 font-medium transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="filteredSuppliers.length > 0" class="flex flex-col gap-4 mt-6 pt-5 border-t border-slate-100">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div class="text-sm text-slate-600">
                    Showing <span class="font-semibold">{{ startIndex + 1 }}</span> to
                    <span class="font-semibold">{{ Math.min(endIndex, filteredSuppliers.length)
                      }}</span> of
                    <span class="font-semibold">{{ filteredSuppliers.length }}</span> suppliers
                  </div>

                  <div class="text-sm text-slate-500">
                    Page <span class="font-semibold text-slate-700">{{ currentPage }}</span> of
                    <span class="font-semibold text-slate-700">{{ totalPages }}</span>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <button @click="previousPage" :disabled="currentPage === 1"
                    class="px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition text-sm w-full sm:w-auto">
                    <i class="fa-solid fa-chevron-left mr-1"></i>
                    Previous
                  </button>

                  <div class="flex gap-1.5 flex-wrap justify-center">
                    <button v-for="page in visiblePages" :key="page" @click="currentPage = page"
                      :class="page === currentPage ? 'px-3 py-2 bg-orange-600 text-white rounded-xl text-sm' : 'px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm'">
                      {{ page }}
                    </button>
                  </div>

                  <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition text-sm w-full sm:w-auto">
                    Next
                    <i class="fa-solid fa-chevron-right ml-1"></i>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>

    <!-- Modal -->
    <SupplierModal :isOpen="showSupplierModal" :initialData="formSupplier" :isEditMode="isEditMode"
      @close="closeSupplierModal" @submit="handleSupplierSubmit" />

    <!-- Details Modal -->
    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showDetailsModal && selectedSupplier"
        class="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
        @click="closeDetailsModal">
        <div
          class="w-full sm:max-w-4xl h-[92dvh] sm:h-auto sm:max-h-[90vh] bg-white rounded-t-[28px] sm:rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
          @click.stop>
          <div
            class="sticky top-0 z-10 px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-200 bg-slate-50/95 backdrop-blur shrink-0">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                <div
                  class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center text-xl sm:text-2xl shrink-0">
                  <i class="fa-solid fa-truck-ramp-box"></i>
                </div>

                <div class="min-w-0">
                  <p class="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
                    Supplier Details
                  </p>
                  <h3 class="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                    {{ selectedSupplier.name || "Unnamed Supplier" }}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-500 mt-1">
                    ID: #SUP{{ String(selectedSupplier.id).padStart(4, "0") }}
                  </p>
                </div>
              </div>

              <button @click="closeDetailsModal"
                class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 grid place-items-center shrink-0">
                <i class="fa-solid fa-xmark text-base sm:text-lg"></i>
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-4 sm:p-7">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div class="rounded-3xl border border-slate-200 bg-white p-4">
                <p class="text-xs sm:text-sm text-slate-500 font-medium">Email</p>
                <p class="text-sm sm:text-lg font-bold text-slate-900 mt-2 break-all">
                  {{ selectedSupplier.email || "No email" }}
                </p>
              </div>

              <div class="rounded-3xl border border-orange-200 bg-orange-500 p-4 text-white">
                <p class="text-xs sm:text-sm text-orange-100 font-medium">Phone</p>
                <p class="text-sm sm:text-lg font-bold mt-2 break-words">
                  {{ selectedSupplier.phone_number || "No phone number" }}
                </p>
              </div>

              <div class="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-white">
                <p class="text-xs sm:text-sm text-slate-300 font-medium">Contact Person</p>
                <p class="text-sm sm:text-lg font-bold mt-2">
                  {{ selectedSupplier.contact_person || "Not assigned" }}
                </p>
              </div>

              <div class="rounded-3xl border border-violet-200 bg-violet-50 p-4">
                <p class="text-xs sm:text-sm text-violet-700 font-medium">Created</p>
                <p class="text-sm sm:text-lg font-bold text-slate-900 mt-2">
                  {{ formatDate(selectedSupplier.createdAt) }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
              <div class="xl:col-span-2 rounded-[24px] sm:rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5">
                <h4 class="text-base sm:text-lg font-semibold text-slate-900 mb-4">Supplier Overview
                </h4>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Supplier Name</p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">
                      {{ selectedSupplier.name || "—" }}
                    </p>
                  </div>

                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Supplier ID</p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">
                      #SUP{{ String(selectedSupplier.id).padStart(4, "0") }}
                    </p>
                  </div>

                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Contact Person</p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">
                      {{ selectedSupplier.contact_person || "No contact person added" }}
                    </p>
                  </div>

                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Phone Number</p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">
                      {{ selectedSupplier.phone_number || "No phone number added" }}
                    </p>
                  </div>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100 mb-4">
                  <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Address</p>
                  <p class="text-sm sm:text-base text-slate-700 mt-2 leading-7">
                    {{ selectedSupplier.address?.trim()
                      ||
                      "No address has been added for this supplier yet." }}
                  </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100 mb-4">
                  <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Email</p>
                  <p class="text-sm sm:text-base text-slate-700 mt-2 leading-7 break-all">
                    {{ selectedSupplier.email?.trim()
                      ||
                      "No email has been added for this supplier yet."
                    }}
                  </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Notes</p>
                  <p class="text-sm sm:text-base text-slate-700 mt-2 leading-7">
                    {{ selectedSupplier.notes?.trim()
                      ||
                      "No notes have been added for this supplier yet."
                    }}
                  </p>
                </div>
              </div>

              <div class="rounded-[24px] sm:rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5">
                <h4 class="text-base sm:text-lg font-semibold text-slate-900 mb-4">Quick Actions</h4>

                <div class="space-y-3">
                  <div class="rounded-2xl border border-slate-200 p-4">
                    <p class="text-sm text-slate-500">Contact Readiness</p>
                    <p class="text-xl font-bold text-slate-900 mt-1">{{
                      supplierContactReadiness(selectedSupplier) }}</p>
                  </div>

                  <div class="rounded-2xl border border-slate-200 p-4">
                    <p class="text-sm text-slate-500">Record Completeness</p>
                    <p class="text-xl font-bold text-slate-900 mt-1">{{
                      supplierCompleteness(selectedSupplier) }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-3 mt-5">
                  <button @click="openEditFromDetails"
                    class="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition disabled:opacity-50"
                    :disabled="isMutating">
                    <i class="fa-solid fa-pen-to-square mr-2"></i>
                    Edit Supplier
                  </button>

                  <button @click="requestDeleteSupplier(selectedSupplier)" :disabled="isMutating"
                    class="w-full px-4 py-3 border border-red-200 hover:bg-red-50 text-red-700 rounded-2xl font-medium transition disabled:opacity-50">
                    <i class="fa-solid fa-trash-can mr-2"></i>
                    Delete Supplier
                  </button>

                  <button @click="closeDetailsModal"
                    class="w-full px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-medium transition">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Confirm modal -->
    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="confirmState.open"
        class="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click="closeConfirmModal">
        <div class="w-full max-w-lg bg-white rounded-[28px] border border-slate-200 shadow-2xl overflow-hidden"
          @click.stop>
          <div class="p-6 border-b border-slate-100">
            <div class="flex items-start gap-4">
              <div :class="confirmIconClass" class="w-12 h-12 rounded-2xl grid place-items-center text-lg shrink-0">
                <i :class="confirmState.icon"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900">{{ confirmState.title }}</h3>
                <p class="text-sm text-slate-500 mt-2 leading-6">{{ confirmState.message }}</p>
              </div>
            </div>
          </div>

          <div class="p-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
            <button
              class="px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition"
              @click="closeConfirmModal" :disabled="confirmState.loading">
              Cancel
            </button>
            <button class="px-4 py-3 rounded-2xl text-white font-medium transition disabled:opacity-60"
              :class="confirmButtonClass" @click="executeConfirmAction" :disabled="confirmState.loading">
              <span v-if="!confirmState.loading">{{ confirmState.confirmText }}</span>
              <span v-else class="inline-flex items-center gap-2">
                <i class="fa-solid fa-spinner animate-spin"></i>
                Processing...
              </span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, ref, watch, onMounted } from "vue";
import SideBar from "@/components/SideBar.vue";
import SuppliersModal from "../components/Suppliers.modal.vue";
const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_BASE_URL = `${API_ROOT}/suppliers`;

const sidebarOpen = ref(false);
const searchQuery = ref("");
const filterBy = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showSupplierModal = ref(false);
const showDetailsModal = ref(false);
const showAlert = ref(false);
const alertMessage = ref("");
const errorMessage = ref("");
const loadingSuppliers = ref(false);
const isSubmittingSupplier = ref(false);
const isMutating = ref(false);
const isEditMode = ref(false);
const editingSupplierId = ref(null);
const selectedSupplier = ref(null);

const suppliers = ref([]);

const formSupplier = ref({
  id: null,
  name: "",
  email: "",
  phone_number: "",
  contact_person: "",
  address: "",
  notes: "",
});

const confirmState = ref({
  open: false,
  title: "",
  message: "",
  confirmText: "Confirm",
  variant: "warning",
  icon: "fa-solid fa-circle-exclamation",
  loading: false,
  action: null,
});

const getToken = () => localStorage.getItem("token");

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const confirmButtonClass = computed(() => {
  if (confirmState.value.variant === "danger") return "bg-red-600 hover:bg-red-700";
  if (confirmState.value.variant === "success") return "bg-emerald-600 hover:bg-emerald-700";
  return "bg-amber-600 hover:bg-amber-700";
});

const confirmIconClass = computed(() => {
  if (confirmState.value.variant === "danger") return "bg-red-100 text-red-600";
  if (confirmState.value.variant === "success") return "bg-emerald-100 text-emerald-600";
  return "bg-amber-100 text-amber-600";
});

const showSuccess = (message) => {
  alertMessage.value = message;
  showAlert.value = true;

  setTimeout(() => {
    showAlert.value = false;
  }, 3000);
};

const normalizeSupplierPayload = (supplierData) => {
  const name = String(supplierData.name || "").trim();
  const email = String(supplierData.email || "").trim();
  const phone_number = String(supplierData.phone_number || "").trim();
  const contact_person = String(supplierData.contact_person || "").trim();
  const address = String(supplierData.address || "").trim();
  const notes = String(supplierData.notes || "").trim();

  if (!name) throw new Error("Supplier name is required.");

  return {
    name,
    email: email || null,
    phone_number: phone_number || null,
    contact_person: contact_person || null,
    address: address || null,
    notes: notes || null,
  };
};

const resetFormSupplier = () => {
  formSupplier.value = {
    id: null,
    name: "",
    email: "",
    phone_number: "",
    contact_person: "",
    address: "",
    notes: "",
  };
  isEditMode.value = false;
  editingSupplierId.value = null;
};

const openAddModal = () => {
  resetFormSupplier();
  showSupplierModal.value = true;
};

const openEditModal = (supplier) => {
  if (!supplier || isMutating.value) return;

  showDetailsModal.value = false;
  isEditMode.value = true;
  editingSupplierId.value = supplier.id;

  formSupplier.value = {
    id: supplier.id,
    name: supplier.name || "",
    email: supplier.email || "",
    phone_number: supplier.phone_number || "",
    contact_person: supplier.contact_person || "",
    address: supplier.address || "",
    notes: supplier.notes || "",
  };

  showSupplierModal.value = true;
};

const openEditFromDetails = () => {
  if (!selectedSupplier.value) return;
  openEditModal(selectedSupplier.value);
};

const closeSupplierModal = () => {
  if (isSubmittingSupplier.value) return;
  showSupplierModal.value = false;
  resetFormSupplier();
};

const fetchSupplierDetails = async (supplierId) => {
  const response = await axios.get(`${API_BASE_URL}/${supplierId}`, axiosConfig());
  return response.data;
};

const openDetailsModal = async (supplier) => {
  if (!supplier) return;

  selectedSupplier.value = { ...supplier };
  showDetailsModal.value = true;

  try {
    const fullSupplier = await fetchSupplierDetails(supplier.id);
    selectedSupplier.value = { ...fullSupplier };
    suppliers.value = suppliers.value.map((s) => (s.id === fullSupplier.id ? { ...s, ...fullSupplier } : s));
  } catch (error) {
    console.error("Failed to fetch full supplier details:", error);
  }
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedSupplier.value = null;
};

const openConfirmModal = ({ title, message, confirmText, variant, icon, action }) => {
  confirmState.value = {
    open: true,
    title,
    message,
    confirmText,
    variant,
    icon,
    loading: false,
    action,
  };
};

const closeConfirmModal = () => {
  if (confirmState.value.loading) return;
  confirmState.value = {
    open: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    variant: "warning",
    icon: "fa-solid fa-circle-exclamation",
    loading: false,
    action: null,
  };
};

const executeConfirmAction = async () => {
  if (!confirmState.value.action || confirmState.value.loading) return;

  confirmState.value.loading = true;
  try {
    await confirmState.value.action();
    closeConfirmModal();
  } catch {
    confirmState.value.loading = false;
  }
};

const fetchSuppliers = async () => {
  loadingSuppliers.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(API_BASE_URL, axiosConfig());
    suppliers.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to load suppliers";
    suppliers.value = [];
  } finally {
    loadingSuppliers.value = false;
  }
};

const createSupplier = async (payload) => {
  isSubmittingSupplier.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.post(API_BASE_URL, payload, axiosConfig());
    showSuccess(response.data?.message || "Supplier created successfully!");
    showSupplierModal.value = false;
    resetFormSupplier();
    await fetchSuppliers();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to create supplier";
  } finally {
    isSubmittingSupplier.value = false;
  }
};

const updateSupplier = async (id, payload) => {
  isSubmittingSupplier.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, payload, axiosConfig());
    showSuccess(response.data?.message || "Supplier updated successfully!");
    showSupplierModal.value = false;
    resetFormSupplier();
    await fetchSuppliers();

    if (selectedSupplier.value?.id === id) {
      try {
        const refreshed = await fetchSupplierDetails(id);
        selectedSupplier.value = { ...refreshed };
      } catch {
        //
      }
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to update supplier";
  } finally {
    isSubmittingSupplier.value = false;
  }
};

const deleteSupplier = async (supplier) => {
  isMutating.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.delete(`${API_BASE_URL}/${supplier.id}`, axiosConfig());
    suppliers.value = suppliers.value.filter((s) => s.id !== supplier.id);

    if (selectedSupplier.value?.id === supplier.id) {
      closeDetailsModal();
    }

    showSuccess(response.data?.message || "Supplier deleted successfully!");
    await fetchSuppliers();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to delete supplier";
    throw error;
  } finally {
    isMutating.value = false;
  }
};

const requestDeleteSupplier = (supplier) => {
  openConfirmModal({
    title: "Delete supplier?",
    message: `This will permanently remove "${supplier.name || "this supplier"}" from your supplier records.`,
    confirmText: "Delete Supplier",
    variant: "danger",
    icon: "fa-solid fa-trash-can",
    action: () => deleteSupplier(supplier),
  });
};

const handleSupplierSubmit = async (formData) => {
  try {
    const payload = normalizeSupplierPayload(formData);

    if (isEditMode.value && editingSupplierId.value) {
      await updateSupplier(editingSupplierId.value, payload);
    } else {
      await createSupplier(payload);
    }
  } catch (error) {
    errorMessage.value = error.message || "Failed to process supplier data";
  }
};

const filteredSuppliers = computed(() => {
  let result = [...suppliers.value];
  const globalSearch = searchQuery.value.trim().toLowerCase();

  if (globalSearch) {
    result = result.filter((s) => {
      const name = String(s.name || "").toLowerCase();
      const email = String(s.email || "").toLowerCase();
      const phone = String(s.phone_number || "").toLowerCase();
      const address = String(s.address || "").toLowerCase();
      const contactPerson = String(s.contact_person || "").toLowerCase();
      const id = `#sup${String(s.id).padStart(4, "0")}`.toLowerCase();

      return (
        name.includes(globalSearch) ||
        email.includes(globalSearch) ||
        phone.includes(globalSearch) ||
        address.includes(globalSearch) ||
        contactPerson.includes(globalSearch) ||
        id.includes(globalSearch)
      );
    });
  }

  if (filterBy.value === "Newest") {
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (filterBy.value === "Oldest") {
    result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  } else if (filterBy.value === "NameAZ") {
    result.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
  } else if (filterBy.value === "NameZA") {
    result.sort((a, b) => String(b.name || "").localeCompare(String(a.name || "")));
  } else if (filterBy.value === "ContactAZ") {
    result.sort((a, b) => String(a.contact_person || "").localeCompare(String(b.contact_person || "")));
  } else if (filterBy.value === "Email") {
    result.sort((a, b) => Number(Boolean(b.email)) - Number(Boolean(a.email)));
  }

  return result;
});

const suppliersWithEmailCount = computed(() => filteredSuppliers.value.filter((s) => !!String(s.email || "").trim()).length);
const suppliersWithPhoneCount = computed(() => filteredSuppliers.value.filter((s) => !!String(s.phone_number || "").trim()).length);

const newThisMonthCount = computed(() => {
  const now = new Date();
  return filteredSuppliers.value.filter((supplier) => {
    if (!supplier.createdAt) return false;
    const created = new Date(supplier.createdAt);
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSuppliers.value.length / itemsPerPage.value)));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);
const paginatedSuppliers = computed(() => filteredSuppliers.value.slice(startIndex.value, endIndex.value));

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2;

  let start = Math.max(1, current - delta);
  let end = Math.min(total, current + delta);

  if (current <= 3) end = Math.min(total, 5);
  if (current >= total - 2) start = Math.max(1, total - 4);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const supplierContactReadiness = (supplier) => {
  const hasEmail = !!String(supplier?.email || "").trim();
  const hasPhone = !!String(supplier?.phone_number || "").trim();

  if (hasEmail && hasPhone) return "Full contact info";
  if (hasEmail || hasPhone) return "Partial contact info";
  return "Needs contact details";
};

const supplierCompleteness = (supplier) => {
  let score = 0;
  if (String(supplier?.name || "").trim()) score += 1;
  if (String(supplier?.email || "").trim()) score += 1;
  if (String(supplier?.phone_number || "").trim()) score += 1;
  if (String(supplier?.contact_person || "").trim()) score += 1;
  if (String(supplier?.address || "").trim()) score += 1;
  if (String(supplier?.notes || "").trim()) score += 1;

  if (score >= 6) return "100% complete";
  if (score >= 4) return "Good record";
  return "Needs more details";
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatNumber = (value) => new Intl.NumberFormat().format(Number(value || 0));

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

watch([searchQuery, filterBy, itemsPerPage], () => {
  currentPage.value = 1;
});

onMounted(async () => {
  await fetchSuppliers();
});
</script>