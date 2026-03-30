import axios from "axios";
import { computed, ref } from "vue";

// Prefer env in production, fallback in dev
// const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_ROOT = "http://localhost:5000/api";
const API_BASE_URL = `${API_ROOT}/products`;

const PRODUCT_ARCHIVE_URL = (id) => `${API_BASE_URL}/${id}/archive`;
const PRODUCT_RESTORE_URL = (id) => `${API_BASE_URL}/${id}/restore`;
const PRODUCT_PERMANENT_DELETE_URL = (id) => `${API_BASE_URL}/${id}/permanent`;
const PRODUCT_BATCHES_URL = (id) => `${API_BASE_URL}/${id}/batches`;
const PRODUCT_IMPORT_PREVIEW_URL = `${API_BASE_URL}/import/preview`;
const PRODUCT_IMPORT_CONFIRM_URL = `${API_BASE_URL}/import/confirm`;
const PRODUCT_BULK_CREATE_URL = `${API_BASE_URL}/bulk-create`;

export function useProducts() {
    const products = ref([]);
    const loadingProducts = ref(false);
    const isSubmittingProduct = ref(false);
    const isMutating = ref(false);
    const importLoading = ref(false);
    const batchLoading = ref(false);
    const errorMessage = ref("");

    const getToken = () => localStorage.getItem("token");

    const axiosConfig = () => ({
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    const multipartConfig = () => ({
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
        },
    });

    const normalizeInteger = (value) => {
        const parsed = Number.parseInt(String(value ?? "").trim(), 10);
        return Number.isNaN(parsed) ? NaN : parsed;
    };

    const normalizeNumber = (value) => {
        const parsed = Number(String(value ?? "").trim());
        return Number.isNaN(parsed) ? NaN : parsed;
    };

    const normalizeString = (value) => String(value ?? "").trim();

    const validateProductPayload = (productData) => {
        const name = normalizeString(productData.name);
        const price = normalizeNumber(productData.price);
        const sellingPrice = normalizeNumber(productData.selling_price);
        const stockQuantity = normalizeInteger(productData.stock_quantity);
        const lowStockThreshold = normalizeInteger(productData.low_stock_threshold ?? 10);
        const trackExpiry = !!productData.track_expiry;
        const expiryDate = productData.expiry_date || null;

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

        if (trackExpiry && !expiryDate) {
            throw new Error("Expiry date is required when expiry tracking is enabled.");
        }

        return {
            name,
            description: normalizeString(productData.description) || null,
            sku: normalizeString(productData.sku) || null,
            barcode: normalizeString(productData.barcode) || null,
            category: normalizeString(productData.category) || null,
            unit: normalizeString(productData.unit) || null,
            track_expiry: trackExpiry,
            expiry_date: trackExpiry ? expiryDate : null,
            batch_number: trackExpiry ? normalizeString(productData.batch_number) || null : null,
            price,
            selling_price: sellingPrice,
            stock_quantity: stockQuantity,
            low_stock_threshold: lowStockThreshold,
        };
    };

    const validateBulkProductsPayload = (rows = []) => {
        if (!Array.isArray(rows) || rows.length === 0) {
            throw new Error("Please add at least one product.");
        }

        return rows.map((row, index) => {
            try {
                return validateProductPayload(row);
            } catch (error) {
                throw new Error(`Row ${index + 1}: ${error.message}`);
            }
        });
    };

    const fetchProducts = async (statusFilter = "active") => {
        loadingProducts.value = true;
        errorMessage.value = "";

        try {
            const includeArchived = statusFilter !== "active";
            const response = await axios.get(
                `${API_BASE_URL}?includeArchived=${includeArchived}`,
                axiosConfig()
            );

            const records = Array.isArray(response.data) ? response.data : [];

            if (statusFilter === "active") {
                products.value = records.filter((p) => p.is_active !== false);
            } else if (statusFilter === "archived") {
                products.value = records.filter((p) => p.is_active === false);
            } else {
                products.value = records;
            }

            return products.value;
        } catch (error) {
            errorMessage.value =
                error.response?.data?.message || "Failed to fetch products";
            throw error;
        } finally {
            loadingProducts.value = false;
        }
    };

    const fetchProductDetails = async (productId) => {
        const response = await axios.get(`${API_BASE_URL}/${productId}`, axiosConfig());
        return response.data;
    };

    const saveProduct = async ({
        productData,
        isEditMode = false,
        editingProductId = null,
    }) => {
        errorMessage.value = "";
        isSubmittingProduct.value = true;

        try {
            const payload = validateProductPayload(productData);
            let response;

            if (isEditMode && editingProductId) {
                response = await axios.patch(
                    `${API_BASE_URL}/${editingProductId}`,
                    payload,
                    axiosConfig()
                );
            } else {
                response = await axios.post(API_BASE_URL, payload, axiosConfig());
            }

            return response.data;
        } catch (error) {
            errorMessage.value =
                error.response?.data?.message || error.message || "Failed to save product";
            throw error;
        } finally {
            isSubmittingProduct.value = false;
        }
    };

    const bulkCreateProducts = async (rows = []) => {
        errorMessage.value = "";
        isSubmittingProduct.value = true;

        try {
            const payload = validateBulkProductsPayload(rows);

            // Most likely backend shape based on your current route/controller setup
            const response = await axios.post(
                PRODUCT_BULK_CREATE_URL,
                { products: payload },
                axiosConfig()
            );

            return response.data;
        } catch (error) {
            errorMessage.value =
                error.response?.data?.message || error.message || "Failed to create products in bulk";
            throw error;
        } finally {
            isSubmittingProduct.value = false;
        }
    };

    const previewImportProducts = async (file) => {
        errorMessage.value = "";
        importLoading.value = true;

        try {
            if (!file) {
                throw new Error("Please select a file to preview.");
            }

            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                PRODUCT_IMPORT_PREVIEW_URL,
                formData,
                multipartConfig()
            );

            return response.data;
        } catch (error) {
            errorMessage.value =
                error.response?.data?.message || error.message || "Failed to preview import";
            throw error;
        } finally {
            importLoading.value = false;
        }
    };

    const confirmImportProducts = async (file) => {
        errorMessage.value = "";
        importLoading.value = true;

        try {
            if (!file) {
                throw new Error("Please select a file to import.");
            }

            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                PRODUCT_IMPORT_CONFIRM_URL,
                formData,
                multipartConfig()
            );

            return response.data;
        } catch (error) {
            errorMessage.value =
                error.response?.data?.message || error.message || "Failed to import products";
            throw error;
        } finally {
            importLoading.value = false;
        }
    };

    const addProductBatch = async (productId, batchData) => {
        errorMessage.value = "";
        batchLoading.value = true;

        try {
            if (!productId) {
                throw new Error("Product is required.");
            }

            const quantityReceived = normalizeInteger(batchData.quantity_received);
            const costPrice =
                batchData.cost_price === "" || batchData.cost_price === null
                    ? null
                    : normalizeNumber(batchData.cost_price);

            if (!Number.isInteger(quantityReceived) || quantityReceived <= 0) {
                throw new Error("Quantity received must be a valid whole number greater than 0.");
            }

            const payload = {
                quantity_received: quantityReceived,
                cost_price: costPrice,
                batch_number: normalizeString(batchData.batch_number) || null,
                received_date: batchData.received_date || null,
                expiry_date: batchData.expiry_date || null,
            };

            const response = await axios.post(
                PRODUCT_BATCHES_URL(productId),
                payload,
                axiosConfig()
            );

            return response.data;
        } catch (error) {
            errorMessage.value =
                error.response?.data?.message || error.message || "Failed to add stock batch";
            throw error;
        } finally {
            batchLoading.value = false;
        }
    };

    const archiveProduct = async (product) => {
        isMutating.value = true;
        errorMessage.value = "";

        try {
            const response = await axios.patch(PRODUCT_ARCHIVE_URL(product.id), {}, axiosConfig());
            return response.data;
        } catch (error) {
            errorMessage.value =
                error.response?.data?.message || "Failed to archive product";
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
            return response.data;
        } catch (error) {
            errorMessage.value =
                error.response?.data?.message || "Failed to restore product";
            throw error;
        } finally {
            isMutating.value = false;
        }
    };

    const deleteProductPermanently = async (product) => {
        isMutating.value = true;
        errorMessage.value = "";

        try {
            const response = await axios.delete(
                PRODUCT_PERMANENT_DELETE_URL(product.id),
                axiosConfig()
            );
            return response.data;
        } catch (error) {
            errorMessage.value =
                error.response?.data?.message || "Failed to permanently delete product";
            throw error;
        } finally {
            isMutating.value = false;
        }
    };

    const totalProductsCount = computed(() => products.value.length);

    return {
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
        totalProductsCount,
    };
}