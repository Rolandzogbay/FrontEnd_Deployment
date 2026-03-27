<template>
  <div class="min-h-screen bg-slate-50">
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

    <div class="min-h-screen flex flex-col lg:pl-72">
      <!-- Header -->
      <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md overflow-visible">
        <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div class="mx-auto max-w-[1800px]">
            <div class="flex flex-col gap-4">
              <!-- Top row -->
              <div class="flex items-start sm:items-center justify-between gap-3">
                <div class="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <button
                    class="lg:hidden mt-0.5 sm:mt-0 h-11 w-11 rounded-2xl border border-slate-200 bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition grid place-items-center shrink-0"
                    @click="sidebarOpen = true" aria-label="Toggle sidebar">
                    <i class="fa-solid fa-bars text-lg"></i>
                  </button>

                  <div class="min-w-0">
                    <h1 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight truncate">
                      Customers
                    </h1>
                    <p
                      class="mt-1 text-xs sm:text-sm lg:text-base text-slate-500 line-clamp-2 sm:line-clamp-1 max-w-4xl">
                      Manage customer records, contact details, purchase activity, and relationship history from one
                      professional workspace.
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div class="relative z-50 shrink-0" ref="notificationMenuRef">
                    <button
                      class="relative h-10 w-10 sm:h-11 sm:w-11 rounded-2xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 transition grid place-items-center"
                      @click.stop="toggleNotifications" aria-label="Notifications" aria-haspopup="dialog"
                      :aria-expanded="showNotifications">
                      <i class="fa-solid fa-bell text-slate-700 text-sm sm:text-base"></i>

                      <span v-if="unreadNotificationsCount"
                        class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-[10px] sm:text-[11px] grid place-items-center border-2 border-white">
                        {{ unreadNotificationsCount }}
                      </span>
                    </button>

                    <div v-if="showNotifications && !isSmallScreen"
                      class="absolute right-0 top-full mt-3 z-[90] w-[360px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
                      @click.stop>
                      <div class="px-4 py-4 bg-orange-50 border-b border-orange-100">
                        <div class="flex items-start justify-between gap-3">
                          <div class="min-w-0">
                            <p class="font-semibold text-orange-900">Notifications</p>
                            <p class="text-xs text-orange-800/70 mt-0.5">
                              Customer activity and record updates
                            </p>
                          </div>

                          <button class="text-xs text-orange-800 hover:underline shrink-0" @click="clearNotifications">
                            Clear
                          </button>
                        </div>
                      </div>

                      <ul class="max-h-[420px] overflow-auto">
                        <li v-if="loadingNotifications" class="px-4 py-6 text-sm text-slate-500">
                          Loading notifications...
                        </li>

                        <li v-for="n in notifications" :key="n.id" @click="markNotificationRead(n.id)"
                          class="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                          :class="n.is_read ? 'bg-white' : 'bg-orange-50/40'">
                          <p class="font-semibold text-slate-800">{{ n.title }}</p>
                          <p class="text-slate-600 mt-0.5">{{ n.message }}</p>
                          <p class="text-xs text-slate-500 mt-1">
                            {{ formatNotificationTime(n.createdAt) }}
                          </p>
                        </li>

                        <li v-if="!loadingNotifications && notifications.length === 0"
                          class="px-4 py-6 text-sm text-slate-500">
                          No notifications 🎉
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button class="group relative shrink-0" aria-label="Open profile" title="Profile" type="button">
                    <img src="../assets/Roland.jpg" alt="Profile"
                      class="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-orange-200 object-cover bg-white group-hover:border-orange-400 transition" />
                    <span
                      class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </button>
                </div>
              </div>

              <!-- Bottom row -->
              <div class="w-full">
                <div class="relative">
                  <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input v-model="searchQuery" type="text" placeholder="Search by customer name, ID, email, or phone..."
                    class="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base transition" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Mobile notifications sheet -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showNotifications && isSmallScreen"
          class="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-[2px] px-4 py-6 sm:px-6"
          @click="showNotifications = false">
          <div
            class="mx-auto mt-14 w-full max-w-md rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden"
            @click.stop>
            <div class="px-4 py-4 bg-orange-50 border-b border-orange-100">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="font-semibold text-orange-900">Notifications</p>
                  <p class="text-xs text-orange-800/70 mt-0.5">Customer activity and record updates</p>
                </div>

                <button
                  class="h-9 w-9 rounded-xl text-orange-700 hover:bg-orange-100 grid place-items-center transition"
                  @click="showNotifications = false">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div class="flex items-center gap-3 mt-3">
                <button class="text-xs text-orange-800 hover:underline" @click="clearNotifications">
                  Clear
                </button>
              </div>
            </div>

            <ul class="max-h-[70vh] overflow-auto">
              <li v-if="loadingNotifications" class="px-4 py-6 text-sm text-slate-500">
                Loading notifications...
              </li>

              <li v-for="n in notifications" :key="n.id" @click="markNotificationRead(n.id)"
                class="px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                :class="n.is_read ? 'bg-white' : 'bg-orange-50/40'">
                <p class="font-semibold text-slate-800">{{ n.title }}</p>
                <p class="text-slate-600 mt-0.5">{{ n.message }}</p>
                <p class="text-xs text-slate-500 mt-1">
                  {{ formatNotificationTime(n.createdAt) }}
                </p>
              </li>

              <li v-if="!loadingNotifications && notifications.length === 0"
                class="px-4 py-6 text-sm text-slate-500 text-center">
                No notifications 🎉
              </li>
            </ul>
          </div>
        </div>
      </transition>

      <main class="flex-1 overflow-x-hidden">
        <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div class="mx-auto max-w-[1800px]">
            <!-- success -->
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
                <button @click="showAlert = false" class="text-green-600 hover:text-green-700"
                  aria-label="Close success message">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </transition>

            <!-- error -->
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
                <button @click="errorMessage = ''" class="text-red-600 hover:text-red-700"
                  aria-label="Close error message">
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
                    <p class="text-slate-500 text-sm sm:text-base font-medium">Total Customers</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2">
                      {{ formatNumber(totalCustomersCount) }}
                    </h3>
                    <p class="text-emerald-600 text-sm mt-2 flex items-center gap-2">
                      <i class="fa-solid fa-arrow-trend-up text-xs"></i>
                      Visible in current filter
                    </p>
                  </div>
                  <div
                    class="w-14 h-14 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-users"></i>
                  </div>
                </div>

                <div
                  class="rounded-[28px] border border-orange-300 bg-orange-500 px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4 text-white">
                  <div class="min-w-0">
                    <p class="text-orange-100 text-sm sm:text-base font-medium">Customers With Email</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-2">
                      {{ formatNumber(customersWithEmailCount) }}
                    </h3>
                    <p class="text-orange-50/90 text-sm mt-2">Reachable for updates and receipts</p>
                  </div>
                  <div class="w-14 h-14 rounded-full bg-white/15 text-white grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-envelope-circle-check"></i>
                  </div>
                </div>

                <div
                  class="rounded-[28px] border border-slate-800 bg-slate-950 px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4 text-white">
                  <div class="min-w-0">
                    <p class="text-slate-300 text-sm sm:text-base font-medium">Customers With Phone</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-2">
                      {{ formatNumber(customersWithPhoneCount) }}
                    </h3>
                    <p class="text-slate-300 text-sm mt-2">Available for direct contact</p>
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
                    <p class="text-violet-500 text-sm mt-2">Based on customer creation date</p>
                  </div>
                  <div
                    class="w-14 h-14 rounded-full bg-violet-100 text-violet-600 grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-user-plus"></i>
                  </div>
                </div>
              </div>
            </section>

            <!-- Customer table -->
            <section class="bg-white p-5 sm:p-6 rounded-[28px] shadow-sm border border-slate-200">
              <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
                <div>
                  <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Customer Directory</h2>
                  <p class="text-sm sm:text-base text-slate-500 mt-1">
                    Click any customer row to view full details, contact information, and notes.
                  </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-3 w-full xl:w-auto">
                  <select v-model="filterBy"
                    class="px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-sm sm:text-base"
                    aria-label="Sort customers">
                    <option value="">Sort By</option>
                    <option value="Newest">Newest First</option>
                    <option value="Oldest">Oldest First</option>
                    <option value="NameAZ">Name (A-Z)</option>
                    <option value="NameZA">Name (Z-A)</option>
                    <option value="Email">Has Email First</option>
                    <option value="Phone">Has Phone First</option>
                  </select>

                  <select v-model.number="itemsPerPage"
                    class="px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-sm sm:text-base"
                    aria-label="Items per page">
                    <option :value="5">5 per page</option>
                    <option :value="10">10 per page</option>
                    <option :value="15">15 per page</option>
                    <option :value="20">20 per page</option>
                  </select>

                  <button
                    class="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    @click="openAddModal" :disabled="isMutating">
                    <i class="fa-solid fa-plus mr-2"></i>
                    Add Customer
                  </button>
                </div>
              </div>

              <div v-if="loadingCustomers" class="py-16 text-center">
                <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
                </div>
                <p class="text-slate-500 mt-4">Loading customers...</p>
              </div>

              <div v-else-if="filteredCustomers.length === 0" class="py-16 text-center">
                <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center mx-auto mb-4">
                  <i class="fa-solid fa-user-group text-2xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-slate-800">No customers found</h3>
                <p class="text-slate-500 mt-1">Try changing your search or add a new customer.</p>
              </div>

              <!-- Desktop table -->
              <div v-else class="hidden xl:block overflow-x-auto">
                <table class="w-full min-w-[1080px] text-left">
                  <thead class="border-b border-slate-200 bg-slate-50/80">
                    <tr class="text-slate-500 text-sm">
                      <th class="py-4 px-4 font-semibold rounded-l-2xl">Customer</th>
                      <th class="py-4 px-4 font-semibold">Contact</th>
                      <th class="py-4 px-4 font-semibold">Address</th>
                      <th class="py-4 px-4 font-semibold">Notes</th>
                      <th class="py-4 px-4 font-semibold">Created</th>
                      <th class="py-4 px-4 font-semibold rounded-r-2xl">Actions</th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="customer in paginatedCustomers" :key="customer.id"
                      class="hover:bg-orange-50/40 transition cursor-pointer" @click="openDetailsModal(customer)">
                      <td class="py-4 px-4">
                        <div class="flex items-center gap-3">
                          <div
                            class="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 grid place-items-center text-lg shrink-0">
                            <i class="fa-solid fa-user"></i>
                          </div>
                          <div class="min-w-0">
                            <p class="font-semibold text-sm sm:text-base text-slate-900 truncate">
                              {{ customer.name || "Unnamed Customer" }}
                            </p>
                            <p class="text-xs text-slate-400">
                              ID: #CUST{{ String(customer.id).padStart(4, "0") }}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td class="px-4">
                        <div class="min-w-0">
                          <p class="text-slate-700 text-sm sm:text-base truncate">
                            {{ customer.email || "No email" }}
                          </p>
                          <p class="text-xs sm:text-sm text-slate-500 mt-1">
                            {{ customer.phone_number || "No phone number" }}
                          </p>
                        </div>
                      </td>

                      <td class="px-4 text-slate-700 text-sm sm:text-base">
                        <p class="line-clamp-2">{{ customer.address || "No address added" }}</p>
                      </td>

                      <td class="px-4 text-slate-700 text-sm sm:text-base">
                        <p class="line-clamp-2">{{ customer.notes || "No notes" }}</p>
                      </td>

                      <td class="px-4 text-slate-700 text-sm sm:text-base">
                        {{ formatDate(customer.createdAt) }}
                      </td>

                      <td class="px-4" @click.stop>
                        <div class="flex items-center gap-2">
                          <button @click="openDetailsModal(customer)"
                            class="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition grid place-items-center"
                            title="View customer" aria-label="View customer details" :disabled="isMutating">
                            <i class="fa-solid fa-eye"></i>
                          </button>

                          <button @click="openEditModal(customer)"
                            class="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition grid place-items-center disabled:opacity-50"
                            title="Edit customer" aria-label="Edit customer" :disabled="isMutating">
                            <i class="fa-solid fa-pen-to-square"></i>
                          </button>

                          <button @click="requestDeleteCustomer(customer)" :disabled="isMutating"
                            class="w-10 h-10 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition grid place-items-center disabled:opacity-50"
                            title="Delete customer" aria-label="Delete customer">
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile cards -->
              <div v-if="!loadingCustomers && filteredCustomers.length > 0" class="xl:hidden p-4 sm:p-5 space-y-4">
                <div v-for="customer in paginatedCustomers" :key="customer.id"
                  class="border border-slate-200 rounded-[24px] p-4 sm:p-5 bg-white shadow-sm">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="font-semibold text-slate-900 truncate">{{ customer.name || "Unnamed Customer" }}</p>
                      <p class="text-xs text-slate-400">ID: #CUST{{ String(customer.id).padStart(4, "0") }}</p>
                    </div>

                    <span
                      class="px-3 py-1 text-xs rounded-full font-semibold inline-flex items-center gap-2 shrink-0 bg-orange-50 text-orange-700">
                      <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                      Customer
                    </span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                    <div>
                      <p class="text-slate-400">Email</p>
                      <p class="font-medium text-slate-800 break-all">{{ customer.email || "No email" }}</p>
                    </div>

                    <div>
                      <p class="text-slate-400">Phone</p>
                      <p class="font-medium text-slate-800">{{ customer.phone_number || "No phone number" }}</p>
                    </div>

                    <div class="sm:col-span-2">
                      <p class="text-slate-400">Address</p>
                      <p class="font-medium text-slate-800">{{ customer.address || "No address added" }}</p>
                    </div>

                    <div class="sm:col-span-2">
                      <p class="text-slate-400">Notes</p>
                      <p class="font-medium text-slate-800">{{ customer.notes || "No notes" }}</p>
                    </div>

                    <div class="sm:col-span-2">
                      <p class="text-slate-400">Created</p>
                      <p class="font-medium text-slate-800">{{ formatDate(customer.createdAt) }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-2 mt-4">
                    <button @click="openDetailsModal(customer)"
                      class="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                      View
                    </button>

                    <button @click="openEditModal(customer)"
                      class="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                      Edit
                    </button>

                    <button @click="requestDeleteCustomer(customer)"
                      class="px-4 py-2.5 rounded-2xl border border-red-200 hover:bg-red-50 text-red-700 font-medium transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="filteredCustomers.length > 0" class="flex flex-col gap-4 mt-6 pt-5 border-t border-slate-100">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div class="text-sm text-slate-600">
                    Showing <span class="font-semibold">{{ startIndex + 1 }}</span> to
                    <span class="font-semibold">{{ Math.min(endIndex, filteredCustomers.length) }}</span> of
                    <span class="font-semibold">{{ filteredCustomers.length }}</span> customers
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
                    <button v-for="page in visiblePages" :key="page" @click="currentPage = page" :class="page === currentPage
                        ? 'px-3 py-2 bg-orange-600 text-white rounded-xl text-sm'
                        : 'px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm'
                      ">
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

    <!-- Reuse your modal if it supports these props/emits -->
    <CustomerModal :isOpen="showAddModal" :initialData="newCustomer" :isEditMode="isEditMode" @close="closeAddModal"
      @submit="handleCustomerSubmit" />

    <!-- Details Modal -->
    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showDetailsModal && selectedCustomer"
        class="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
        @click="closeDetailsModal">
        <div ref="detailsModalRef"
          class="w-full sm:max-w-4xl h-[92dvh] sm:h-auto sm:max-h-[90vh] bg-white rounded-t-[28px] sm:rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
          @click.stop role="dialog" aria-modal="true" aria-labelledby="customer-details-title" tabindex="-1">
          <div
            class="sticky top-0 z-10 px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-200 bg-slate-50/95 backdrop-blur shrink-0">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                <div
                  class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center text-xl sm:text-2xl shrink-0">
                  <i class="fa-solid fa-user"></i>
                </div>

                <div class="min-w-0">
                  <p class="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
                    Customer Details
                  </p>
                  <h3 id="customer-details-title" class="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                    {{ selectedCustomer.name || "Unnamed Customer" }}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-500 mt-1">
                    ID: #CUST{{ String(selectedCustomer.id).padStart(4, "0") }}
                  </p>
                </div>
              </div>

              <button @click="closeDetailsModal"
                class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 grid place-items-center shrink-0"
                aria-label="Close customer details">
                <i class="fa-solid fa-xmark text-base sm:text-lg"></i>
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-4 sm:p-7">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div class="rounded-3xl border border-slate-200 bg-white p-4">
                <p class="text-xs sm:text-sm text-slate-500 font-medium">Email</p>
                <p class="text-sm sm:text-lg font-bold text-slate-900 mt-2 break-all">
                  {{ selectedCustomer.email || "No email" }}
                </p>
              </div>

              <div class="rounded-3xl border border-orange-200 bg-orange-500 p-4 text-white">
                <p class="text-xs sm:text-sm text-orange-100 font-medium">Phone</p>
                <p class="text-sm sm:text-lg font-bold mt-2 break-words">
                  {{ selectedCustomer.phone_number || "No phone number" }}
                </p>
              </div>

              <div class="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-white">
                <p class="text-xs sm:text-sm text-slate-300 font-medium">Created</p>
                <p class="text-sm sm:text-lg font-bold mt-2">
                  {{ formatDate(selectedCustomer.createdAt) }}
                </p>
              </div>

              <div class="rounded-3xl border border-violet-200 bg-violet-50 p-4">
                <p class="text-xs sm:text-sm text-violet-700 font-medium">Updated</p>
                <p class="text-sm sm:text-lg font-bold text-slate-900 mt-2">
                  {{ formatDate(selectedCustomer.updatedAt || selectedCustomer.createdAt) }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
              <div class="xl:col-span-2 rounded-[24px] sm:rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5">
                <h4 class="text-base sm:text-lg font-semibold text-slate-900 mb-4">Customer Overview</h4>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Full Name
                    </p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">
                      {{ selectedCustomer.name || "—" }}
                    </p>
                  </div>

                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Customer ID
                    </p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">
                      #CUST{{ String(selectedCustomer.id).padStart(4, "0") }}
                    </p>
                  </div>

                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Email Address
                    </p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2 break-all">
                      {{ selectedCustomer.email || "No email address added" }}
                    </p>
                  </div>

                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Phone Number
                    </p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">
                      {{ selectedCustomer.phone_number || "No phone number added" }}
                    </p>
                  </div>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100 mb-4">
                  <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Address
                  </p>
                  <p class="text-sm sm:text-base text-slate-700 mt-2 leading-7">
                    {{ selectedCustomer.address?.trim() || "No address has been added for this customer yet." }}
                  </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Notes
                  </p>
                  <p class="text-sm sm:text-base text-slate-700 mt-2 leading-7">
                    {{ selectedCustomer.notes?.trim() || "No notes have been added for this customer yet." }}
                  </p>
                </div>
              </div>

              <div class="rounded-[24px] sm:rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5">
                <h4 class="text-base sm:text-lg font-semibold text-slate-900 mb-4">Quick Actions</h4>

                <div class="space-y-3">
                  <div class="rounded-2xl border border-slate-200 p-4">
                    <p class="text-sm text-slate-500">Contact Readiness</p>
                    <p class="text-xl font-bold text-slate-900 mt-1">{{ customerContactReadiness(selectedCustomer) }}
                    </p>
                  </div>

                  <div class="rounded-2xl border border-slate-200 p-4">
                    <p class="text-sm text-slate-500">Record Completeness</p>
                    <p class="text-xl font-bold text-slate-900 mt-1">{{ customerCompleteness(selectedCustomer) }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-3 mt-5">
                  <button @click="openEditFromDetails"
                    class="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition disabled:opacity-50"
                    :disabled="isMutating">
                    <i class="fa-solid fa-pen-to-square mr-2"></i>
                    Edit Customer
                  </button>

                  <button @click="requestDeleteCustomer(selectedCustomer)" :disabled="isMutating"
                    class="w-full px-4 py-3 border border-red-200 hover:bg-red-50 text-red-700 rounded-2xl font-medium transition disabled:opacity-50">
                    <i class="fa-solid fa-trash-can mr-2"></i>
                    Delete Customer
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
        <div ref="confirmModalRef"
          class="w-full max-w-lg bg-white rounded-[28px] border border-slate-200 shadow-2xl overflow-hidden" @click.stop
          role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" tabindex="-1">
          <div class="p-6 border-b border-slate-100">
            <div class="flex items-start gap-4">
              <div :class="confirmIconClass" class="w-12 h-12 rounded-2xl grid place-items-center text-lg shrink-0">
                <i :class="confirmState.icon"></i>
              </div>
              <div>
                <h3 id="confirm-modal-title" class="text-xl font-bold text-slate-900">{{ confirmState.title }}</h3>
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import SideBar from "@/components/SideBar.vue";
import CustomerModal from "@/components/CustomerModal.vue";

const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_BASE_URL = `${API_ROOT}/customers`;
const NOTIFICATION_API = `${API_ROOT}/notifications`;

const sidebarOpen = ref(false);
const searchQuery = ref("");
const filterBy = ref("");
const showNotifications = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showAddModal = ref(false);
const showAlert = ref(false);
const alertMessage = ref("");
const errorMessage = ref("");
const loadingCustomers = ref(false);
const loadingNotifications = ref(false);
const isSubmittingCustomer = ref(false);
const isMutating = ref(false);
const isEditMode = ref(false);
const editingCustomerId = ref(null);
const showDetailsModal = ref(false);
const selectedCustomer = ref(null);
const detailsModalRef = ref(null);
const confirmModalRef = ref(null);
const notificationMenuRef = ref(null);
const windowWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1280);

const isSmallScreen = computed(() => windowWidth.value < 640);

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

const customers = ref([]);
const notifications = ref([]);

const newCustomer = ref({
  id: null,
  name: "",
  email: "",
  phone_number: "",
  address: "",
  notes: "",
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

const unreadNotificationsCount = computed(() => notifications.value.filter((n) => !n.is_read).length);

const totalCustomersCount = computed(() => filteredCustomers.value.length);
const customersWithEmailCount = computed(() => filteredCustomers.value.filter((c) => !!String(c.email || "").trim()).length);
const customersWithPhoneCount = computed(() => filteredCustomers.value.filter((c) => !!String(c.phone_number || "").trim()).length);

const newThisMonthCount = computed(() => {
  const now = new Date();
  return filteredCustomers.value.filter((customer) => {
    if (!customer.createdAt) return false;
    const created = new Date(customer.createdAt);
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;
});

const showSuccess = (message) => {
  alertMessage.value = message;
  showAlert.value = true;

  setTimeout(() => {
    showAlert.value = false;
  }, 3000);
};

const normalizeCustomerPayload = (customerData) => {
  const name = String(customerData.name || "").trim();
  const email = String(customerData.email || "").trim();
  const phone_number = String(customerData.phone_number || customerData.phone || "").trim();
  const address = String(customerData.address || "").trim();
  const notes = String(customerData.notes || "").trim();

  if (!name) {
    throw new Error("Customer name is required.");
  }

  return {
    name,
    email: email || null,
    phone_number: phone_number || null,
    address: address || null,
    notes: notes || null,
  };
};

const resetNewCustomer = () => {
  newCustomer.value = {
    id: null,
    name: "",
    email: "",
    phone_number: "",
    address: "",
    notes: "",
  };
  isEditMode.value = false;
  editingCustomerId.value = null;
};

const openAddModal = () => {
  resetNewCustomer();
  showAddModal.value = true;
};

const openEditModal = (customer) => {
  if (!customer || isMutating.value) return;

  showDetailsModal.value = false;
  isEditMode.value = true;
  editingCustomerId.value = customer.id;

  newCustomer.value = {
    id: customer.id,
    name: customer.name || "",
    email: customer.email || "",
    phone_number: customer.phone_number || customer.phone || "",
    address: customer.address || "",
    notes: customer.notes || "",
  };

  showAddModal.value = true;
};

const openEditFromDetails = () => {
  if (!selectedCustomer.value) return;
  openEditModal(selectedCustomer.value);
};

const closeAddModal = () => {
  if (isSubmittingCustomer.value) return;
  showAddModal.value = false;
  resetNewCustomer();
};

const fetchCustomerDetails = async (customerId) => {
  const response = await axios.get(`${API_BASE_URL}/${customerId}`, axiosConfig());
  return response.data;
};

const openDetailsModal = async (customer) => {
  if (!customer) return;

  selectedCustomer.value = { ...customer };
  showDetailsModal.value = true;

  await nextTick();
  detailsModalRef.value?.focus();

  try {
    const fullCustomer = await fetchCustomerDetails(customer.id);
    selectedCustomer.value = { ...fullCustomer };
    customers.value = customers.value.map((c) => (c.id === fullCustomer.id ? { ...c, ...fullCustomer } : c));
  } catch (error) {
    console.error("Failed to fetch full customer details:", error);
  }
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedCustomer.value = null;
};

const openConfirmModal = async ({ title, message, confirmText, variant, icon, action }) => {
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

  await nextTick();
  confirmModalRef.value?.focus();
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

const fetchNotifications = async () => {
  loadingNotifications.value = true;

  try {
    const response = await axios.get(NOTIFICATION_API, axiosConfig());
    notifications.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    notifications.value = [];
  } finally {
    loadingNotifications.value = false;
  }
};

const fetchCustomers = async () => {
  loadingCustomers.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(API_BASE_URL, axiosConfig());
    customers.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to load customers";
    customers.value = [];
  } finally {
    loadingCustomers.value = false;
  }
};

const createCustomer = async (payload) => {
  isSubmittingCustomer.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.post(API_BASE_URL, payload, axiosConfig());
    showSuccess(response.data?.message || "Customer created successfully!");
    showAddModal.value = false;
    resetNewCustomer();
    await fetchCustomers();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to create customer";
  } finally {
    isSubmittingCustomer.value = false;
  }
};

const updateCustomer = async (id, payload) => {
  isSubmittingCustomer.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, payload, axiosConfig());
    showSuccess(response.data?.message || "Customer updated successfully!");
    showAddModal.value = false;
    resetNewCustomer();
    await fetchCustomers();

    if (selectedCustomer.value?.id === id) {
      try {
        const refreshed = await fetchCustomerDetails(id);
        selectedCustomer.value = { ...refreshed };
      } catch {
        // ignore
      }
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to update customer";
  } finally {
    isSubmittingCustomer.value = false;
  }
};

const deleteCustomer = async (customer) => {
  isMutating.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.delete(`${API_BASE_URL}/${customer.id}`, axiosConfig());
    customers.value = customers.value.filter((c) => c.id !== customer.id);

    if (selectedCustomer.value?.id === customer.id) {
      closeDetailsModal();
    }

    showSuccess(response.data?.message || "Customer deleted successfully!");
    await fetchCustomers();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to delete customer";
    throw error;
  } finally {
    isMutating.value = false;
  }
};

const requestDeleteCustomer = (customer) => {
  openConfirmModal({
    title: "Delete customer?",
    message: `This will permanently remove "${customer.name || "this customer"}" from your customer records.`,
    confirmText: "Delete Customer",
    variant: "danger",
    icon: "fa-solid fa-trash-can",
    action: () => deleteCustomer(customer),
  });
};

const handleCustomerSubmit = async (formData) => {
  try {
    const payload = normalizeCustomerPayload(formData);

    if (isEditMode.value && editingCustomerId.value) {
      await updateCustomer(editingCustomerId.value, payload);
    } else {
      await createCustomer(payload);
    }
  } catch (error) {
    errorMessage.value = error.message || "Failed to process customer data";
  }
};

const filteredCustomers = computed(() => {
  let result = [...customers.value];
  const globalSearch = searchQuery.value.trim().toLowerCase();

  if (globalSearch) {
    result = result.filter((c) => {
      const name = String(c.name || "").toLowerCase();
      const email = String(c.email || "").toLowerCase();
      const phone = String(c.phone_number || c.phone || "").toLowerCase();
      const address = String(c.address || "").toLowerCase();
      const id = `#cust${String(c.id).padStart(4, "0")}`.toLowerCase();

      return (
        name.includes(globalSearch) ||
        email.includes(globalSearch) ||
        phone.includes(globalSearch) ||
        address.includes(globalSearch) ||
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
  } else if (filterBy.value === "Email") {
    result.sort((a, b) => Number(Boolean(b.email)) - Number(Boolean(a.email)));
  } else if (filterBy.value === "Phone") {
    result.sort((a, b) => Number(Boolean(b.phone_number || b.phone)) - Number(Boolean(a.phone_number || a.phone)));
  }

  return result;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCustomers.value.length / itemsPerPage.value)));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);
const paginatedCustomers = computed(() => filteredCustomers.value.slice(startIndex.value, endIndex.value));

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

const customerContactReadiness = (customer) => {
  const hasEmail = !!String(customer?.email || "").trim();
  const hasPhone = !!String(customer?.phone_number || customer?.phone || "").trim();

  if (hasEmail && hasPhone) return "Full contact info";
  if (hasEmail || hasPhone) return "Partial contact info";
  return "Needs contact details";
};

const customerCompleteness = (customer) => {
  let score = 0;
  if (String(customer?.name || "").trim()) score += 1;
  if (String(customer?.email || "").trim()) score += 1;
  if (String(customer?.phone_number || customer?.phone || "").trim()) score += 1;
  if (String(customer?.address || "").trim()) score += 1;
  if (String(customer?.notes || "").trim()) score += 1;

  if (score === 5) return "100% complete";
  if (score >= 3) return "Good record";
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

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const formatNotificationTime = (value) => formatDateTime(value);
const formatNumber = (value) => new Intl.NumberFormat().format(Number(value || 0));

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const clearNotifications = () => {
  notifications.value = [];
  showNotifications.value = false;
};

const markNotificationRead = (id) => {
  notifications.value = notifications.value.map((n) =>
    n.id === id ? { ...n, is_read: true } : n
  );
};

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

const handleClickOutside = (event) => {
  if (notificationMenuRef.value && !notificationMenuRef.value.contains(event.target)) {
    showNotifications.value = false;
  }
};

watch([searchQuery, filterBy, itemsPerPage], () => {
  currentPage.value = 1;
});

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  document.addEventListener("click", handleClickOutside);

  await Promise.allSettled([fetchCustomers(), fetchNotifications()]);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("click", handleClickOutside);
});
</script>