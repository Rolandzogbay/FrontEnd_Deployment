<template>
  <div class="min-h-screen bg-slate-50">
    <SideBar :open="sidebarOpen" @close="sidebarOpen = false" :superAdmin="false" />

    <div class="min-h-screen flex flex-col lg:pl-72">
      <ProductsHeader :searchQuery="searchQuery" @open-sidebar="sidebarOpen = true"
        @update:searchQuery="searchQuery = $event">
        <template #notifications>
          <div class="relative z-50 shrink-0">
            <button
              class="relative h-10 w-10 sm:h-11 sm:w-11 rounded-2xl border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 transition grid place-items-center"
              @click.stop="toggleNotifications" aria-label="Notifications">
              <i class="fa-solid fa-bell text-slate-700 text-sm sm:text-base"></i>

              <span v-if="unreadNotificationsCount"
                class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-[10px] sm:text-[11px] grid place-items-center border-2 border-white">
                {{ unreadNotificationsCount }}
              </span>
            </button>
          </div>
        </template>
      </ProductsHeader>

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
                <button @click="showAlert = false" class="text-green-600 hover:text-green-700">
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
                <button @click="errorMessage = ''" class="text-red-600 hover:text-red-700">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </transition>

            <ProductStats :totalProductsCount="filteredProducts.length" :inStockCount="inStockCount"
              :lowStockCount="lowStockCount" :stockValue="stockValue" />

            <section class="bg-white p-5 sm:p-6 rounded-[28px] shadow-sm border border-slate-200">
              <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
                <div>
                  <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Inventory Catalog</h2>
                  <p class="text-sm sm:text-base text-slate-500 mt-1 max-w-xl">
                    Manage products, pricing, batches, imports, and expiry-aware stock from one workspace.
                  </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 xl:flex gap-3 w-full xl:w-auto">
                  <select v-model="statusFilter"
                    class="px-2 py-1 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-sm sm:text-base">
                    <option value="active">Active Products</option>
                    <option value="archived">Archived Products</option>
                    <option value="all">All Products</option>
                  </select>

                  <select v-model="filterBy"
                    class="px-2 py-1 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-sm sm:text-base">
                    <option value="">Sort By</option>
                    <option value="Price">Cost Price (Low to High)</option>
                    <option value="SellingPrice">Selling Price (Low to High)</option>
                    <option value="Quantity">Quantity (High to Low)</option>
                    <option value="Status">Status (Available First)</option>
                    <option value="Newest">Newest First</option>
                  </select>

                  <button v-if="statusFilter !== 'archived'"
                    class="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-medium transition"
                    @click="showBulkCreateModal = true">
                    <i class="fa-solid fa-layer-group mr-2"></i>
                    Add Multiple
                  </button>

                  <button v-if="statusFilter !== 'archived'"
                    class="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-medium transition"
                    @click="showImportModal = true">
                    <i class="fa-solid fa-file-import mr-2"></i>
                    Import File
                  </button>

                  <button v-if="statusFilter !== 'archived'"
                    class="px-3  py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-medium transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
                <p class="text-slate-500 mt-1">Try changing your search, filter, or add a new product.</p>
              </div>

              <div v-else class="overflow-x-auto">
                <table class="w-full min-w-[1180px] text-left">
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
                            <p class="font-semibold text-sm sm:text-base text-slate-900 truncate">
                              {{ product.name }}
                            </p>
                            <p class="text-xs text-slate-400">
                              ID: #PRD{{ String(product.id).padStart(4, "0") }}
                            </p>
                            <p v-if="product.description" class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">
                              {{ product.description }}
                            </p>
                            <p v-if="product.barcode || product.sku" class="text-[11px] text-slate-400 mt-1">
                              {{ product.barcode ? `Barcode: ${product.barcode}` : "" }}
                              {{ product.barcode && product.sku ? " • " : "" }}
                              {{ product.sku ? `Code: ${product.sku}` : "" }}
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
                        <span :class="productStatusClass(product)"
                          class="px-3 py-1.5 text-xs sm:text-sm rounded-full font-semibold inline-flex items-center gap-2 w-fit">
                          <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
                          {{ productStatusText(product) }}
                        </span>
                      </td>
                      <td class="px-4 text-slate-700 text-sm sm:text-base font-medium">
                        {{ productMargin(product) }}
                      </td>
                      <td class="px-4" @click.stop>
                        <div class="flex items-center gap-2">
                          <button @click="openDetailsModal(product)"
                            class="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition grid place-items-center"
                            title="View">
                            <i class="fa-solid fa-eye"></i>
                          </button>

                          <button v-if="product.is_active" @click="openEditModal(product)"
                            class="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition grid place-items-center"
                            title="Edit">
                            <i class="fa-solid fa-pen-to-square"></i>
                          </button>

                          <button v-if="product.is_active" @click="openAddBatchModal(product)"
                            class="w-10 h-10 rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition grid place-items-center"
                            title="Add Batch">
                            <i class="fa-solid fa-layer-group"></i>
                          </button>

                          <button v-if="product.is_active" @click="requestArchiveProduct(product)"
                            class="w-10 h-10 rounded-xl border border-amber-200 text-amber-600 hover:bg-amber-50 transition grid place-items-center"
                            title="Archive">
                            <i class="fa-solid fa-box-archive"></i>
                          </button>

                          <button v-else @click="requestRestoreProduct(product)"
                            class="w-10 h-10 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition grid place-items-center"
                            title="Restore">
                            <i class="fa-solid fa-rotate-left"></i>
                          </button>

                          <button v-if="!product.is_active" @click="requestDeleteProduct(product)"
                            class="w-10 h-10 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition grid place-items-center"
                            title="Delete Permanently">
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="filteredProducts.length > 0" class="flex flex-col gap-4 mt-6 pt-5 border-t border-slate-100">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div class="text-sm text-slate-600">
                    Showing
                    <span class="font-semibold">{{ startIndex + 1 }}</span>
                    to
                    <span class="font-semibold">{{ Math.min(endIndex, filteredProducts.length) }}</span>
                    of
                    <span class="font-semibold">{{ filteredProducts.length }}</span>
                    products
                  </div>

                  <div class="flex items-center gap-2 flex-wrap">
                    <label class="text-sm text-slate-600">Items per page:</label>
                    <select v-model.number="itemsPerPage"
                      class="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm">
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

    <BulkCreateProductsModal :isOpen="showBulkCreateModal" @close="showBulkCreateModal = false"
      @submit="handleBulkCreateSubmit" />

    <ImportProductsModal :isOpen="showImportModal" :loading="importLoading" @close="showImportModal = false"
      @preview="handleImportPreview" @confirm="handleImportConfirm" />

    <AddStockBatchModal :isOpen="showAddBatchModal" :product="selectedBatchProduct" @close="closeAddBatchModal"
      @submit="handleAddBatchSubmit" />

    <ProductDetailsModal :isOpen="showDetailsModal" :product="selectedProduct" @close="closeDetailsModal"
      @edit="openEditFromDetails" @add-batch="openAddBatchModal" />

    <ConfirmActionModal :open="confirmState.open" :title="confirmState.title" :message="confirmState.message"
      :confirmText="confirmState.confirmText" :variant="confirmState.variant" :icon="confirmState.icon"
      :loading="confirmState.loading" @cancel="closeConfirmModal" @confirm="executeConfirmAction" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import SideBar from "@/components/SideBar.vue";
import ProductModal from "@/components/ProductModal.vue";
import BulkCreateProductsModal from "@/components/products/BulkCreateProductsModal.vue";
import ImportProductsModal from "@/components/products/ImportProductsModal.vue";
import AddStockBatchModal from "@/components/products/AddStockBatchModal.vue";
import ProductDetailsModal from "@/components/products/ProductDetailsModal.vue";
import ConfirmActionModal from "@/components/products/ConfirmActionModal.vue";
import ProductsHeader from "@/components/products/ProductsHeader.vue";
import ProductStats from "@/components/products/ProductStats.vue";
import { useProducts } from "@/composables/useProducts";
import { useProductNotifications } from "@/composables/useProductNotifications";

const sidebarOpen = ref(false);
const searchQuery = ref("");
const filterBy = ref("");
const statusFilter = ref("active");
const currentPage = ref(1);
const itemsPerPage = ref(10);

const showAlert = ref(false);
const alertMessage = ref("");

const showAddModal = ref(false);
const showBulkCreateModal = ref(false);
const showImportModal = ref(false);
const showAddBatchModal = ref(false);

const isEditMode = ref(false);
const editingProductId = ref(null);

const showDetailsModal = ref(false);
const selectedProduct = ref(null);
const selectedBatchProduct = ref(null);

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

const newProduct = ref({
  id: null,
  name: "",
  description: "",
  sku: "",
  barcode: "",
  category: "",
  unit: "",
  price: "",
  selling_price: "",
  stock_quantity: "",
  low_stock_threshold: 10,
  track_expiry: false,
  expiry_date: "",
  batch_number: "",
});

const {
  products,
  loadingProducts,
  isSubmittingProduct,
  isMutating,
  importLoading,
  batchLoading,
  errorMessage,
  fetchProducts,
  fetchProductDetails,
  saveProduct,
  bulkCreateProducts,
  previewImportProducts,
  confirmImportProducts,
  addProductBatch,
  archiveProduct,
  restoreProduct,
  deleteProductPermanently,
} = useProducts();

const {
  unreadNotificationsCount,
  fetchNotifications,
} = useProductNotifications();

const resetNewProduct = () => {
  newProduct.value = {
    id: null,
    name: "",
    description: "",
    sku: "",
    barcode: "",
    category: "",
    unit: "",
    price: "",
    selling_price: "",
    stock_quantity: "",
    low_stock_threshold: 10,
    track_expiry: false,
    expiry_date: "",
    batch_number: "",
  };
  isEditMode.value = false;
  editingProductId.value = null;
};

const showSuccess = (message) => {
  alertMessage.value = message;
  showAlert.value = true;

  setTimeout(() => {
    showAlert.value = false;
  }, 3000);
};

const toggleNotifications = async () => {
  await fetchNotifications();
};

const openAddModal = () => {
  resetNewProduct();
  showAddModal.value = true;
};

const openEditModal = (product) => {
  isEditMode.value = true;
  editingProductId.value = product.id;

  newProduct.value = {
    id: product.id,
    name: product.name || "",
    description: product.description || "",
    sku: product.sku || "",
    barcode: product.barcode || "",
    category: product.category || "",
    unit: product.unit || "",
    price: product.price ?? "",
    selling_price: product.selling_price ?? "",
    stock_quantity: product.stock_quantity ?? "",
    low_stock_threshold: product.low_stock_threshold ?? 10,
    track_expiry: !!product.track_expiry,
    expiry_date: product.expiry_date || "",
    batch_number: "",
  };

  showAddModal.value = true;
};

const openEditFromDetails = (product) => {
  closeDetailsModal();
  openEditModal(product);
};

const closeAddModal = () => {
  if (isSubmittingProduct.value) return;
  showAddModal.value = false;
  resetNewProduct();
};

const openDetailsModal = async (product) => {
  selectedProduct.value = { ...product };
  showDetailsModal.value = true;

  try {
    const fullProduct = await fetchProductDetails(product.id);
    selectedProduct.value = { ...fullProduct };
  } catch (error) {
    console.error("Failed to load product details:", error);
  }
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedProduct.value = null;
};

const openAddBatchModal = (product) => {
  selectedBatchProduct.value = product;
  showAddBatchModal.value = true;
};

const closeAddBatchModal = () => {
  if (batchLoading.value) return;
  showAddBatchModal.value = false;
  selectedBatchProduct.value = null;
};

const handleProductSubmit = async (productData) => {
  try {
    const result = await saveProduct({
      productData,
      isEditMode: isEditMode.value,
      editingProductId: editingProductId.value,
    });

    showSuccess(
      result?.message ||
      (isEditMode.value ? "Product updated successfully!" : "Product added successfully!")
    );

    closeAddModal();
    await fetchProducts(statusFilter.value);
  } catch (error) {
    console.error("Save product error:", error?.response?.data || error);
  }
};

const handleBulkCreateSubmit = async (rows) => {
  try {
    const result = await bulkCreateProducts(rows);

    showBulkCreateModal.value = false;
    showSuccess(result?.message || "Products created successfully!");
    await fetchProducts(statusFilter.value);
  } catch (error) {
    console.error("Bulk create error:", error?.response?.data || error);
  }
};

const handleImportPreview = async ({ file, onSuccess, onError }) => {
  try {
    const data = await previewImportProducts(file);
    onSuccess?.(data);
  } catch (error) {
    onError?.(error?.response?.data?.message || error?.message || "Failed to preview import.");
  }
};

const handleImportConfirm = async ({ file, onSuccess, onError }) => {
  try {
    const data = await confirmImportProducts(file);
    onSuccess?.(data);
    showImportModal.value = false;
    showSuccess(data?.message || "Products imported successfully!");
    await fetchProducts(statusFilter.value);
  } catch (error) {
    onError?.(error?.response?.data?.message || error?.message || "Failed to import products.");
  }
};

const handleAddBatchSubmit = async (batchData) => {
  try {
    const data = await addProductBatch(selectedBatchProduct.value.id, batchData);

    closeAddBatchModal();
    showSuccess(data?.message || "Stock batch added successfully!");
    await fetchProducts(statusFilter.value);

    if (selectedProduct.value?.id === selectedBatchProduct.value?.id) {
      const fresh = await fetchProductDetails(selectedProduct.value.id);
      selectedProduct.value = { ...fresh };
    }
  } catch (error) {
    console.error("Add batch error:", error?.response?.data || error);
  }
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
  if (!confirmState.value.action) return;

  confirmState.value.loading = true;

  try {
    await confirmState.value.action();
    closeConfirmModal();
  } catch (error) {
    console.error("Confirm action error:", error?.response?.data || error);
    confirmState.value.loading = false;
  }
};

const requestArchiveProduct = (product) => {
  openConfirmModal({
    title: "Archive product?",
    message: `"${product.name}" will be removed from active product lists but kept for history and reporting.`,
    confirmText: "Archive Product",
    variant: "warning",
    icon: "fa-solid fa-box-archive",
    action: async () => {
      await archiveProduct(product);
      showSuccess(`Product "${product.name}" archived successfully!`);
      await fetchProducts(statusFilter.value);
      if (selectedProduct.value?.id === product.id) closeDetailsModal();
    },
  });
};

const requestRestoreProduct = (product) => {
  openConfirmModal({
    title: "Restore product?",
    message: `"${product.name}" will return to active product lists and be available again.`,
    confirmText: "Restore Product",
    variant: "success",
    icon: "fa-solid fa-rotate-left",
    action: async () => {
      await restoreProduct(product);
      showSuccess(`Product "${product.name}" restored successfully!`);
      await fetchProducts(statusFilter.value);

      if (selectedProduct.value?.id === product.id) {
        const fresh = await fetchProductDetails(product.id);
        selectedProduct.value = { ...fresh };
      }
    },
  });
};

const requestDeleteProduct = (product) => {
  openConfirmModal({
    title: "Delete permanently?",
    message: `This will permanently remove "${product.name}". This should only work if the product has no sales history.`,
    confirmText: "Delete Permanently",
    variant: "danger",
    icon: "fa-solid fa-trash-can",
    action: async () => {
      await deleteProductPermanently(product);
      showSuccess(`Product "${product.name}" deleted permanently!`);
      await fetchProducts(statusFilter.value);
      if (selectedProduct.value?.id === product.id) closeDetailsModal();
    },
  });
};

const filteredProducts = computed(() => {
  let result = [...products.value];
  const globalSearch = searchQuery.value.trim().toLowerCase();

  if (globalSearch) {
    result = result.filter((p) => {
      const fields = [
        p.name,
        p.description,
        p.barcode,
        p.sku,
        p.category,
        `#prd${String(p.id).padStart(4, "0")}`,
      ].map((v) => String(v || "").toLowerCase());

      return fields.some((field) => field.includes(globalSearch));
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

const inStockCount = computed(() =>
  filteredProducts.value.filter((p) => Number(p.stock_quantity || 0) > 0 && p.is_active !== false).length
);

const lowStockCount = computed(() =>
  filteredProducts.value.filter((p) => {
    const qty = Number(p.stock_quantity || 0);
    const threshold = Number(p.low_stock_threshold ?? 10);
    return p.is_active !== false && qty > 0 && qty <= threshold;
  }).length
);

const stockValue = computed(() =>
  filteredProducts.value.reduce((sum, p) => {
    if (p.is_active === false) return sum;
    return sum + Number(p.stock_quantity || 0) * Number(p.selling_price || 0);
  }, 0)
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage.value))
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const paginatedProducts = computed(() =>
  filteredProducts.value.slice(startIndex.value, endIndex.value)
);

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

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

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

const formatMoney = (value) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));

const formatNumber = (value) => new Intl.NumberFormat().format(Number(value || 0));

const productMargin = (product) =>
  formatMoney(Number(product?.selling_price || 0) - Number(product?.price || 0));

watch([filterBy, itemsPerPage, searchQuery, statusFilter], () => {
  currentPage.value = 1;
});

watch(statusFilter, async () => {
  await fetchProducts(statusFilter.value);
});

onMounted(async () => {
  await fetchProducts(statusFilter.value);
  await fetchNotifications();
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>