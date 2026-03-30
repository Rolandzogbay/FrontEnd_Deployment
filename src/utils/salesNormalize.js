export function normalizeArrayPayload(payload, keys = []) {
    if (Array.isArray(payload)) return payload;

    for (const key of keys) {
        if (Array.isArray(payload?.[key])) return payload[key];
    }

    if (Array.isArray(payload?.data)) return payload.data;

    return [];
}

export function normalizeCustomer(raw = {}) {
    return {
        ...raw,
        id: Number(raw.id || raw.customer_id || raw.customerId || 0),
        name: raw.name || raw.full_name || raw.customer_name || "Unnamed Customer",
        email: raw.email || raw.customer_email || "",
        phone_number: raw.phone_number || raw.phone || raw.customer_phone_number || "",
    };
}

export function normalizeItem(raw = {}) {
    const quantity = Number(raw.quantity || raw.qty || 0);
    const unitPrice = Number(raw.unit_price || raw.price || raw.unitPrice || raw.selling_price || 0);
    const subtotal = Number(
        raw.sub_total_price || raw.subtotal || raw.subTotal || quantity * unitPrice || 0
    );

    const product = raw.product || null;

    return {
        ...raw,
        id: raw.id || null,
        productId: Number(raw.productId || raw.product_id || raw.ProductId || product?.id || 0),
        name: raw.name || raw.product_name || product?.name || "",
        quantity,
        unit_price: unitPrice,
        sub_total_price: subtotal,
        barcode: raw.barcode || product?.barcode || "",
        sku: raw.sku || product?.sku || "",
        category: raw.category || product?.category || "",
        unit: raw.unit || product?.unit || "",
        track_expiry: !!(raw.track_expiry || product?.track_expiry),
        expiry_date: raw.expiry_date || product?.expiry_date || null,
        product,
    };
}

export function inferCustomerFromLookup(rawSale = {}, customerMap = new Map()) {
    const customerId = Number(
        rawSale.customerId ||
        rawSale.customer_id ||
        rawSale.CustomerId ||
        rawSale.customer?.id ||
        0
    );

    if (!customerId) return null;
    return customerMap.get(customerId) || null;
}

export function normalizeSale(raw = {}, customerMap = new Map()) {
    const itemsSource = Array.isArray(raw.items)
        ? raw.items
        : Array.isArray(raw.saleItems)
            ? raw.saleItems
            : Array.isArray(raw.SaleItems)
                ? raw.SaleItems
                : [];

    const lookedUpCustomer = inferCustomerFromLookup(raw, customerMap);

    return {
        ...raw,
        id: Number(raw.id || 0),
        customer_id:
            Number(raw.customer_id || raw.customerId || raw.CustomerId || raw.customer?.id || 0) || "",
        customer_name:
            raw.customer_name ||
            raw.customerName ||
            raw.customer?.name ||
            lookedUpCustomer?.name ||
            "",
        customer_email:
            raw.customer_email ||
            raw.customer?.email ||
            lookedUpCustomer?.email ||
            "",
        customer_phone_number:
            raw.customer_phone_number ||
            raw.customer?.phone_number ||
            raw.customer?.phone ||
            lookedUpCustomer?.phone_number ||
            "",
        payment_method: String(raw.payment_method || raw.paymentMethod || "cash").toLowerCase(),
        total_price: Number(raw.total_price || raw.total || raw.totalPrice || 0),
        sale_date: raw.sale_date || raw.createdAt || raw.date || null,
        createdAt: raw.createdAt || raw.sale_date || raw.date || null,
        userId: raw.userId || raw.user_id || raw.cashier_id || null,
        user: raw.user || raw.cashier || null,
        business: raw.business || null,
        customer: raw.customer || lookedUpCustomer || null,
        items: itemsSource.map(normalizeItem),
    };
}

export function normalizeSingleSalePayload(payload, customers = []) {
    const customerMap = new Map(customers.map((customer) => [Number(customer.id), customer]));
    const rawSale = payload?.sale || payload?.data?.sale || payload?.data || payload;
    const normalized = normalizeSale(rawSale, customerMap);

    const responseItems = Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.sale?.items)
            ? payload.sale.items
            : Array.isArray(payload?.data?.items)
                ? payload.data.items
                : Array.isArray(rawSale?.items)
                    ? rawSale.items
                    : [];

    normalized.items = responseItems.map(normalizeItem);

    const customerId = Number(
        normalized.customer_id ||
        normalized.customer?.id ||
        rawSale?.customer_id ||
        rawSale?.customerId ||
        0
    );

    if ((!normalized.customer || !normalized.customer.name) && customerId) {
        const matchedCustomer = customers.find((customer) => Number(customer.id) === customerId);
        if (matchedCustomer) {
            normalized.customer = matchedCustomer;
            normalized.customer_name = normalized.customer_name || matchedCustomer.name || "";
            normalized.customer_email = normalized.customer_email || matchedCustomer.email || "";
            normalized.customer_phone_number =
                normalized.customer_phone_number || matchedCustomer.phone_number || "";
        }
    }

    return normalized;
}