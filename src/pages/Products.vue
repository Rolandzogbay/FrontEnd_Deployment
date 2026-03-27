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
                      Products
                    </h1>
                    <p
                      class="mt-1 text-xs sm:text-sm lg:text-base text-slate-500 line-clamp-2 sm:line-clamp-1 max-w-4xl">
                      Manage inventory, pricing, stock movement, and product performance from one professional
                      workspace.
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

                    <!-- Desktop / tablet dropdown -->
                    <div v-if="showNotifications && !isSmallScreen"
                      class="absolute right-0 top-full mt-3 z-[90] w-[360px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
                      @click.stop>
                      <div class="px-4 py-4 bg-orange-50 border-b border-orange-100">
                        <div class="flex items-start justify-between gap-3">
                          <div class="min-w-0">
                            <p class="font-semibold text-orange-900">Notifications</p>
                            <p class="text-xs text-orange-800/70 mt-0.5">
                              Product activity and stock alerts
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
                </div>
              </div>

              <!-- Bottom row -->
              <div class="w-full">
                <div class="relative">
                  <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input v-model="searchQuery" type="text" placeholder="Search by name, ID, or description..."
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
                  <p class="text-xs text-orange-800/70 mt-0.5">Product activity and stock alerts</p>
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

            <section class="mb-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
                <div
                  class="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4">
                  <div class="min-w-0">
                    <p class="text-slate-500 text-sm sm:text-base font-medium">Total Products</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2">
                      {{ formatNumber(totalProductsCount) }}
                    </h3>
                    <p class="text-emerald-600 text-sm mt-2 flex items-center gap-2">
                      <i class="fa-solid fa-arrow-trend-up text-xs"></i>
                      Visible in current filter
                    </p>
                  </div>
                  <div
                    class="w-14 h-14 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-boxes-stacked"></i>
                  </div>
                </div>

                <div
                  class="rounded-[28px] border border-orange-300 bg-orange-500 px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4 text-white">
                  <div class="min-w-0">
                    <p class="text-orange-100 text-sm sm:text-base font-medium">In Stock</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-2">
                      {{ formatNumber(inStockCount) }}
                    </h3>
                    <p class="text-orange-50/90 text-sm mt-2">Products available for sale right now</p>
                  </div>
                  <div class="w-14 h-14 rounded-full bg-white/15 text-white grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-circle-check"></i>
                  </div>
                </div>

                <div
                  class="rounded-[28px] border border-slate-800 bg-slate-950 px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4 text-white">
                  <div class="min-w-0">
                    <p class="text-slate-300 text-sm sm:text-base font-medium">Low Stock</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-2">
                      {{ formatNumber(lowStockCount) }}
                    </h3>
                    <p class="text-slate-300 text-sm mt-2">Items nearing reorder threshold</p>
                  </div>
                  <div class="w-14 h-14 rounded-full bg-white/10 text-white grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                  </div>
                </div>

                <div
                  class="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm min-h-[132px] flex items-center justify-between gap-4">
                  <div class="min-w-0">
                    <p class="text-slate-500 text-sm sm:text-base font-medium">Stock Value</p>
                    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2 break-words">
                      {{ formatMoney(stockValue) }}
                    </h3>
                    <p class="text-violet-500 text-sm mt-2">Estimated retail inventory value</p>
                  </div>
                  <div
                    class="w-14 h-14 rounded-full bg-violet-100 text-violet-600 grid place-items-center text-xl shrink-0">
                    <i class="fa-solid fa-sack-dollar"></i>
                  </div>
                </div>
              </div>
            </section>

            <section class="bg-white p-5 sm:p-6 rounded-[28px] shadow-sm border border-slate-200">
              <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
                <div>
                  <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Inventory Catalog</h2>
                  <p class="text-sm sm:text-base text-slate-500 mt-1">
                    Click any product row to view full details, pricing, quantity, and archive state.
                  </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-3 w-full xl:w-auto">
                  <select v-model="statusFilter"
                    class="px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-sm sm:text-base"
                    aria-label="Filter products by record state">
                    <option value="active">Active Products</option>
                    <option value="archived">Archived Products</option>
                    <option value="all">All Products</option>
                  </select>

                  <select v-model="filterBy"
                    class="px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-sm sm:text-base"
                    aria-label="Sort products">
                    <option value="">Sort By</option>
                    <option value="Price">Cost Price (Low to High)</option>
                    <option value="SellingPrice">Selling Price (Low to High)</option>
                    <option value="Quantity">Quantity (High to Low)</option>
                    <option value="Status">Status (Available First)</option>
                    <option value="Newest">Newest First</option>
                  </select>

                  <button v-if="statusFilter !== 'archived'"
                    class="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    @click="openAddModal" :disabled="isMutating">
                    <i class="fa-solid fa-plus mr-2"></i>
                    Add Product
                  </button>
                </div>
              </div>

              <div v-if="loadingProducts" class="py-16 text-center">
                <div class="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto">
                </div>
                <p class="text-slate-500 mt-4">Loading products...</p>
              </div>

              <div v-else-if="filteredProducts.length === 0" class="py-16 text-center">
                <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center mx-auto mb-4">
                  <i class="fa-solid fa-box-open text-2xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-slate-800">No products found</h3>
                <p class="text-slate-500 mt-1">Try changing your search, status filter, or add a new product.</p>
              </div>

              <!-- Desktop table -->
              <div v-else class="hidden xl:block overflow-x-auto">
                <table class="w-full min-w-[1080px] text-left">
                  <thead class="border-b border-slate-200 bg-slate-50/80">
                    <tr class="text-slate-500 text-sm">
                      <th class="py-4 px-4 font-semibold rounded-l-2xl">Product Name</th>
                      <th class="py-4 px-4 font-semibold">Cost Price</th>
                      <th class="py-4 px-4 font-semibold">Selling Price</th>
                      <th class="py-4 px-4 font-semibold">Quantity</th>
                      <th class="py-4 px-4 font-semibold">Status</th>
                      <th class="py-4 px-4 font-semibold">Margin</th>
                      <th class="py-4 px-4 font-semibold rounded-r-2xl">Actions</th>
                    </tr>
                  </thead>

                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="product in paginatedProducts" :key="product.id"
                      class="hover:bg-orange-50/40 transition cursor-pointer" @click="openDetailsModal(product)">
                      <td class="py-4 px-4">
                        <div class="flex items-center gap-3">
                          <div
                            class="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 grid place-items-center text-lg shrink-0">
                            <i class="fa-solid fa-box"></i>
                          </div>
                          <div class="min-w-0">
                            <p class="font-semibold text-sm sm:text-base text-slate-900 truncate">{{ product.name }}</p>
                            <p class="text-xs text-slate-400">ID: #PRD{{ String(product.id).padStart(4, "0") }}</p>
                            <p v-if="product.description" class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">
                              {{ product.description }}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td class="px-4 text-slate-700 text-sm sm:text-base">{{ formatMoney(product.price) }}</td>
                      <td class="px-4 text-slate-700 text-sm sm:text-base">{{ formatMoney(product.selling_price) }}</td>
                      <td class="px-4 text-slate-700 text-sm sm:text-base font-semibold">
                        {{ formatNumber(product.stock_quantity) }}
                      </td>
                      <td class="px-4">
                        <div class="flex flex-col gap-2">
                          <span :class="productStatusClass(product)"
                            class="px-3 py-1.5 text-xs sm:text-sm rounded-full font-semibold inline-flex items-center gap-2 w-fit">
                            <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                            {{ productStatusText(product) }}
                          </span>
                          <span
                            :class="product.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                            class="px-3 py-1 text-[11px] rounded-full font-semibold inline-flex items-center gap-2 w-fit">
                            <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                            {{ product.is_active ? "Active Record" : "Archived Record" }}
                          </span>
                        </div>
                      </td>
                      <td class="px-4 text-slate-700 text-sm sm:text-base font-medium">{{ productMargin(product) }}</td>
                      <td class="px-4" @click.stop>
                        <div class="flex items-center gap-2">
                          <button @click="openDetailsModal(product)"
                            class="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition grid place-items-center"
                            title="View product" aria-label="View product details" :disabled="isMutating">
                            <i class="fa-solid fa-eye"></i>
                          </button>

                          <button v-if="product.is_active" @click="openEditModal(product)"
                            class="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition grid place-items-center disabled:opacity-50"
                            title="Edit product" aria-label="Edit product" :disabled="isMutating">
                            <i class="fa-solid fa-pen-to-square"></i>
                          </button>

                          <button v-if="product.is_active" @click="requestArchiveProduct(product)"
                            :disabled="isMutating"
                            class="w-10 h-10 rounded-xl border border-amber-200 text-amber-600 hover:bg-amber-50 transition grid place-items-center disabled:opacity-50"
                            title="Archive product" aria-label="Archive product">
                            <i class="fa-solid fa-box-archive"></i>
                          </button>

                          <button v-else @click="requestRestoreProduct(product)" :disabled="isMutating"
                            class="w-10 h-10 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition grid place-items-center disabled:opacity-50"
                            title="Restore product" aria-label="Restore product">
                            <i class="fa-solid fa-rotate-left"></i>
                          </button>

                          <button v-if="!product.is_active" @click="requestDeleteProductPermanently(product)"
                            :disabled="isMutating"
                            class="w-10 h-10 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition grid place-items-center disabled:opacity-50"
                            title="Delete permanently" aria-label="Delete product permanently">
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile / tablet cards -->
              <div v-if="!loadingProducts && filteredProducts.length > 0" class="xl:hidden p-4 sm:p-5 space-y-4">
                <div v-for="product in paginatedProducts" :key="product.id"
                  class="border border-slate-200 rounded-[24px] p-4 sm:p-5 bg-white shadow-sm">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="font-semibold text-slate-900 truncate">{{ product.name }}</p>
                      <p class="text-xs text-slate-400">ID: #PRD{{ String(product.id).padStart(4, "0") }}</p>
                    </div>

                    <span class="px-3 py-1 text-xs rounded-full font-semibold inline-flex items-center gap-2 shrink-0"
                      :class="productStatusClass(product)">
                      <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                      {{ productStatusText(product) }}
                    </span>
                  </div>

                  <p v-if="product.description" class="text-sm text-slate-500 mt-3 line-clamp-2">
                    {{ product.description }}
                  </p>

                  <div class="grid grid-cols-2 gap-3 mt-4 text-sm">
                    <div>
                      <p class="text-slate-400">Cost Price</p>
                      <p class="font-medium text-slate-800">{{ formatMoney(product.price) }}</p>
                    </div>

                    <div>
                      <p class="text-slate-400">Selling Price</p>
                      <p class="font-medium text-slate-800">{{ formatMoney(product.selling_price) }}</p>
                    </div>

                    <div>
                      <p class="text-slate-400">Quantity</p>
                      <p class="font-medium text-slate-800">{{ formatNumber(product.stock_quantity) }}</p>
                    </div>

                    <div>
                      <p class="text-slate-400">Margin</p>
                      <p class="font-medium text-slate-800">{{ productMargin(product) }}</p>
                    </div>

                    <div class="col-span-2">
                      <p class="text-slate-400">Record State</p>
                      <p class="font-medium mt-1" :class="product.is_active ? 'text-emerald-700' : 'text-slate-600'">
                        {{ product.is_active ? "Active Record" : "Archived Record" }}
                      </p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                    <button @click="openDetailsModal(product)"
                      class="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                      View
                    </button>

                    <button v-if="product.is_active" @click="openEditModal(product)"
                      class="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition">
                      Edit
                    </button>

                    <button v-if="product.is_active" @click="requestArchiveProduct(product)"
                      class="px-4 py-2.5 rounded-2xl border border-amber-200 hover:bg-amber-50 text-amber-700 font-medium transition">
                      Archive
                    </button>

                    <button v-else @click="requestRestoreProduct(product)"
                      class="px-4 py-2.5 rounded-2xl border border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-medium transition">
                      Restore
                    </button>

                    <button v-if="!product.is_active" @click="requestDeleteProductPermanently(product)"
                      class="px-4 py-2.5 rounded-2xl border border-red-200 hover:bg-red-50 text-red-700 font-medium transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="filteredProducts.length > 0" class="flex flex-col gap-4 mt-6 pt-5 border-t border-slate-100">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div class="text-sm text-slate-600">
                    Showing <span class="font-semibold">{{ startIndex + 1 }}</span> to
                    <span class="font-semibold">{{ Math.min(endIndex, filteredProducts.length) }}</span> of
                    <span class="font-semibold">{{ filteredProducts.length }}</span> products
                  </div>

                  <div class="flex items-center gap-2 flex-wrap">
                    <label class="text-sm text-slate-600">Items per page:</label>
                    <select v-model.number="itemsPerPage"
                      class="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
                      aria-label="Items per page">
                      <option :value="5">5</option>
                      <option :value="10">10</option>
                      <option :value="15">15</option>
                      <option :value="20">20</option>
                    </select>
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

    <ProductModal :isOpen="showAddModal" :initialData="newProduct" :isEditMode="isEditMode" @close="closeAddModal"
      @submit="handleProductSubmit" />

    <!-- Product details modal -->
    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showDetailsModal && selectedProduct"
        class="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
        @click="closeDetailsModal">
        <div ref="detailsModalRef"
          class="w-full sm:max-w-4xl h-[92dvh] sm:h-auto sm:max-h-[90vh] bg-white rounded-t-[28px] sm:rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
          @click.stop role="dialog" aria-modal="true" aria-labelledby="product-details-title" tabindex="-1">
          <div
            class="sticky top-0 z-10 px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-200 bg-slate-50/95 backdrop-blur shrink-0">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                <div
                  class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center text-xl sm:text-2xl shrink-0">
                  <i class="fa-solid fa-box"></i>
                </div>

                <div class="min-w-0">
                  <p class="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
                    Product Details
                  </p>
                  <h3 id="product-details-title" class="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                    {{ selectedProduct.name }}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-500 mt-1">
                    ID: #PRD{{ String(selectedProduct.id).padStart(4, "0") }}
                  </p>
                </div>
              </div>

              <button @click="closeDetailsModal"
                class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 grid place-items-center shrink-0"
                aria-label="Close product details">
                <i class="fa-solid fa-xmark text-base sm:text-lg"></i>
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-4 sm:p-7">
            <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div class="rounded-3xl border border-slate-200 bg-white p-4">
                <p class="text-xs sm:text-sm text-slate-500 font-medium">Cost Price</p>
                <p class="text-lg sm:text-2xl font-extrabold text-slate-900 mt-2 break-words">
                  {{ formatMoney(selectedProduct.price) }}
                </p>
              </div>

              <div class="rounded-3xl border border-orange-200 bg-orange-500 p-4 text-white">
                <p class="text-xs sm:text-sm text-orange-100 font-medium">Selling Price</p>
                <p class="text-lg sm:text-2xl font-extrabold mt-2 break-words">
                  {{ formatMoney(selectedProduct.selling_price) }}
                </p>
              </div>

              <div class="rounded-3xl border border-slate-800 bg-slate-950 p-4 text-white">
                <p class="text-xs sm:text-sm text-slate-300 font-medium">Quantity</p>
                <p class="text-lg sm:text-2xl font-extrabold mt-2">
                  {{ formatNumber(selectedProduct.stock_quantity) }}
                </p>
              </div>

              <div class="rounded-3xl border border-violet-200 bg-violet-50 p-4">
                <p class="text-xs sm:text-sm text-violet-700 font-medium">Status</p>
                <div class="mt-3">
                  <span :class="productStatusClass(selectedProduct)"
                    class="px-3 py-1.5 rounded-full font-semibold text-xs sm:text-sm inline-flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                    {{ productStatusText(selectedProduct) }}
                  </span>
                </div>
              </div>

              <div class="col-span-2 lg:col-span-1 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p class="text-xs sm:text-sm text-slate-500 font-medium">Record State</p>
                <div class="mt-3">
                  <span
                    :class="selectedProduct.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'"
                    class="px-3 py-1.5 rounded-full font-semibold text-xs sm:text-sm inline-flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                    {{ selectedProduct.is_active ? "Active Product" : "Archived Product" }}
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
              <div class="xl:col-span-2 rounded-[24px] sm:rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5">
                <h4 class="text-base sm:text-lg font-semibold text-slate-900 mb-4">Product Overview</h4>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Product Name
                    </p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">
                      {{ selectedProduct.name || "—" }}
                    </p>
                  </div>

                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Reorder Threshold
                    </p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2">
                      {{ formatNumber(selectedProduct.low_stock_threshold || 0) }}
                    </p>
                  </div>

                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Potential Revenue
                    </p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2 break-words">
                      {{ formatMoney(productPotentialRevenue(selectedProduct)) }}
                    </p>
                  </div>

                  <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Estimated Profit
                    </p>
                    <p class="text-sm sm:text-base text-slate-900 font-semibold mt-2 break-words">
                      {{ formatMoney(productEstimatedProfit(selectedProduct)) }}
                    </p>
                  </div>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p class="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 font-semibold">
                    Description
                  </p>
                  <p class="text-sm sm:text-base text-slate-700 mt-2 leading-7">
                    {{ selectedProduct.description?.trim() || "No description has been added for this product yet." }}
                  </p>
                </div>
              </div>

              <div class="rounded-[24px] sm:rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5">
                <h4 class="text-base sm:text-lg font-semibold text-slate-900 mb-4">Quick Insights</h4>

                <div class="space-y-3">
                  <div class="rounded-2xl border border-slate-200 p-4">
                    <p class="text-sm text-slate-500">Unit Margin</p>
                    <p class="text-xl font-bold text-slate-900 mt-1">{{ productMargin(selectedProduct) }}</p>
                  </div>

                  <div class="rounded-2xl border border-slate-200 p-4">
                    <p class="text-sm text-slate-500">Inventory Cost</p>
                    <p class="text-xl font-bold text-slate-900 mt-1">
                      {{ formatMoney(productInventoryCost(selectedProduct)) }}
                    </p>
                  </div>

                  <div class="rounded-2xl border border-slate-200 p-4">
                    <p class="text-sm text-slate-500">Retail Value</p>
                    <p class="text-xl font-bold text-slate-900 mt-1">
                      {{ formatMoney(productPotentialRevenue(selectedProduct)) }}
                    </p>
                  </div>

                  <div class="rounded-2xl border border-slate-200 p-4">
                    <p class="text-sm text-slate-500">Stock Health</p>
                    <p class="text-sm font-semibold mt-1" :class="getStockHealth(selectedProduct).className">
                      {{ getStockHealth(selectedProduct).text }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-3 mt-5">
                  <button v-if="selectedProduct.is_active" @click="openEditFromDetails"
                    class="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition disabled:opacity-50"
                    :disabled="isMutating">
                    <i class="fa-solid fa-pen-to-square mr-2"></i>
                    Edit Product
                  </button>

                  <button v-if="selectedProduct.is_active" @click="requestArchiveProduct(selectedProduct)"
                    :disabled="isMutating"
                    class="w-full px-4 py-3 border border-amber-200 hover:bg-amber-50 text-amber-700 rounded-2xl font-medium transition disabled:opacity-50">
                    <i class="fa-solid fa-box-archive mr-2"></i>
                    Archive Product
                  </button>

                  <button v-else @click="requestRestoreProduct(selectedProduct)" :disabled="isMutating"
                    class="w-full px-4 py-3 border border-emerald-200 hover:bg-emerald-50 text-emerald-700 rounded-2xl font-medium transition disabled:opacity-50">
                    <i class="fa-solid fa-rotate-left mr-2"></i>
                    Restore Product
                  </button>

                  <button v-if="!selectedProduct.is_active" @click="requestDeleteProductPermanently(selectedProduct)"
                    :disabled="isMutating"
                    class="w-full px-4 py-3 border border-red-200 hover:bg-red-50 text-red-700 rounded-2xl font-medium transition disabled:opacity-50">
                    <i class="fa-solid fa-trash-can mr-2"></i>
                    Delete Permanently
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
import ProductModal from "@/components/ProductModal.vue";

const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_BASE_URL = `${API_ROOT}/products`;
const PRODUCT_ARCHIVE_URL = (id) => `${API_BASE_URL}/${id}/archive`;
const PRODUCT_RESTORE_URL = (id) => `${API_BASE_URL}/${id}/restore`;
const PRODUCT_PERMANENT_DELETE_URL = (id) => `${API_BASE_URL}/${id}/permanent`;
const NOTIFICATION_API = `${API_ROOT}/notifications`;

const sidebarOpen = ref(false);
const searchQuery = ref("");
const filterBy = ref("");
const statusFilter = ref("active");
const showNotifications = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showAddModal = ref(false);
const showAlert = ref(false);
const alertMessage = ref("");
const errorMessage = ref("");
const loadingProducts = ref(false);
const loadingNotifications = ref(false);
const isSubmittingProduct = ref(false);
const isMutating = ref(false);
const isEditMode = ref(false);
const editingProductId = ref(null);
const showDetailsModal = ref(false);
const selectedProduct = ref(null);
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

const products = ref([]);
const notifications = ref([]);

const newProduct = ref({
  id: null,
  name: "",
  description: "",
  price: "",
  selling_price: "",
  stock_quantity: "",
  low_stock_threshold: 10,
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
const totalProductsCount = computed(() => filteredProducts.value.length);

const inStockCount = computed(() => {
  return filteredProducts.value.filter((p) => Number(p.stock_quantity || 0) > 0 && p.is_active !== false).length;
});

const lowStockCount = computed(() => {
  return filteredProducts.value.filter((p) => {
    const qty = Number(p.stock_quantity || 0);
    const threshold = Number(p.low_stock_threshold ?? 10);
    return p.is_active !== false && qty > 0 && qty <= threshold;
  }).length;
});

const stockValue = computed(() => {
  return filteredProducts.value.reduce((sum, p) => {
    if (p.is_active === false) return sum;
    return sum + Number(p.stock_quantity || 0) * Number(p.selling_price || 0);
  }, 0);
});

const showSuccess = (message) => {
  alertMessage.value = message;
  showAlert.value = true;

  setTimeout(() => {
    showAlert.value = false;
  }, 3000);
};

const normalizeInteger = (value) => Number.parseInt(String(value ?? "").trim(), 10);
const normalizeNumber = (value) => Number(String(value ?? "").trim());

const validateProductPayload = (productData) => {
  const name = String(productData.name || "").trim();
  const price = normalizeNumber(productData.price);
  const sellingPrice = normalizeNumber(productData.selling_price);
  const stockQuantity = normalizeInteger(productData.stock_quantity);
  const lowStockThreshold = normalizeInteger(productData.low_stock_threshold ?? 10);

  if (!name) {
    throw new Error("Product name is required.");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Cost price must be a valid number greater than or equal to 0.");
  }

  if (!Number.isFinite(sellingPrice) || sellingPrice < 0) {
    throw new Error("Selling price must be a valid number greater than or equal to 0.");
  }

  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    throw new Error("Stock quantity must be a whole number greater than or equal to 0.");
  }

  if (!Number.isInteger(lowStockThreshold) || lowStockThreshold < 0) {
    throw new Error("Low stock threshold must be a whole number greater than or equal to 0.");
  }

  return {
    name,
    description: String(productData.description || "").trim() || null,
    price,
    selling_price: sellingPrice,
    stock_quantity: stockQuantity,
    low_stock_threshold: lowStockThreshold,
  };
};

const resetNewProduct = () => {
  newProduct.value = {
    id: null,
    name: "",
    description: "",
    price: "",
    selling_price: "",
    stock_quantity: "",
    low_stock_threshold: 10,
  };
  isEditMode.value = false;
  editingProductId.value = null;
};

const openAddModal = () => {
  resetNewProduct();
  showAddModal.value = true;
};

const openEditModal = (product) => {
  if (!product || isMutating.value) return;

  showDetailsModal.value = false;
  isEditMode.value = true;
  editingProductId.value = product.id;

  newProduct.value = {
    id: product.id,
    name: product.name || "",
    description: product.description || "",
    price: product.price ?? "",
    selling_price: product.selling_price ?? "",
    stock_quantity: product.stock_quantity ?? "",
    low_stock_threshold: product.low_stock_threshold ?? 10,
  };

  showAddModal.value = true;
};

const openEditFromDetails = () => {
  if (!selectedProduct.value) return;
  openEditModal(selectedProduct.value);
};

const closeAddModal = () => {
  if (isSubmittingProduct.value) return;
  showAddModal.value = false;
  resetNewProduct();
};

const fetchProductDetails = async (productId) => {
  const response = await axios.get(`${API_BASE_URL}/${productId}`, axiosConfig());
  return response.data;
};

const openDetailsModal = async (product) => {
  if (!product) return;

  selectedProduct.value = { ...product };
  showDetailsModal.value = true;

  await nextTick();
  detailsModalRef.value?.focus();

  try {
    const fullProduct = await fetchProductDetails(product.id);
    selectedProduct.value = { ...fullProduct };
    products.value = products.value.map((p) => (p.id === fullProduct.id ? { ...p, ...fullProduct } : p));
  } catch (error) {
    console.error("Failed to fetch full product details:", error);
  }
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedProduct.value = null;
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
  } finally {
    loadingNotifications.value = false;
  }
};

const fetchProducts = async () => {
  loadingProducts.value = true;
  errorMessage.value = "";

  try {
    const includeArchived = statusFilter.value !== "active";
    const response = await axios.get(`${API_BASE_URL}?includeArchived=${includeArchived}`, axiosConfig());
    const records = Array.isArray(response.data) ? response.data : [];

    if (statusFilter.value === "active") {
      products.value = records.filter((p) => p.is_active !== false);
    } else if (statusFilter.value === "archived") {
      products.value = records.filter((p) => p.is_active === false);
    } else {
      products.value = records;
    }

    if (selectedProduct.value?.id) {
      const freshSelected = records.find((p) => p.id === selectedProduct.value.id);
      if (freshSelected) selectedProduct.value = { ...selectedProduct.value, ...freshSelected };
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to fetch products";
  } finally {
    loadingProducts.value = false;
  }
};

const handleProductSubmit = async (productData) => {
  errorMessage.value = "";
  isSubmittingProduct.value = true;

  try {
    const payload = validateProductPayload(productData);

    if (isEditMode.value && editingProductId.value) {
      const response = await axios.put(`${API_BASE_URL}/${editingProductId.value}`, payload, axiosConfig());
      const updatedProduct = response.data.product;
      const index = products.value.findIndex((p) => p.id === updatedProduct.id);

      if (index !== -1) {
        products.value[index] = updatedProduct;
      }

      if (selectedProduct.value?.id === updatedProduct.id) {
        selectedProduct.value = { ...updatedProduct };
      }

      showSuccess(`Product "${updatedProduct.name}" updated successfully!`);
    } else {
      const response = await axios.post(API_BASE_URL, payload, axiosConfig());
      const createdProduct = response.data.product;
      products.value.unshift(createdProduct);
      showSuccess(`Product "${createdProduct.name}" added successfully!`);
    }

    closeAddModal();
    await fetchProducts();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message || "Failed to save product";
  } finally {
    isSubmittingProduct.value = false;
  }
};

const archiveProduct = async (product) => {
  isMutating.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.patch(PRODUCT_ARCHIVE_URL(product.id), {}, axiosConfig());
    const updatedProduct = response.data.product;
    products.value = products.value.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));

    if (selectedProduct.value?.id === updatedProduct.id) {
      selectedProduct.value = { ...updatedProduct };
    }

    showSuccess(response.data.message || "Product archived successfully!");
    await fetchProducts();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to archive product";
    throw error;
  } finally {
    isMutating.value = false;
  }
};

const restoreProduct = async (product) => {
  isMutating.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.patch(PRODUCT_RESTORE_URL(product.id), {}, axiosConfig());
    const updatedProduct = response.data.product;
    products.value = products.value.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));

    if (selectedProduct.value?.id === updatedProduct.id) {
      selectedProduct.value = { ...updatedProduct };
    }

    showSuccess(response.data.message || "Product restored successfully!");
    await fetchProducts();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to restore product";
    throw error;
  } finally {
    isMutating.value = false;
  }
};

const deleteProductPermanently = async (product) => {
  isMutating.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.delete(PRODUCT_PERMANENT_DELETE_URL(product.id), axiosConfig());
    products.value = products.value.filter((p) => p.id !== product.id);

    if (selectedProduct.value?.id === product.id) {
      closeDetailsModal();
    }

    showSuccess(response.data.message || "Product permanently deleted successfully!");
    await fetchProducts();
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to permanently delete product";
    throw error;
  } finally {
    isMutating.value = false;
  }
};

const requestArchiveProduct = (product) => {
  openConfirmModal({
    title: "Archive product?",
    message: `"${product.name}" will be removed from active product lists but kept for sales history and reporting.`,
    confirmText: "Archive Product",
    variant: "warning",
    icon: "fa-solid fa-box-archive",
    action: () => archiveProduct(product),
  });
};

const requestRestoreProduct = (product) => {
  openConfirmModal({
    title: "Restore product?",
    message: `"${product.name}" will return to active product lists and can be sold again.`,
    confirmText: "Restore Product",
    variant: "success",
    icon: "fa-solid fa-rotate-left",
    action: () => restoreProduct(product),
  });
};

const requestDeleteProductPermanently = (product) => {
  openConfirmModal({
    title: "Delete permanently?",
    message: `This will permanently remove "${product.name}". This should only succeed if the product has no sales history and cannot be undone.`,
    confirmText: "Delete Permanently",
    variant: "danger",
    icon: "fa-solid fa-trash-can",
    action: () => deleteProductPermanently(product),
  });
};

const filteredProducts = computed(() => {
  let result = [...products.value];
  const globalSearch = searchQuery.value.trim().toLowerCase();

  if (globalSearch) {
    result = result.filter((p) => {
      const name = String(p.name || "").toLowerCase();
      const description = String(p.description || "").toLowerCase();
      const id = `#prd${String(p.id).padStart(4, "0")}`.toLowerCase();
      return name.includes(globalSearch) || description.includes(globalSearch) || id.includes(globalSearch);
    });
  }

  if (filterBy.value === "Price") {
    result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  } else if (filterBy.value === "SellingPrice") {
    result.sort((a, b) => Number(a.selling_price || 0) - Number(b.selling_price || 0));
  } else if (filterBy.value === "Quantity") {
    result.sort((a, b) => Number(b.stock_quantity || 0) - Number(a.stock_quantity || 0));
  } else if (filterBy.value === "Status") {
    result.sort((a, b) => {
      const aScore =
        Number(a.stock_quantity || 0) <= 0
          ? 0
          : Number(a.stock_quantity || 0) <= Number(a.low_stock_threshold ?? 10)
            ? 1
            : 2;
      const bScore =
        Number(b.stock_quantity || 0) <= 0
          ? 0
          : Number(b.stock_quantity || 0) <= Number(b.low_stock_threshold ?? 10)
            ? 1
            : 2;
      return bScore - aScore;
    });
  } else if (filterBy.value === "Newest") {
    result.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  }

  return result;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage.value)));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);
const paginatedProducts = computed(() => filteredProducts.value.slice(startIndex.value, endIndex.value));

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

const productStatusText = (product) => {
  const qty = Number(product?.stock_quantity || 0);
  const threshold = Number(product?.low_stock_threshold ?? 10);
  if (qty <= 0) return "Out of Stock";
  if (qty <= threshold) return "Low Stock";
  return "Active";
};

const productStatusClass = (product) => {
  const qty = Number(product?.stock_quantity || 0);
  const threshold = Number(product?.low_stock_threshold ?? 10);
  if (qty <= 0) return "bg-red-100 text-red-600";
  if (qty <= threshold) return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-600";
};

const getStockHealth = (product) => {
  const qty = Number(product?.stock_quantity || 0);
  const threshold = Number(product?.low_stock_threshold ?? 10);

  if (qty <= 0) {
    return {
      text: "Restock immediately",
      className: "text-red-600",
    };
  }

  if (qty <= threshold) {
    return {
      text: "Monitor closely",
      className: "text-yellow-600",
    };
  }

  return {
    text: "Healthy stock level",
    className: "text-green-600",
  };
};

const formatMoney = (value) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
};

const formatNumber = (value) => new Intl.NumberFormat().format(Number(value || 0));

const productMarginValue = (product) => Number(product?.selling_price || 0) - Number(product?.price || 0);
const productMargin = (product) => formatMoney(productMarginValue(product));
const productInventoryCost = (product) => Number(product?.price || 0) * Number(product?.stock_quantity || 0);
const productPotentialRevenue = (product) => Number(product?.selling_price || 0) * Number(product?.stock_quantity || 0);
const productEstimatedProfit = (product) => productPotentialRevenue(product) - productInventoryCost(product);

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    await fetchNotifications();
  }
};

const clearNotifications = async () => {
  try {
    await axios.delete(NOTIFICATION_API, axiosConfig());
    notifications.value = [];
    showNotifications.value = false;
  } catch (error) {
    console.error("Failed to clear notification", error);
  }
};

const markNotificationRead = async (notificationId) => {
  try {
    await axios.patch(`${NOTIFICATION_API}/${notificationId}/read`, {}, axiosConfig());
    notifications.value = notifications.value.map((n) =>
      n.id === notificationId ? { ...n, is_read: true } : n
    );
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};

const formatNotificationTime = (dateValue) => {
  if (!dateValue) return "";

  const now = new Date();
  const then = new Date(dateValue);
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const handleResize = () => {
  if (typeof window !== "undefined") {
    windowWidth.value = window.innerWidth;
  }
};

const handleClickOutside = (event) => {
  if (
    showNotifications.value &&
    notificationMenuRef.value &&
    !notificationMenuRef.value.contains(event.target)
  ) {
    showNotifications.value = false;
  }
};

const handleGlobalKeydown = (event) => {
  if (event.key === "Escape") {
    if (confirmState.value.open) {
      closeConfirmModal();
      return;
    }

    if (showDetailsModal.value) {
      closeDetailsModal();
      return;
    }

    if (showNotifications.value) {
      showNotifications.value = false;
    }
  }
};

watch([filterBy, itemsPerPage, searchQuery, statusFilter], () => {
  currentPage.value = 1;
});

watch(filteredProducts, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }

  if (selectedProduct.value && !filteredProducts.value.some((p) => p.id === selectedProduct.value.id)) {
    closeDetailsModal();
  }
});

watch(statusFilter, () => {
  fetchProducts();
});

onMounted(() => {
  fetchProducts();
  fetchNotifications();
  window.addEventListener("keydown", handleGlobalKeydown);
  window.addEventListener("resize", handleResize);
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>