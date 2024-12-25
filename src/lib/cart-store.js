import { create } from 'zustand';

const useCartStore = create((set) => ({
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

  getTotalItems: () => useCartStore.getState().items.length,

  getTotalPrice: () => {
    const items = useCartStore.getState().items;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
}));

export { useCartStore };