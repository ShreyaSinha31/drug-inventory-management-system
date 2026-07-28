import api from '../api/axios';

export const processMedBotQuery = async (queryText) => {
  const query = queryText.toLowerCase().trim();

  try {
    // 1. Fetch live product inventory & orders data
    const [productsRes, ordersRes] = await Promise.all([
      api.get('/products').catch(() => ({ data: { products: [] } })),
      api.get('/orders').catch(() => ({ data: [] }))
    ]);

    const products = productsRes.data.products || [];
    const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];

    // 2. Greeting
    if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
      return "Hello! I am MedBot 👋 How can I help you manage your drug inventory today?";
    }

    // 3. Drug / Product specific search
    const matchedProduct = products.find(p => query.includes(p.name.toLowerCase()));
    if (matchedProduct) {
      return `📦 **${matchedProduct.name}**\n- **Category**: ${matchedProduct.category || 'General'}\n- **Available Quantity**: ${matchedProduct.quantity} units\n- **Unit Price**: ₹${matchedProduct.price}\n- **Expiry Date**: ${new Date(matchedProduct.expDate).toLocaleDateString('en-GB')}\n- **Drug ID**: ${matchedProduct.drugId || 'DRUG-984210'}`;
    }

    // 4. Low stock / Shortage query
    if (query.includes('shortage') || query.includes('low stock') || query.includes('out of stock')) {
      const lowStock = products.filter(p => p.quantity < 10);
      if (lowStock.length === 0) {
        return "Good news! All drugs in your inventory have adequate stock (>= 10 units).";
      }
      const list = lowStock.map(p => `• ${p.name}: ${p.quantity} left`).join('\n');
      return `⚠️ **Low Stock Alert (${lowStock.length} items)**:\n${list}`;
    }

    // 5. Expiry / Expired query
    if (query.includes('expiry') || query.includes('expire') || query.includes('expired')) {
      const now = new Date();
      const nearExpiry = products.filter(p => new Date(p.expDate) <= new Date(now.getTime() + 90 * 24 * 3600 * 1000));
      if (nearExpiry.length === 0) {
        return "All registered drugs have expiration dates beyond the next 90 days.";
      }
      const list = nearExpiry.slice(0, 5).map(p => `• ${p.name}: Expires ${new Date(p.expDate).toLocaleDateString('en-GB')}`).join('\n');
      return `📅 **Upcoming Drug Expirations**:\n${list}`;
    }

    // 6. Total inventory / Stock quantity
    if (query.includes('total stock') || query.includes('inventory') || query.includes('total product')) {
      const totalQty = products.reduce((s, p) => s + p.quantity, 0);
      const totalVal = products.reduce((s, p) => s + (p.price * p.quantity), 0);
      return `📊 **Inventory Summary**:\n- **Total Products**: ${products.length} types\n- **Total Units**: ${totalQty} units\n- **Total Inventory Value**: ₹${totalVal.toLocaleString()}`;
    }

    // 7. Orders query
    if (query.includes('order') || query.includes('pending order')) {
      const pendingOrders = orders.filter(o => o.Status === 'Pending');
      return `🛒 **Order Status**:\n- **Total Orders**: ${orders.length}\n- **Pending Orders**: ${pendingOrders.length}\n- **Delivered Orders**: ${orders.filter(o => o.Status === 'Delivered' || o.Status === 'Received').length}`;
    }

    // 8. Payment / Revenue query
    if (query.includes('payment') || query.includes('revenue') || query.includes('sale')) {
      const totalRev = orders.filter(o => o.Payment === 'Paid').reduce((s, o) => s + (o.Amount || 0), 0);
      const pendingAmt = orders.filter(o => o.Payment === 'Unpaid' || o.Payment === 'Pending').reduce((s, o) => s + (o.Amount || 0), 0);
      return `💳 **Financial Overview**:\n- **Total Paid Revenue**: ₹${totalRev.toLocaleString()}\n- **PendingDues**: ₹${pendingAmt.toLocaleString()}`;
    }

    // Fallback response required by prompt
    return "I'm sorry, I couldn't find that information. Please contact the administrator.";
  } catch (error) {
    console.error("MedBot Engine Error:", error);
    return "I'm sorry, I couldn't find that information. Please contact the administrator.";
  }
};
