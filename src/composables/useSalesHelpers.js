export function useSalesHelpers(customers, auth, receiptBusiness) {
    const formatPaymentMethod = (method) => {
        const map = {
            cash: "Cash",
            card: "Card",
            mobile_money: "Mobile Money",
        };
        return map[String(method || "").toLowerCase()] || "N/A";
    };

    const formatDateTime = (dateValue) => {
        if (!dateValue) return "N/A";
        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) return "N/A";

        return date.toLocaleString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatMoney = (value) => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(Number(value || 0));
    };

    const formatProductCode = (value) => {
        const code = String(value || "").trim();
        return code || "No product code";
    };

    const formatBarcode = (value) => {
        const barcode = String(value || "").trim();
        return barcode || "No barcode";
    };

    const getBusinessDisplayName = (sale) => {
        return sale?.business?.name || auth.businessName || receiptBusiness.value.name || "Your Business";
    };

    const getCustomerDisplayName = (sale) => {
        if (!sale) return "Walk-in Customer";

        const directName =
            sale.customer?.name || sale.customer_name || sale.customerName || sale.Customer?.name;

        if (directName && String(directName).trim()) return String(directName).trim();

        const customerId = Number(
            sale.customer_id || sale.customerId || sale.CustomerId || sale.customer?.id || 0
        );

        if (customerId) {
            const matchedCustomer = customers.value.find((customer) => Number(customer.id) === customerId);
            if (matchedCustomer?.name) return matchedCustomer.name;
        }

        return "Walk-in Customer";
    };

    const getCustomerEmail = (sale) => {
        if (!sale) return "No customer email";

        const directEmail =
            sale.customer?.email || sale.customer_email || sale.customerEmail || sale.Customer?.email;

        if (directEmail && String(directEmail).trim()) return String(directEmail).trim();

        const customerId = Number(
            sale.customer_id || sale.customerId || sale.CustomerId || sale.customer?.id || 0
        );

        if (customerId) {
            const matchedCustomer = customers.value.find((customer) => Number(customer.id) === customerId);
            if (matchedCustomer?.email) return matchedCustomer.email;
        }

        return "No customer email";
    };

    const getCustomerPhone = (sale) => {
        if (!sale) return "No phone number";

        const directPhone =
            sale.customer?.phone_number ||
            sale.customer?.phone ||
            sale.customer_phone_number ||
            sale.customerPhone ||
            "";

        if (directPhone && String(directPhone).trim()) return String(directPhone).trim();

        const customerId = Number(
            sale.customer_id || sale.customerId || sale.CustomerId || sale.customer?.id || 0
        );

        if (customerId) {
            const matchedCustomer = customers.value.find((customer) => Number(customer.id) === customerId);
            if (matchedCustomer?.phone_number) return matchedCustomer.phone_number;
        }

        return "No phone number";
    };

    const isWalkInCustomer = (sale) => getCustomerDisplayName(sale) === "Walk-in Customer";

    const formatSaleItemsSummary = (sale) => {
        if (Array.isArray(sale?.items) && sale.items.length > 0) {
            const names = sale.items
                .slice(0, 2)
                .map((item) => item.name || item.product?.name || `Product #${item.productId}`)
                .filter(Boolean);

            if (sale.items.length === 1) return names[0];
            if (sale.items.length === 2) return names.join(", ");
            return `${names.join(", ")} +${sale.items.length - 2} more`;
        }

        return "No items";
    };

    const getItemDisplayName = (item) => {
        return item?.name || item?.product?.name || `Product #${item?.productId || "N/A"}`;
    };

    const getItemProductCode = (item) => {
        return item?.sku || item?.product?.sku || "";
    };

    const getItemBarcode = (item) => {
        return item?.barcode || item?.product?.barcode || "";
    };

    const getItemCategory = (item) => {
        return item?.category || item?.product?.category || "";
    };

    const escapeHtml = (value) => {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    };

    return {
        formatPaymentMethod,
        formatDateTime,
        formatMoney,
        formatProductCode,
        formatBarcode,
        getBusinessDisplayName,
        getCustomerDisplayName,
        getCustomerEmail,
        getCustomerPhone,
        isWalkInCustomer,
        formatSaleItemsSummary,
        getItemDisplayName,
        getItemProductCode,
        getItemBarcode,
        getItemCategory,
        escapeHtml,
    };
}