import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;               // Content-hash ID
  productId: string;        // Sanity product ID
  productName: string;
  price: number;
  quantity: number;
  image: string;
  customizations: Record<string, any>;
  uploadedUrls?: Record<string, string>; // resolved photo asset URLs
  addedAt: number;          // Unix ms timestamp for stale-price detection
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "id" | "addedAt">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      addItem: (newItem) => {
        const { items } = get();
        // Generate a unique ID based on product name and customizations
        const customId = btoa(`${newItem.productName}-${JSON.stringify(newItem.customizations)}`);
        
        const existingItem = items.find((item) => item.id === customId);
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === customId
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...newItem, id: customId, addedAt: Date.now() }] });
        }
        
        set({ isOpen: true }); // Open cart drawer on add
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: "celebration-finds-cart",
    }
  )
);
