// StackDeal Universal Cart Manager & LocalStorage Persistence
export const CART_STORAGE_KEY = 'stackdeal_cart';

/**
 * Get all cart items from browser localStorage
 */
export function getCartItems() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading cart from localStorage:', e);
    return [];
  }
}

/**
 * Save items to localStorage and broadcast real-time event to Navbar/Components
 */
export function saveCartItems(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('stackdeal_cart_updated'));
  } catch (e) {
    console.error('Error saving cart to localStorage:', e);
  }
}

/**
 * Add a deal with specific tier to cart
 */
export function addToCart(deal, selectedTierIndex = 0) {
  if (typeof window === 'undefined' || !deal) return [];
  const items = getCartItems();

  const tier = deal.pricingTiers?.[selectedTierIndex] || {
    tierName: deal.tierName || 'Starter Pass (5-Year Access)',
    price: deal.price || 4999,
    originalPrice: deal.originalPrice || 49999,
  };

  const chosenPrice = Number(tier.price || deal.price || 4999);
  const chosenOriginalPrice = Number(tier.originalPrice || deal.originalPrice || (chosenPrice * 10));
  const itemId = `${deal.slug || deal.id || 'deal'}-${(tier.tierName || 'standard').replace(/\s+/g, '-').toLowerCase()}`;

  const existingIndex = items.findIndex((i) => i.id === itemId || (i.slug === deal.slug && i.tierName === tier.tierName));

  if (existingIndex > -1) {
    items[existingIndex].quantity = (items[existingIndex].quantity || 1) + 1;
  } else {
    items.push({
      id: itemId,
      slug: deal.slug || deal.id,
      title: deal.title || 'SaaS 5-Year Pass',
      tierName: tier.tierName || '5-Year Access Pass',
      price: chosenPrice,
      originalPrice: chosenOriginalPrice,
      screenshot: deal.screenshots?.[0] || deal.screenshot || deal.heroImage || deal.vendorLogo || 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&auto=format&fit=crop&q=80',
      vendorName: deal.vendorName || 'SaaS Partner',
      quantity: 1,
      addedAt: new Date().toISOString(),
    });
  }

  saveCartItems(items);
  return items;
}

/**
 * Remove an item from the cart
 */
export function removeFromCart(itemId) {
  const items = getCartItems().filter((i) => i.id !== itemId && i.slug !== itemId);
  saveCartItems(items);
  return items;
}

/**
 * Update quantity (+1 or -1)
 */
export function updateCartQuantity(itemId, delta) {
  const items = getCartItems()
    .map((item) => {
      if (item.id === itemId || item.slug === itemId) {
        const newQty = (item.quantity || 1) + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    })
    .filter(Boolean);
  saveCartItems(items);
  return items;
}

/**
 * Clear all items in cart
 */
export function clearCart() {
  saveCartItems([]);
}

/**
 * Get total quantity count of items in cart
 */
export function getCartCount() {
  const items = getCartItems();
  return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

/**
 * Check if a specific deal is already in cart
 */
export function isInCart(dealSlug) {
  if (!dealSlug) return false;
  const items = getCartItems();
  return items.some((i) => i.slug === dealSlug || i.id === dealSlug || (i.id && i.id.startsWith(dealSlug)));
}
