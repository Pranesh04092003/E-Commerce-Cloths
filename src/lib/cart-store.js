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
    (set) => ({
      items: [],
      
      addToCart: (product) => set((state) => {
        const itemKey = `${product.id}-${product.selectedSize}`;
        const existingItem = state.items.find(item => 
          item.id === product.id && item.selectedSize === product.selectedSize
        );
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              (item.id === product.id && item.selectedSize === product.selectedSize)
                ? { ...item, quantity: item.quantity + product.quantity }
                : item
            ),
          };
        }
        
        return {
          items: [...state.items, { ...product }],
        };
      }),

      removeFromCart: (itemKey) => set((state) => ({
        items: state.items.filter(item => `${item.id}-${item.selectedSize}` !== itemKey),
      })),

      updateQuantity: (itemKey, newQuantity) => set((state) => ({
        items: state.items.map(item =>
          `${item.id}-${item.selectedSize}` === itemKey
            ? { ...item, quantity: Math.max(1, newQuantity) }
            : item
        ),
      })),

      clearExpiredCart: () => set({ items: [] }),

      getTotalItems: () => useCartStore.getState().items.length,

      getTotalPrice: () => {
        const items = useCartStore.getState().items;
        return items.reduce((total, item) => total + (item.salePrice * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => storage),
      version: 1, // Add version for potential future migrations
    }
  )
);

export { useCartStore };