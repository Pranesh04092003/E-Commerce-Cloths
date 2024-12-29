import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const storage = {
  getItem: (name) => {
    const data = localStorage.getItem(name);
    if (data) {
      const { state, timestamp } = JSON.parse(data);
      // Check if data has expired
      if (timestamp && Date.now() - timestamp > EXPIRY_TIME) {
        localStorage.removeItem(name);
        return null;
      }
      return data;
    }
    return null;
  },
  setItem: (name, value) => {
    const data = {
      state: JSON.parse(value).state,
      timestamp: Date.now(),
    };
    localStorage.setItem(name, JSON.stringify(data));
  },
  removeItem: (name) => localStorage.removeItem(name),
};

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product) => {
        const { items } = get();
        // Create a unique key using both product ID and title to differentiate products
        const itemKey = `${product.id}-${product.title}-${product.selectedSize}`;
        
        // Check if exact same product exists
        const existingItemIndex = items.findIndex(
          item => 
            item.id === product.id && 
            item.title === product.title && 
            item.selectedSize === product.selectedSize
        );

        if (existingItemIndex !== -1) {
          // Update quantity of existing item
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += product.quantity || 1;
          set({ items: updatedItems });
        } else {
          // Add as new item
          set({ 
            items: [...items, { 
              ...product, 
              quantity: product.quantity || 1,
              cartItemId: itemKey // Add a unique identifier for each cart item
            }] 
          });
        }
      },

      removeFromCart: (itemKey) => set((state) => ({
        items: state.items.filter(item => 
          `${item.id}-${item.title}-${item.selectedSize}` !== itemKey
        ),
      })),

      updateQuantity: (itemKey, newQuantity) => {
        const { items } = get();
        
        if (newQuantity < 1) {
          set({
            items: items.filter(
              item => `${item.id}-${item.title}-${item.selectedSize}` !== itemKey
            )
          });
          return;
        }

        set({
          items: items.map(item => 
            `${item.id}-${item.title}-${item.selectedSize}` === itemKey
              ? { ...item, quantity: newQuantity }
              : item
          )
        });
      },

      clearExpiredCart: () => set({ items: [] }),

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => 
          total + (item.salePrice * item.quantity), 0
        );
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => storage),
      version: 1,
    }
  )
);

export { useCartStore };