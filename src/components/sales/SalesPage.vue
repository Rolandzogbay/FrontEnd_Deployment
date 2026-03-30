<template>
  <div class="min-h-screen bg-slate-100">
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

    <ToastStack
      :toasts="toasts"
      :toast-class="toastClass"
      :toast-icon-class="toastIconClass"
      :toast-bar-class="toastBarClass"
      :toast-icon="toastIcon"
      @remove="removeToast"
    />

    <div class="min-h-screen flex flex-col lg:pl-72">
      <SalesHeader
        :dashboard-date-range-label="dashboardDateRangeLabel"
        :loading="loading"
        @open-sidebar="sidebarOpen = true"
        @refresh="refreshAll"
        @new-sale="openNewSaleModal"
      />

      <main class="flex-1 px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-5 lg:py-6">
        <div class="mx-auto max-w-[1800px] space-y-4 sm:space-y-5 lg:space-y-6">
          <SalesKpiCards
            :weekly-revenue="weeklyRevenue"
            :weekly-revenue-change="weeklyRevenueChange"
            :total-sales="sales.length"
            :total-items-sold="totalItemsSold"
            :non-cash-sales-count="nonCashSalesCount"
            :format-money="formatMoney"
          />

          <section class="grid grid-cols-1 2xl:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
            <div class="2xl:col-span-4 h-full flex flex-col gap-4 sm:gap-5 lg:gap-6 min-w-0">
              <BestSellersCard :items="bestSellingProducts" :format-money="formatMoney" />
              <TopCustomersCard :items="topCustomers" :format-money="formatMoney" />
              <TodayActivityCard :stats="todayStats" :format-money="formatMoney" />
            </div>

            <section
              class="2xl:col-span-8 overflow-hidden rounded-[22px] sm:rounded-[24px] lg:rounded-[28px] border border-slate-200 bg-white shadow-sm min-w-0"
            >
              <SalesFiltersBar
                :search="search"
                :payment-filter="paymentFilter"
                :sort-by="sortBy"
                @update:search="search = $event"
                @update:paymentFilter="paymentFilter = $event"
                @update:sortBy="sortBy = $event"
              />

              <div v-if="loading" class="px-4 sm:px-6 py-12 sm:py-14 text-center">
                <div class="mx-auto h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin"></div>
                <p class="mt-4 text-sm sm:text-base text-slate-500">Loading sales records...</p>
              </div>

              <div v-else-if="errorMessage" class="p-4 sm:p-6">
                <div class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {{ errorMessage }}
                </div>
              </div>

              <div
                v-else-if="filteredSales.length === 0"
                class="px-4 sm:px-6 py-12 sm:py-14 text-center text-sm sm:text-base text-slate-500"
              >
                No sales found.
              </div>

              <template v-else>
                <SalesTable
                  :sales="paginatedSales"
                  :pagination-start="paginationStart"
                  :deleting-sale-id="deletingSaleId"
                  :get-customer-display-name="getCustomerDisplayName"
                  :get-customer-email="getCustomerEmail"
                  :format-date-time="formatDateTime"
                  :format-payment-method="formatPaymentMethod"
                  :format-money="formatMoney"
                  :format-sale-items-summary="formatSaleItemsSummary"
                  @view="viewSale"
                  @print="printSaleFromList"
                  @delete="removeSale"
                />

                <SalesMobileList
                  :sales="paginatedSales"
                  :deleting-sale-id="deletingSaleId"
                  :get-customer-display-name="getCustomerDisplayName"
                  :format-date-time="formatDateTime"
                  :format-payment-method="formatPaymentMethod"
                  :format-money="formatMoney"
                  :format-sale-items-summary="formatSaleItemsSummary"
                  @view="viewSale"
                  @print="printSaleFromList"
                  @delete="removeSale"
                />

                <SalesPagination
                  :pagination-start="paginationStart"
                  :pagination-end="paginationEnd"
                  :total-count="totalSalesCount"
                  :items-per-page="itemsPerPage"
                  :current-page="currentPage"
                  :total-pages="totalPages"
                  :visible-page-numbers="visiblePageNumbers"
                  @update:itemsPerPage="itemsPerPage = $event"
                  @page="goToPage"
                  @prev="goToPreviousPage"
                  @next="goToNextPage"
                />
              </template>
            </section>
          </section>
        </div>
      </main>

      <SaleDetailsModal
        :open="showViewModal"
        :loading="viewLoading"
        :sale="selectedSale"
        :receipt-business="receiptBusiness"
        :format-money="formatMoney"
        :format-date-time="formatDateTime"
        :format-payment-method="formatPaymentMethod"
        :get-customer-display-name="getCustomerDisplayName"
        :get-customer-email="getCustomerEmail"
        :get-customer-phone="getCustomerPhone"
        :is-walk-in-customer="isWalkInCustomer"
        @close="closeViewModal"
        @print="printSaleReceipt"
      />

      <div
        v-if="showNewSaleModal"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-3 md:p-4 lg:p-6"
      >
        <div
          class="w-full h-[100dvh] sm:h-[95vh] sm:max-h-[95vh] sm:max-w-7xl overflow-hidden rounded-none sm:rounded-[24px] lg:rounded-[30px] bg-white shadow-2xl flex flex-col"
        >
          <div class="flex items-start sm:items-center justify-between gap-3 border-b border-slate-100 px-4 sm:px-5 md:px-6 py-4">
            <div class="min-w-0">
              <h3 class="text-xl sm:text-2xl font-bold text-slate-900">New Sale</h3>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">
                Scan products, search products, attach a customer if needed, and complete checkout.
              </p>
            </div>

            <button
              @click="closeNewSaleModal"
              class="h-10 w-10 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 shrink-0"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="grid flex-1 grid-cols-1 xl:grid-cols-3 overflow-hidden min-h-0">
            <div class="xl:col-span-2 border-b xl:border-b-0 xl:border-r border-slate-100 flex flex-col min-h-0 bg-white">
              <div class="border-b border-slate-100 p-3 sm:p-4 bg-white space-y-3">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-slate-700">
                      Search Products
                    </label>
                    <div class="relative">
                      <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input
                        v-model="productSearch"
                        type="text"
                        placeholder="Search by product name, category, or product code..."
                        class="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="mb-2 block text-sm font-semibold text-slate-700">
                      Scan Product Barcode
                    </label>
                    <div class="relative flex items-center gap-2">
                      <div class="relative flex-1">
                        <i class="fa-solid fa-barcode absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input
                          ref="barcodeInputRef"
                          v-model="barcodeSearch"
                          type="text"
                          placeholder="Scan barcode here"
                          class="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100"
                          @keydown.enter.prevent="handleBarcodeSearch"
                        />
                      </div>

                      <button
                        @click="handleBarcodeSearch"
                        class="shrink-0 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600"
                      >
                        Add
                      </button>
                    </div>
                    <p class="mt-2 text-xs text-slate-500">
                      Use a barcode scanner or type the code manually if needed.
                    </p>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <button
                    @click="focusBarcodeInput"
                    class="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100"
                  >
                    <i class="fa-solid fa-crosshairs mr-2"></i>
                    Focus Scan Input
                  </button>

                  <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <span class="font-semibold text-slate-800">POS Tip:</span>
                    Scan first for faster checkout. Search is available as a fallback.
                  </div>
                </div>
              </div>

              <div v-if="productsLoading" class="p-6 sm:p-8 text-center">
                <div class="mx-auto h-10 w-10 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin"></div>
                <p class="mt-4 text-sm sm:text-base text-slate-500">Loading products...</p>
              </div>

              <div v-else class="min-h-0 overflow-y-auto p-3 sm:p-4 lg:p-5">
                <div v-if="filteredProducts.length === 0" class="py-10 sm:py-12 text-center text-slate-500">
                  No products found.
                </div>

                <template v-else>
                  <div class="grid grid-cols-1 min-[480px]:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4">
                    <button
                      v-for="product in paginatedProducts"
                      :key="product.id"
                      @click="addToCart(product)"
                      :disabled="Number(product.stock_quantity || 0) <= 0 || isProductExpired(product)"
                      class="group rounded-[20px] sm:rounded-[24px] border border-slate-200 bg-white p-3 sm:p-4 text-left shadow-sm transition hover:border-orange-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                            Product
                          </p>
                          <h4 class="line-clamp-2 min-h-[2.75rem] sm:min-h-[3rem] text-sm sm:text-[15px] font-bold text-slate-900 leading-5 sm:leading-6">
                            {{ product.name }}
                          </h4>
                          <p class="mt-2 text-xs text-slate-500">
                            Product ID: #PRD{{ String(product.id).padStart(4, "0") }}
                          </p>

                          <div class="mt-2 flex flex-wrap gap-2">
                            <span
                              v-if="product.category"
                              class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                            >
                              {{ product.category }}
                            </span>

                            <span
                              v-if="product.sku"
                              class="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700"
                            >
                              Code: {{ product.sku }}
                            </span>

                            <span
                              v-if="product.barcode"
                              class="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700"
                            >
                              Barcode
                            </span>

                            <span
                              v-if="product.track_expiry"
                              class="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700"
                            >
                              Expiry Tracked
                            </span>
                          </div>
                        </div>

                        <div class="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl border border-orange-100 bg-orange-50 text-orange-600 grid place-items-center shrink-0 transition group-hover:bg-orange-100">
                          <i class="fa-solid fa-box"></i>
                        </div>
                      </div>

                      <div class="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div class="flex items-center justify-between gap-3">
                          <div class="min-w-0">
                            <p class="text-[11px] uppercase tracking-wide text-slate-400">Price</p>
                            <p class="mt-1 text-base sm:text-lg font-bold text-slate-900 break-words">
                              {{ formatMoney(product.selling_price || product.price || 0) }}
                            </p>
                          </div>

                          <div class="text-right shrink-0">
                            <p class="text-[11px] uppercase tracking-wide text-slate-400">Stock</p>
                            <p class="mt-1 text-sm sm:text-base font-bold text-slate-900">
                              {{ product.stock_quantity ?? 0 }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div class="mt-4 flex items-center justify-between gap-2 sm:gap-3">
                        <span
                          class="rounded-full px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold"
                          :class="productAvailabilityClass(product)"
                        >
                          {{ productAvailabilityText(product) }}
                        </span>

                        <span
                          class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold transition shrink-0"
                          :class="Number(product.stock_quantity || 0) > 0 && !isProductExpired(product)
                            ? 'bg-orange-500 text-white group-hover:bg-orange-600'
                            : 'bg-slate-200 text-slate-500'"
                        >
                          <i class="fa-solid fa-plus"></i>
                          Add
                        </span>
                      </div>
                    </button>
                  </div>

                  <div class="mt-6 border-t border-slate-100 pt-4">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 flex-wrap">
                      <p class="text-sm text-slate-600">
                        Showing {{ productPaginationStart }} to {{ productPaginationEnd }} of
                        {{ totalProductsCount }} products
                      </p>

                      <div class="flex items-center gap-3">
                        <label class="text-sm text-slate-600">Items per page:</label>
                        <select
                          v-model="productItemsPerPage"
                          class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100"
                        >
                          <option :value="6">6</option>
                          <option :value="9">9</option>
                          <option :value="12">12</option>
                          <option :value="18">18</option>
                        </select>
                      </div>
                    </div>

                    <div class="mt-4 flex items-center gap-2 flex-wrap">
                      <button
                        @click="goToPreviousProductPage"
                        :disabled="productCurrentPage === 1"
                        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i class="fa-solid fa-chevron-left text-xs"></i>
                        Previous
                      </button>

                      <button
                        v-for="page in visibleProductPageNumbers"
                        :key="page"
                        @click="goToProductPage(page)"
                        class="h-10 min-w-[2.5rem] rounded-xl px-3 text-sm font-semibold transition"
                        :class="page === productCurrentPage
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
                      >
                        {{ page }}
                      </button>

                      <button
                        @click="goToNextProductPage"
                        :disabled="productCurrentPage === productTotalPages"
                        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <i class="fa-solid fa-chevron-right text-xs"></i>
                      </button>
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <div class="flex flex-col min-h-0 bg-slate-50">
              <div class="border-b border-slate-100 bg-white p-3 sm:p-4 md:p-5">
                <div class="flex items-start sm:items-center justify-between gap-3">
                  <div class="min-w-0">
                    <h4 class="text-lg sm:text-xl font-bold text-slate-900">Checkout Cart</h4>
                    <p class="mt-1 text-xs sm:text-sm text-slate-500">
                      {{ cart.length }} product type(s) selected
                    </p>
                  </div>
                  <div class="rounded-2xl bg-orange-50 px-3 py-2 text-xs sm:text-sm font-semibold text-orange-700 border border-orange-100 shrink-0">
                    {{ cartTotalItems }} item(s)
                  </div>
                </div>
              </div>

              <div class="max-h-[320px] sm:max-h-[340px] overflow-y-auto border-b border-slate-100 bg-white p-3 sm:p-4 space-y-4">
                <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <label class="mb-3 block text-sm font-semibold text-slate-700">Customer Type</label>
                  <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      @click="switchCustomerMode('existing')"
                      :class="customerMode === 'existing'
                        ? 'border-orange-300 bg-orange-50 text-orange-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
                      class="rounded-2xl border py-2.5 px-3 text-sm font-semibold transition"
                    >
                      Existing Customer
                    </button>

                    <button
                      type="button"
                      @click="switchCustomerMode('new')"
                      :class="customerMode === 'new'
                        ? 'border-orange-300 bg-orange-50 text-orange-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
                      class="rounded-2xl border py-2.5 px-3 text-sm font-semibold transition"
                    >
                      New Customer
                    </button>
                  </div>

                  <p class="mt-3 text-xs text-slate-500">
                    Customer is optional. If none is selected, the sale will be saved as a walk-in customer sale.
                  </p>
                </div>

                <div v-if="customerMode === 'existing'" class="space-y-3">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-700">Search Customer</label>
                    <div class="relative">
                      <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input
                        v-model="customerSearch"
                        type="text"
                        placeholder="Search by name, email or phone"
                        class="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100"
                      />
                    </div>
                  </div>

                  <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div v-if="customersLoading" class="p-4 text-sm text-slate-500">Loading customers...</div>

                    <div v-else-if="filteredCustomers.length === 0" class="p-4 text-sm text-slate-500">
                      No matching customers found.
                    </div>

                    <div v-else class="max-h-48 overflow-y-auto">
                      <button
                        v-for="customer in filteredCustomers"
                        :key="customer.id"
                        type="button"
                        @click="selectCustomer(customer)"
                        :class="selectedCustomer?.id === customer.id ? 'bg-orange-50' : 'bg-white hover:bg-slate-50'"
                        class="w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0"
                      >
                        <div class="flex items-start justify-between gap-3">
                          <div class="min-w-0">
                            <p class="truncate font-semibold text-slate-900">{{ customer.name }}</p>
                            <p class="truncate text-xs text-slate-500">{{ customer.email || "No email" }}</p>
                            <p v-if="customer.phone_number" class="mt-1 text-xs text-slate-400">
                              {{ customer.phone_number }}
                            </p>
                          </div>

                          <div
                            v-if="selectedCustomer?.id === customer.id"
                            class="h-7 w-7 rounded-full bg-orange-100 text-orange-600 grid place-items-center shrink-0"
                          >
                            <i class="fa-solid fa-check text-xs"></i>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div v-if="selectedCustomer" class="rounded-3xl border border-green-200 bg-green-50 px-4 py-3">
                    <p class="mb-1 text-xs font-semibold text-green-700">Selected Customer</p>
                    <p class="font-semibold text-slate-900">{{ selectedCustomer.name }}</p>
                    <p class="text-sm text-slate-600 break-all">{{ selectedCustomer.email || "No email" }}</p>
                    <p v-if="selectedCustomer.phone_number" class="mt-1 text-xs text-slate-500">
                      {{ selectedCustomer.phone_number }}
                    </p>
                  </div>
                </div>

                <div v-if="customerMode === 'new'" class="space-y-3">
                  <div class="grid grid-cols-1 gap-3">
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700">Customer Name</label>
                      <input
                        v-model="saleForm.customer_name"
                        type="text"
                        placeholder="Enter customer name"
                        class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100"
                      />
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700">Customer Email</label>
                      <input
                        v-model="saleForm.customer_email"
                        type="email"
                        placeholder="Enter customer email"
                        class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100"
                      />
                    </div>

                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
                      <input
                        v-model="saleForm.customer_phone_number"
                        type="text"
                        placeholder="Enter phone number"
                        class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">Payment Method</label>
                  <select
                    v-model="saleForm.payment_method"
                    class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile_money">Mobile Money</option>
                  </select>
                </div>
              </div>

              <div class="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-4 bg-slate-50">
                <div v-if="cart.length === 0" class="h-full flex items-center justify-center text-center text-slate-500">
                  <div>
                    <div class="mx-auto mb-3 h-14 w-14 sm:h-16 sm:w-16 rounded-3xl border border-slate-200 bg-white text-slate-400 grid place-items-center shadow-sm">
                      <i class="fa-solid fa-cart-shopping text-xl sm:text-2xl"></i>
                    </div>
                    <p class="font-medium text-sm sm:text-base">Your cart is empty</p>
                    <p class="mt-1 text-xs sm:text-sm">Scan a product or add one from the left to start checkout.</p>
                  </div>
                </div>

                <div
                  v-for="item in cart"
                  :key="item.productId"
                  class="rounded-[22px] sm:rounded-[26px] border border-slate-200 bg-white p-3 sm:p-4 shadow-sm"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-start gap-3 min-w-0">
                      <div class="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-orange-50 text-orange-600 grid place-items-center shrink-0">
                        <i class="fa-solid fa-box"></i>
                      </div>
                      <div class="min-w-0">
                        <p class="truncate font-semibold text-slate-900 text-sm sm:text-base">{{ item.name }}</p>
                        <p class="mt-1 text-xs sm:text-sm text-slate-500">{{ formatMoney(item.unit_price) }} each</p>
                        <p class="mt-1 text-xs text-slate-400">Stock available: {{ item.stock_quantity }}</p>
                        <p v-if="item.sku || item.barcode" class="mt-1 text-[11px] text-slate-400">
                          {{ item.sku ? `Code: ${item.sku}` : "" }}
                          {{ item.sku && item.barcode ? " • " : "" }}
                          {{ item.barcode ? `Barcode: ${item.barcode}` : "" }}
                        </p>
                      </div>
                    </div>

                    <button
                      @click="removeFromCart(item.productId)"
                      class="h-9 w-9 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition shrink-0"
                    >
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </div>

                  <div class="mt-4 flex items-center justify-between gap-3 sm:gap-4">
                    <div class="inline-flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shrink-0">
                      <button @click="decreaseQuantity(item.productId)" class="h-10 w-10 text-slate-700 hover:bg-slate-50">
                        <i class="fa-solid fa-minus"></i>
                      </button>
                      <div class="flex h-10 w-12 items-center justify-center bg-slate-50 font-semibold text-slate-900">
                        {{ item.quantity }}
                      </div>
                      <button @click="increaseQuantity(item.productId)" class="h-10 w-10 text-slate-700 hover:bg-slate-50">
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    </div>

                    <div class="text-right min-w-0">
                      <p class="text-xs sm:text-sm text-slate-500">Subtotal</p>
                      <p class="font-bold text-orange-600 text-sm sm:text-base break-words">
                        {{ formatMoney(item.quantity * item.unit_price) }}
                      </p>
                    </div>
                  </div>

                  <p v-if="item.quantity > item.stock_quantity" class="mt-2 text-xs text-red-500">
                    Quantity exceeds available stock.
                  </p>
                </div>
              </div>

              <div class="border-t border-slate-100 bg-white p-3 sm:p-4 md:p-5">
                <div class="mb-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <div class="flex items-center justify-between text-sm text-slate-600">
                    <span>Total Items</span>
                    <span>{{ cartTotalItems }}</span>
                  </div>
                  <div class="flex items-center justify-between text-base sm:text-lg font-bold text-slate-900 gap-4">
                    <span>Grand Total</span>
                    <span class="text-orange-600 break-words text-right">{{ formatMoney(cartTotal) }}</span>
                  </div>
                </div>

                <div
                  v-if="checkoutError"
                  class="mb-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                  {{ checkoutError }}
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    @click="clearCart"
                    class="rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Clear
                  </button>

                  <button
                    @click="submitSale"
                    :disabled="submittingSale || cart.length === 0 || hasInvalidCartQuantity"
                    class="rounded-2xl bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                  >
                    <span v-if="!submittingSale">Complete Sale</span>
                    <span v-else>Processing...</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReceiptModal
        :open="showReceiptModal"
        :receipt-data="receiptData"
        :receipt-business="receiptBusiness"
        :auth-user-name="auth.user?.name || ''"
        :format-money="formatMoney"
        :format-date-time="formatDateTime"
        :format-payment-method="formatPaymentMethod"
        :get-customer-email="getCustomerEmail"
        :get-customer-phone="getCustomerPhone"
        @close="closeReceiptModal"
        @print="printSaleReceipt"
      />
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import SideBar from "@/components/SideBar.vue";
import ToastStack from "@/components/sales/ToastStack.vue";
import SalesHeader from "@/components/sales/SalesHeader.vue";
import SalesKpiCards from "@/components/sales/SalesKpiCards.vue";
import BestSellersCard from "@/components/sales/BestSellersCard.vue";
import TopCustomersCard from "@/components/sales/TopCustomersCard.vue";
import TodayActivityCard from "@/components/sales/TodayActivityCard.vue";
import SalesFiltersBar from "@/components/sales/SalesFiltersBar.vue";
import SalesTable from "@/components/sales/SalesTable.vue";
import SalesMobileList from "@/components/sales/SalesMobileList.vue";
import SalesPagination from "@/components/sales/SalesPagination.vue";
import SaleDetailsModal from "@/components/sales/SaleDetailsModal.vue";
import ReceiptModal from "@/components/sales/ReceiptModal.vue";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/composables/useToast";
import { usePagination } from "@/composables/usePagination";
import { useSalesHelpers } from "@/composables/useSalesHelpers";
import {
  normalizeArrayPayload,
  normalizeCustomer,
  normalizeSale,
  normalizeSingleSalePayload,
} from "@/utils/salesNormalize";
import { buildReceiptHtml, openPrintWindow } from "@/utils/salesPrint";

const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const SALES_API = `${API_ROOT}/sales`;
const PRODUCTS_API = `${API_ROOT}/products`;
const CUSTOMERS_API = `${API_ROOT}/customers`;

const auth = useAuthStore();

const sidebarOpen = ref(false);
const barcodeInputRef = ref(null);

const sales = ref([]);
const products = ref([]);
const customers = ref([]);
const cart = ref([]);
const toasts = ref([]);

const selectedSale = ref(null);
const receiptData = ref(null);

const loading = ref(false);
const productsLoading = ref(false);
const customersLoading = ref(false);
const viewLoading = ref(false);
const submittingSale = ref(false);

const showViewModal = ref(false);
const showNewSaleModal = ref(false);
const showReceiptModal = ref(false);

const errorMessage = ref("");
const checkoutError = ref("");
const deletingSaleId = ref(null);

const search = ref("");
const paymentFilter = ref("");
const sortBy = ref("newest");

const productSearch = ref("");
const barcodeSearch = ref("");

const customerMode = ref("existing");
const customerSearch = ref("");
const selectedCustomer = ref(null);

const saleForm = ref({
  customer_id: "",
  customer_name: "",
  customer_email: "",
  customer_phone_number: "",
  payment_method: "cash",
});

const {
  pushToast,
  removeToast,
  toastClass,
  toastIconClass,
  toastBarClass,
  toastIcon,
} = useToast();

const getToken = () => auth.token || localStorage.getItem("token") || "";

const axiosConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const receiptBusiness = computed(() => {
  const business = auth.user?.business || auth.business || {};

  return {
    name: auth.businessName || business.name || "Your Business",
    email: business.email || business.business_email || "",
    phone: business.phone || business.phone_number || business.business_phone || "",
    address: business.address || business.location || business.business_address || "",
    logo:
      business.logo ||
      business.logo_url ||
      business.logoUrl ||
      business.image ||
      business.image_url ||
      business.photo ||
      "",
  };
});

const {
  formatPaymentMethod,
  formatDateTime,
  formatMoney,
  getBusinessDisplayName,
  getCustomerDisplayName,
  getCustomerEmail,
  getCustomerPhone,
  isWalkInCustomer,
  formatSaleItemsSummary,
  escapeHtml,
} = useSalesHelpers(customers, auth, receiptBusiness);

const dashboardDateRangeLabel = computed(() => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);

  const format = (date) =>
    date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return `${format(start)} - ${format(now)}`;
});

const customerMap = computed(() => {
  return new Map(customers.value.map((customer) => [Number(customer.id), customer]));
});

const filteredCustomers = computed(() => {
  const term = customerSearch.value.trim().toLowerCase();

  if (!term) return customers.value.slice(0, 8);

  return customers.value
    .filter((customer) => {
      const name = String(customer.name || "").toLowerCase();
      const email = String(customer.email || "").toLowerCase();
      const phone = String(customer.phone_number || "").toLowerCase();
      return name.includes(term) || email.includes(term) || phone.includes(term);
    })
    .slice(0, 8);
});

const fetchCustomers = async () => {
  customersLoading.value = true;

  try {
    const response = await axios.get(CUSTOMERS_API, axiosConfig());
    const rawCustomers = normalizeArrayPayload(response.data, ["customers", "data", "rows"]);
    customers.value = rawCustomers.map(normalizeCustomer);
  } catch (error) {
    customers.value = [];
    pushToast("error", "Customer Load Failed", error.response?.data?.message || "Failed to fetch customers");
  } finally {
    customersLoading.value = false;
  }
};

const fetchProducts = async () => {
  productsLoading.value = true;

  try {
    const response = await axios.get(PRODUCTS_API, axiosConfig());
    products.value = normalizeArrayPayload(response.data, ["products", "data", "rows"]).map((product) => ({
      ...product,
      id: Number(product.id),
      name: product.name || "Unnamed Product",
      stock_quantity: Number(product.stock_quantity ?? product.stock ?? 0),
      selling_price: Number(product.selling_price ?? product.price ?? 0),
      price: Number(product.price ?? 0),
      barcode: product.barcode || "",
      sku: product.sku || "",
      category: product.category || "",
      unit: product.unit || "",
      track_expiry: !!product.track_expiry,
      expiry_date: product.expiry_date || null,
    }));
  } catch (error) {
    products.value = [];
    pushToast("error", "Product Load Failed", error.response?.data?.message || "Failed to fetch products");
  } finally {
    productsLoading.value = false;
  }
};

const fetchSales = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(SALES_API, axiosConfig());
    const rawSales = normalizeArrayPayload(response.data, ["sales", "data", "rows"]);
    sales.value = rawSales.map((sale) => normalizeSale(sale, customerMap.value));
  } catch (error) {
    errorMessage.value = error.response?.data?.message || "Failed to fetch sales records";
    sales.value = [];
  } finally {
    loading.value = false;
  }
};

const refreshAll = async () => {
  await Promise.all([fetchCustomers(), fetchProducts(), fetchSales()]);
  pushToast("success", "Refreshed", "Sales, products, and customers have been updated.");
};

const closeViewModal = () => {
  showViewModal.value = false;
  selectedSale.value = null;
};

const focusBarcodeInput = async () => {
  await nextTick();
  barcodeInputRef.value?.focus();
};

const openNewSaleModal = async () => {
  showNewSaleModal.value = true;
  checkoutError.value = "";
  productCurrentPage.value = 1;
  await Promise.all([fetchProducts(), fetchCustomers()]);
  await focusBarcodeInput();
};

const closeNewSaleModal = () => {
  showNewSaleModal.value = false;
  productSearch.value = "";
  barcodeSearch.value = "";
  checkoutError.value = "";
  productCurrentPage.value = 1;
};

const closeReceiptModal = () => {
  showReceiptModal.value = false;
  receiptData.value = null;
};

const switchCustomerMode = (mode) => {
  customerMode.value = mode;
  selectedCustomer.value = null;
  customerSearch.value = "";
  saleForm.value.customer_id = "";

  if (mode === "existing") {
    saleForm.value.customer_name = "";
    saleForm.value.customer_email = "";
    saleForm.value.customer_phone_number = "";
  }
};

const selectCustomer = (customer) => {
  selectedCustomer.value = customer;
  saleForm.value.customer_id = String(customer.id);
  saleForm.value.customer_name = customer.name || "";
  saleForm.value.customer_email = customer.email || "";
  saleForm.value.customer_phone_number = customer.phone_number || "";
  pushToast("success", "Customer Selected", `${customer.name || "Customer"} attached to this sale.`);
};

const filteredSales = computed(() => {
  let result = [...sales.value];

  if (search.value.trim()) {
    const term = search.value.toLowerCase();

    result = result.filter((sale) => {
      const saleId = `#sal${String(sale.id).padStart(4, "0")}`.toLowerCase();
      const paymentMethod = String(sale.payment_method || "").toLowerCase();
      const customerName = String(getCustomerDisplayName(sale) || "").toLowerCase();
      const cashierName = String(sale.user?.name || "").toLowerCase();

      return (
        saleId.includes(term) ||
        paymentMethod.includes(term) ||
        customerName.includes(term) ||
        cashierName.includes(term)
      );
    });
  }

  if (paymentFilter.value) {
    result = result.filter((sale) => String(sale.payment_method || "").toLowerCase() === paymentFilter.value);
  }

  if (sortBy.value === "highest") {
    result.sort((a, b) => Number(b.total_price || 0) - Number(a.total_price || 0));
  } else if (sortBy.value === "lowest") {
    result.sort((a, b) => Number(a.total_price || 0) - Number(b.total_price || 0));
  } else if (sortBy.value === "oldest") {
    result.sort((a, b) => new Date(a.createdAt || a.sale_date) - new Date(b.createdAt || b.sale_date));
  } else {
    result.sort((a, b) => new Date(b.createdAt || b.sale_date) - new Date(a.createdAt || a.sale_date));
  }

  return result;
});

const {
  currentPage,
  itemsPerPage,
  totalCount: totalSalesCount,
  totalPages,
  paginatedItems: paginatedSales,
  paginationStart,
  paginationEnd,
  visiblePageNumbers,
  goToPage,
  goToPreviousPage,
  goToNextPage,
} = usePagination(filteredSales, 10);

const filteredProducts = computed(() => {
  const term = productSearch.value.trim().toLowerCase();
  if (!term) return products.value;

  return products.value.filter((product) => {
    const fields = [
      product.name,
      product.barcode,
      product.sku,
      product.category,
    ].map((value) => String(value || "").toLowerCase());

    return fields.some((field) => field.includes(term));
  });
});

const {
  currentPage: productCurrentPage,
  itemsPerPage: productItemsPerPage,
  totalCount: totalProductsCount,
  totalPages: productTotalPages,
  paginatedItems: paginatedProducts,
  paginationStart: productPaginationStart,
  paginationEnd: productPaginationEnd,
  visiblePageNumbers: visibleProductPageNumbers,
  goToPage: goToProductPage,
  goToPreviousPage: goToPreviousProductPage,
  goToNextPage: goToNextProductPage,
} = usePagination(filteredProducts, 9);

watch([search, paymentFilter, sortBy, itemsPerPage], () => {
  currentPage.value = 1;
});

watch([productSearch, productItemsPerPage], () => {
  productCurrentPage.value = 1;
});

const totalItemsSold = computed(() => {
  return sales.value.reduce((sum, sale) => {
    const items = Array.isArray(sale.items) ? sale.items : [];
    return sum + items.reduce((inner, item) => inner + Number(item.quantity || 0), 0);
  }, 0);
});

const nonCashSalesCount = computed(() => {
  return sales.value.filter((sale) => {
    const method = String(sale.payment_method || "").toLowerCase();
    return method === "card" || method === "mobile_money";
  }).length;
});

const weeklyRevenue = computed(() => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);

  return sales.value.reduce((sum, sale) => {
    const saleDate = new Date(sale.createdAt || sale.sale_date || 0);
    if (Number.isNaN(saleDate.getTime())) return sum;
    if (saleDate >= start && saleDate <= now) {
      return sum + Number(sale.total_price || 0);
    }
    return sum;
  }, 0);
});

const previousWeeklyRevenue = computed(() => {
  const end = new Date();
  end.setDate(end.getDate() - 7);
  const start = new Date(end);
  start.setDate(end.getDate() - 6);

  return sales.value.reduce((sum, sale) => {
    const saleDate = new Date(sale.createdAt || sale.sale_date || 0);
    if (Number.isNaN(saleDate.getTime())) return sum;
    if (saleDate >= start && saleDate <= end) {
      return sum + Number(sale.total_price || 0);
    }
    return sum;
  }, 0);
});

const weeklyRevenueChange = computed(() => {
  const previous = Number(previousWeeklyRevenue.value || 0);
  const current = Number(weeklyRevenue.value || 0);

  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
});

const bestSellingProducts = computed(() => {
  const map = new Map();

  sales.value.forEach((sale) => {
    const items = Array.isArray(sale.items) ? sale.items : [];
    items.forEach((item) => {
      const name = item.name || item.product?.name || `Product #${item.productId || "N/A"}`;
      const existing = map.get(name) || { name, quantity: 0, revenue: 0 };
      existing.quantity += Number(item.quantity || 0);
      existing.revenue += Number(item.sub_total_price || 0);
      map.set(name, existing);
    });
  });

  return [...map.values()].sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue).slice(0, 10);
});

const topCustomers = computed(() => {
  const map = new Map();

  sales.value.forEach((sale) => {
    const name = getCustomerDisplayName(sale) || "Walk-in Customer";
    const existing = map.get(name) || { name, count: 0, revenue: 0 };
    existing.count += 1;
    existing.revenue += Number(sale.total_price || 0);
    map.set(name, existing);
  });

  return [...map.values()].sort((a, b) => b.revenue - a.revenue || b.count - a.count).slice(0, 5);
});

const todaySales = computed(() => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  return sales.value.filter((sale) => {
    const saleDate = new Date(sale.createdAt || sale.sale_date || 0);
    if (Number.isNaN(saleDate.getTime())) return false;
    return saleDate >= todayStart && saleDate < tomorrowStart;
  });
});

const todaysSalesCount = computed(() => todaySales.value.length);
const todaysRevenue = computed(() => todaySales.value.reduce((sum, sale) => sum + Number(sale.total_price || 0), 0));
const todaysItemsSold = computed(() => {
  return todaySales.value.reduce((sum, sale) => {
    const items = Array.isArray(sale.items) ? sale.items : [];
    return sum + items.reduce((inner, item) => inner + Number(item.quantity || 0), 0);
  }, 0);
});
const todaysAverageSale = computed(() => (todaysSalesCount.value ? todaysRevenue.value / todaysSalesCount.value : 0));
const todaysCashSalesCount = computed(() => {
  return todaySales.value.filter((sale) => String(sale.payment_method || "").toLowerCase() === "cash").length;
});
const todaysNonCashSalesCount = computed(() => {
  return todaySales.value.filter((sale) => {
    const method = String(sale.payment_method || "").toLowerCase();
    return method === "card" || method === "mobile_money";
  }).length;
});
const todaysTopPaymentMethod = computed(() => {
  const counts = { cash: 0, card: 0, mobile_money: 0 };

  todaySales.value.forEach((sale) => {
    const method = String(sale.payment_method || "").toLowerCase();
    if (counts[method] !== undefined) counts[method] += 1;
  });

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (!top || top[1] === 0) return "No sales yet";
  return formatPaymentMethod(top[0]);
});
const todaysTopCustomer = computed(() => {
  if (!todaySales.value.length) return "No sales yet";

  const map = new Map();
  todaySales.value.forEach((sale) => {
    const name = getCustomerDisplayName(sale) || "Walk-in Customer";
    const current = map.get(name) || 0;
    map.set(name, current + Number(sale.total_price || 0));
  });

  const top = [...map.entries()].sort((a, b) => b[1] - a[1])[0];
  return top?.[0] || "No sales yet";
});

const todayStats = computed(() => ({
  todaysSalesCount: todaysSalesCount.value,
  todaysRevenue: todaysRevenue.value,
  todaysItemsSold: todaysItemsSold.value,
  todaysAverageSale: todaysAverageSale.value,
  todaysTopPaymentMethod: todaysTopPaymentMethod.value,
  todaysCashSalesCount: todaysCashSalesCount.value,
  todaysNonCashSalesCount: todaysNonCashSalesCount.value,
  todaysTopCustomer: todaysTopCustomer.value,
}));

const isProductExpired = (product) => {
  if (!product?.track_expiry || !product?.expiry_date) return false;
  const expiry = new Date(product.expiry_date);
  if (Number.isNaN(expiry.getTime())) return false;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return expiry < today;
};

const productAvailabilityText = (product) => {
  if (isProductExpired(product)) return "Expired";
  if (Number(product.stock_quantity || 0) <= 0) return "Out of Stock";
  return "In Stock";
};

const productAvailabilityClass = (product) => {
  if (isProductExpired(product)) return "bg-red-100 text-red-600";
  if (Number(product.stock_quantity || 0) <= 0) return "bg-red-100 text-red-600";
  return "bg-green-100 text-green-700";
};

const findProductByBarcodeOrCode = (value) => {
  const term = String(value || "").trim().toLowerCase();
  if (!term) return null;

  return (
    products.value.find((product) => {
      const barcode = String(product.barcode || "").toLowerCase();
      const code = String(product.sku || "").toLowerCase();
      return barcode === term || code === term;
    }) || null
  );
};

const handleBarcodeSearch = async () => {
  const scannedValue = barcodeSearch.value.trim();

  if (!scannedValue) {
    pushToast("warning", "No Barcode", "Scan a product barcode or type a product code.");
    return;
  }

  const found = findProductByBarcodeOrCode(scannedValue);

  if (!found) {
    pushToast("warning", "Not Found", "No product matched that barcode or product code.");
    barcodeSearch.value = "";
    await focusBarcodeInput();
    return;
  }

  addToCart(found);
  barcodeSearch.value = "";
  await focusBarcodeInput();
};

const addToCart = (product) => {
  const stock = Number(product.stock_quantity || 0);

  if (isProductExpired(product)) {
    pushToast("warning", "Expired Product", `${product.name || "This product"} has expired stock and cannot be sold.`);
    return;
  }

  if (stock <= 0) {
    pushToast("warning", "Out of Stock", `${product.name || "This product"} is currently out of stock.`);
    return;
  }

  const existingItem = cart.value.find((item) => item.productId === product.id);

  if (existingItem) {
    if (existingItem.quantity < stock) {
      existingItem.quantity += 1;
      pushToast("success", "Cart Updated", `${product.name} quantity increased in cart.`);
    } else {
      pushToast("warning", "Stock Limit Reached", `Cannot add more of ${product.name}. Available stock reached.`);
    }
    return;
  }

  cart.value.push({
    productId: product.id,
    name: product.name,
    barcode: product.barcode || "",
    sku: product.sku || "",
    category: product.category || "",
    quantity: 1,
    unit_price: Number(product.selling_price || product.price || 0),
    stock_quantity: stock,
    track_expiry: !!product.track_expiry,
    expiry_date: product.expiry_date || null,
  });

  pushToast("success", "Added to Cart", `${product.name} added to cart.`);
};

const increaseQuantity = (productId) => {
  const item = cart.value.find((entry) => entry.productId === productId);
  if (!item) return;

  if (item.quantity < item.stock_quantity) {
    item.quantity += 1;
  } else {
    pushToast("warning", "Stock Limit Reached", `Cannot exceed available stock for ${item.name}.`);
  }
};

const decreaseQuantity = (productId) => {
  const item = cart.value.find((entry) => entry.productId === productId);
  if (!item) return;

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    removeFromCart(productId);
  }
};

const removeFromCart = (productId) => {
  const item = cart.value.find((entry) => entry.productId === productId);
  cart.value = cart.value.filter((entry) => entry.productId !== productId);

  if (item) {
    pushToast("info", "Removed from Cart", `${item.name} removed from cart.`);
  }
};

const clearCart = () => {
  cart.value = [];
  selectedCustomer.value = null;
  customerMode.value = "existing";
  customerSearch.value = "";
  productSearch.value = "";
  barcodeSearch.value = "";
  checkoutError.value = "";

  saleForm.value = {
    customer_id: "",
    customer_name: "",
    customer_email: "",
    customer_phone_number: "",
    payment_method: "cash",
  };

  focusBarcodeInput();
};

function buildWalkInCustomerPayload() {
  const uniqueId = `walkin-${Date.now()}`;
  return {
    customer_name: "Walk-in Customer",
    customer_email: `${uniqueId}@guest.local`,
    customer_phone_number: "",
  };
}

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + Number(item.unit_price) * Number(item.quantity), 0);
});

const cartTotalItems = computed(() => {
  return cart.value.reduce((sum, item) => sum + Number(item.quantity), 0);
});

const hasInvalidCartQuantity = computed(() => {
  return cart.value.some(
    (item) => Number(item.quantity) <= 0 || Number(item.quantity) > Number(item.stock_quantity)
  );
});

const submitSale = async () => {
  checkoutError.value = "";

  if (cart.value.length === 0) {
    checkoutError.value = "Please add at least one product to the cart.";
    return;
  }

  if (hasInvalidCartQuantity.value) {
    checkoutError.value = "One or more cart quantities are invalid.";
    return;
  }

  submittingSale.value = true;

  try {
    const cartSnapshot = cart.value.map((item) => ({
      productId: item.productId,
      name: item.name,
      barcode: item.barcode || "",
      sku: item.sku || "",
      quantity: item.quantity,
      unit_price: item.unit_price,
      sub_total_price: item.quantity * item.unit_price,
    }));

    const payload = {
      payment_method: saleForm.value.payment_method,
      items: cart.value.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    const hasExistingCustomer = customerMode.value === "existing" && !!saleForm.value.customer_id;
    const hasNewCustomer =
      customerMode.value === "new" &&
      !!saleForm.value.customer_name?.trim() &&
      !!saleForm.value.customer_email?.trim();

    if (hasExistingCustomer) {
      payload.customer_id = Number(saleForm.value.customer_id);
    } else if (hasNewCustomer) {
      payload.customer_name = saleForm.value.customer_name.trim();
      payload.customer_email = saleForm.value.customer_email.trim();
      payload.customer_phone_number = saleForm.value.customer_phone_number?.trim() || "";
    } else {
      Object.assign(payload, buildWalkInCustomerPayload());
    }

    const response = await axios.post(SALES_API, payload, axiosConfig());
    const saleFromResponse = normalizeSingleSalePayload(response.data, customers.value);

    let receiptCustomerName = "Walk-in Customer";
    if (hasExistingCustomer && selectedCustomer.value) {
      receiptCustomerName = selectedCustomer.value.name || "Walk-in Customer";
    } else if (hasNewCustomer) {
      receiptCustomerName = saleForm.value.customer_name.trim();
    } else {
      receiptCustomerName = getCustomerDisplayName(saleFromResponse);
    }

    receiptData.value = {
      sale: {
        ...saleFromResponse,
        payment_method: saleFromResponse.payment_method || saleForm.value.payment_method,
        total_price:
          saleFromResponse.total_price ||
          cartSnapshot.reduce((sum, item) => sum + item.sub_total_price, 0),
        createdAt: saleFromResponse.createdAt || new Date().toISOString(),
        business: {
          name:
            saleFromResponse.business?.name ||
            auth.businessName ||
            receiptBusiness.value.name ||
            "Your Business",
          email:
            saleFromResponse.business?.email ||
            saleFromResponse.business?.business_email ||
            receiptBusiness.value.email ||
            "",
          phone:
            saleFromResponse.business?.phone ||
            saleFromResponse.business?.phone_number ||
            saleFromResponse.business?.business_phone ||
            receiptBusiness.value.phone ||
            "",
          address:
            saleFromResponse.business?.address ||
            saleFromResponse.business?.location ||
            saleFromResponse.business?.business_address ||
            receiptBusiness.value.address ||
            "",
          logo:
            saleFromResponse.business?.logo ||
            saleFromResponse.business?.logo_url ||
            saleFromResponse.business?.logoUrl ||
            saleFromResponse.business?.image ||
            saleFromResponse.business?.image_url ||
            saleFromResponse.business?.photo ||
            receiptBusiness.value.logo ||
            "",
        },
      },
      customer_name: receiptCustomerName,
      items: saleFromResponse.items?.length
        ? saleFromResponse.items.map((item) => {
            const localMatch = cartSnapshot.find((c) => c.productId === item.productId);
            return {
              ...item,
              name: item.name || localMatch?.name || item.product?.name || `Product #${item.productId}`,
              barcode: item.barcode || localMatch?.barcode || item.product?.barcode || "",
              sku: item.sku || localMatch?.sku || item.product?.sku || "",
            };
          })
        : cartSnapshot,
    };

    await Promise.all([fetchSales(), fetchProducts(), fetchCustomers()]);

    clearCart();
    closeNewSaleModal();
    showReceiptModal.value = true;
    pushToast("success", "Sale Completed", "The sale has been recorded successfully.");
  } catch (error) {
    const apiMessage = error.response?.data?.message || "Failed to complete sale";
    checkoutError.value = apiMessage;
    pushToast("error", "Sale Failed", apiMessage);
  } finally {
    submittingSale.value = false;
  }
};

const viewSale = async (saleId) => {
  showViewModal.value = true;
  viewLoading.value = true;
  selectedSale.value = null;

  try {
    const response = await axios.get(`${SALES_API}/${saleId}`, axiosConfig());
    const sale = normalizeSingleSalePayload(response.data, customers.value);

    sale.business = {
      name:
        sale.business?.name ||
        auth.businessName ||
        receiptBusiness.value.name ||
        "Your Business",
      email:
        sale.business?.email ||
        sale.business?.business_email ||
        receiptBusiness.value.email ||
        "",
      phone:
        sale.business?.phone ||
        sale.business?.phone_number ||
        sale.business?.business_phone ||
        receiptBusiness.value.phone ||
        "",
      address:
        sale.business?.address ||
        sale.business?.location ||
        sale.business?.business_address ||
        receiptBusiness.value.address ||
        "",
      logo:
        sale.business?.logo ||
        sale.business?.logo_url ||
        sale.business?.logoUrl ||
        sale.business?.image ||
        sale.business?.image_url ||
        sale.business?.photo ||
        receiptBusiness.value.logo ||
        "",
    };

    selectedSale.value = sale;
  } catch (error) {
    pushToast("error", "Load Failed", error.response?.data?.message || "Failed to fetch sale details");
    closeViewModal();
  } finally {
    viewLoading.value = false;
  }
};

const removeSale = async (saleId) => {
  const confirmed = window.confirm("Are you sure you want to delete this sale? Stock may be restored.");
  if (!confirmed) return;

  deletingSaleId.value = saleId;

  try {
    await axios.delete(`${SALES_API}/${saleId}`, axiosConfig());
    sales.value = sales.value.filter((sale) => sale.id !== saleId);

    if (selectedSale.value?.id === saleId) {
      closeViewModal();
    }

    pushToast("success", "Sale Deleted", "The sale was deleted successfully.");
  } catch (error) {
    pushToast("error", "Delete Failed", error.response?.data?.message || "Failed to delete sale");
  } finally {
    deletingSaleId.value = null;
  }
};

const getPrintableSalePayload = (sale, overridePayload = null) => {
  if (overridePayload) return overridePayload;

  return {
    sale: {
      ...sale,
      business: sale.business || {
        name: auth.businessName || "Your Business",
        email: receiptBusiness.value.email,
        phone: receiptBusiness.value.phone,
        address: receiptBusiness.value.address,
        logo: receiptBusiness.value.logo,
      },
    },
    customer_name: getCustomerDisplayName(sale),
    items: Array.isArray(sale.items)
      ? sale.items.map((item) => ({
          ...item,
          name: item.name || item.product?.name || `Product #${item.productId}`,
        }))
      : [],
  };
};

const printSaleReceipt = (sale, payloadOverride = null) => {
  const payload = getPrintableSalePayload(sale, payloadOverride);

  const html = buildReceiptHtml({
    payload,
    helpers: {
      getBusinessDisplayName,
      getCustomerDisplayName,
      formatPaymentMethod,
      formatDateTime,
      formatMoney,
      escapeHtml,
    },
    auth,
    receiptBusiness,
  });

  openPrintWindow(html);
};

const printSaleFromList = async (sale) => {
  if (sale.items?.length) {
    printSaleReceipt(sale);
    return;
  }

  try {
    const response = await axios.get(`${SALES_API}/${sale.id}`, axiosConfig());
    const normalizedSale = normalizeSingleSalePayload(response.data, customers.value);
    printSaleReceipt(normalizedSale);
  } catch (error) {
    pushToast("error", "Print Failed", error.response?.data?.message || "Failed to prepare sale for printing");
  }
};

onMounted(async () => {
  await Promise.all([fetchCustomers(), fetchSales()]);
});
</script>