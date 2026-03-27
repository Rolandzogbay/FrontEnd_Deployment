// src/utils/salesPrint.js
export function buildReceiptHtml({
    payload,
    helpers,
    auth,
    receiptBusiness,
}) {
    const {
        getBusinessDisplayName,
        getCustomerDisplayName,
        formatPaymentMethod,
        formatDateTime,
        formatMoney,
        escapeHtml,
    } = helpers;

    const sale = payload.sale || {};
    const business = sale.business || {};
    const businessName = getBusinessDisplayName(sale);
    const customerName = payload.customer_name || getCustomerDisplayName(sale);
    const paymentMethod = formatPaymentMethod(sale.payment_method);
    const receiptNo = `#SAL${String(sale.id || 0).padStart(4, "0")}`;
    const dateText = formatDateTime(sale.createdAt || sale.sale_date || new Date());
    const items = Array.isArray(payload.items) ? payload.items : [];
    const totalItems = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const totalAmount = formatMoney(sale.total_price || 0);

    const itemRows = items.length
        ? items
            .map(
                (item) => `
            <tr>
              <td>
                <div class="item-wrap">
                  <div class="item-icon">📦</div>
                  <div>
                    <div class="item-name">${escapeHtml(
                    item.name || item.product?.name || `Product #${item.productId}`
                )}</div>
                  </div>
                </div>
              </td>
              <td>${Number(item.quantity || 0)}</td>
              <td>${formatMoney(item.unit_price || 0)}</td>
              <td class="text-right">${formatMoney(item.sub_total_price || 0)}</td>
            </tr>
          `
            )
            .join("")
        : `
      <tr>
        <td colspan="4" style="text-align:center;color:#64748b;padding:16px 0;">
          No items found
        </td>
      </tr>
    `;

    return `
    <html>
      <head>
        <title>Sales Receipt</title>
        <style>
          * { box-sizing: border-box; }
          body { margin:0; background:#f8fafc; font-family:Inter,Arial,Helvetica,sans-serif; color:#0f172a; padding:32px; }
          .receipt { max-width:960px; margin:0 auto; background:#fff; border:1px solid #e2e8f0; border-radius:28px; overflow:hidden; }
          .top { background:linear-gradient(135deg,#0f172a,#1e293b,#0f172a); color:#fff; padding:32px; }
          .top-grid { display:grid; grid-template-columns:1.3fr 1fr; gap:24px; }
          .logo { width:68px; height:68px; border-radius:22px; background:rgba(255,255,255,0.1); display:grid; place-items:center; font-size:28px; margin-bottom:16px; }
          .business-name { font-size:28px; font-weight:800; margin:0; }
          .subtle { color:#cbd5e1; font-size:14px; margin-top:8px; }
          .contact { color:#cbd5e1; font-size:14px; margin-top:14px; line-height:1.6; }
          .stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
          .stat { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:14px; }
          .stat-label { color:#cbd5e1; font-size:12px; text-transform:uppercase; letter-spacing:0.05em; }
          .stat-value { margin-top:6px; font-size:15px; font-weight:800; color:#fff; }
          .body { padding:28px 32px; }
          table { width:100%; border-collapse:collapse; }
          th, td { text-align:left; padding:16px 0; border-bottom:1px solid #f1f5f9; font-size:14px; vertical-align:middle; }
          th { color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:0.04em; }
          .item-wrap { display:flex; align-items:center; gap:12px; }
          .item-icon { width:40px; height:40px; border-radius:14px; background:#fff7ed; display:grid; place-items:center; }
          .item-name { font-weight:600; color:#0f172a; }
          .text-right { text-align:right; }
          .summary { margin-top:24px; display:grid; grid-template-columns:1fr 360px; gap:24px; align-items:end; }
          .summary-box { border:1px solid #e2e8f0; background:#f8fafc; border-radius:22px; padding:20px; }
          .summary-row { display:flex; justify-content:space-between; font-size:14px; color:#475569; margin-bottom:10px; }
          .grand-total { display:flex; justify-content:space-between; font-size:22px; font-weight:800; color:#0f172a; margin-top:12px; }
          .grand-total .amount { color:#ea580c; }
          .footer-note { text-align:center; font-size:12px; color:#94a3b8; padding:8px 0 4px; }
          @media print {
            body { background:white; padding:0; }
            .receipt { border:none; border-radius:0; max-width:none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="top">
            <div class="top-grid">
              <div>
                <div class="logo">🧾</div>
                <h1 class="business-name">${escapeHtml(businessName)}</h1>
                <p class="subtle">Enterprise Sales Receipt</p>
                <div class="contact">
                  ${escapeHtml(business.address || receiptBusiness.value.address || "Business address unavailable")}<br/>
                  ${escapeHtml(business.phone || receiptBusiness.value.phone || "")}
                  ${(business.phone || receiptBusiness.value.phone) && (business.email || receiptBusiness.value.email) ? " • " : ""}
                  ${escapeHtml(business.email || receiptBusiness.value.email || "")}
                </div>
              </div>

              <div class="stat-grid">
                <div class="stat"><div class="stat-label">Receipt</div><div class="stat-value">${escapeHtml(receiptNo)}</div></div>
                <div class="stat"><div class="stat-label">Date</div><div class="stat-value">${escapeHtml(dateText)}</div></div>
                <div class="stat"><div class="stat-label">Customer</div><div class="stat-value">${escapeHtml(customerName)}</div></div>
                <div class="stat"><div class="stat-label">Payment</div><div class="stat-value">${escapeHtml(paymentMethod)}</div></div>
              </div>
            </div>
          </div>

          <div class="body">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th class="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>

            <div class="summary">
              <div>
                <div style="font-size:14px;color:#64748b;">Prepared by</div>
                <div style="font-weight:700;margin-top:6px;color:#0f172a;">
                  ${escapeHtml(sale.user?.name || auth.user?.name || "System User")}
                </div>
              </div>

              <div class="summary-box">
                <div class="summary-row">
                  <span>Total Items</span>
                  <span>${totalItems}</span>
                </div>
                <div class="grand-total">
                  <span>Grand Total</span>
                  <span class="amount">${totalAmount}</span>
                </div>
              </div>
            </div>

            <div class="footer-note">Thank you for your business.</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function openPrintWindow(html) {
    const printWindow = window.open("", "", "width=1000,height=750");
    if (!printWindow) return false;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 300);

    return true;
}