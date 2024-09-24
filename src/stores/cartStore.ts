import { create } from "zustand";
import { persist } from "zustand/middleware";
import appwriteService from "@/appwrite/config";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  images?: string[];
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  setItems: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      setItems: (items: CartItem[]) => set({ items }),

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const userData = await appwriteService.getCurrentUser();
          if (!userData) {
            set({ items: [], isLoading: false });
            return;
          }
          const response = await fetch("/api/cart", {
            headers: { "user-id": userData.$id },
          });
          if (!response.ok) throw new Error("Failed to fetch cart");
          const data: CartItem[] = await response.json();
          set({ items: data, isLoading: false });
        } catch (error) {
          set({ error: "Failed to load cart items", isLoading: false });
          console.error("Error fetching cart:", error);
        }
      },

      addToCart: async (newItem: CartItem) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.productId === newItem.productId
        );

        try {
          const userData = await appwriteService.getCurrentUser();
          if (!userData) throw new Error("User not authenticated");

          const response = await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "user-id": userData.$id,
            },
            body: JSON.stringify({
              userId: userData.$id,
              productId: newItem.productId,
              quantity: existingItem
                ? existingItem.quantity + newItem.quantity
                : newItem.quantity,
            }),
          });

          if (!response.ok) throw new Error("Failed to add item to cart");

          const updatedItem = await response.json();
          set((state) => ({
            items: existingItem
              ? state.items.map((item) =>
                  item.productId === newItem.productId ? updatedItem : item
                )
              : [...state.items, updatedItem],
          }));
        } catch (error) {
          console.error("Error adding item to cart:", error);
          set({ error: "Failed to add item to cart" });
        }
      },

      updateQuantity: async (productId: number, newQuantity: number) => {
        try {
          const userData = await appwriteService.getCurrentUser();
          if (!userData) throw new Error("User not authenticated");

          const response = await fetch("/api/cart", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "user-id": userData.$id,
            },
            body: JSON.stringify({
              userId: userData.$id,
              productId,
              quantity: newQuantity,
            }),
          });

          if (!response.ok) throw new Error("Failed to update cart");

          const updatedItem = await response.json();
          set((state) => ({
            items: state.items.map((item) =>
              item.productId === productId ? updatedItem : item
            ),
          }));
        } catch (error) {
          console.error("Error updating cart:", error);
          set({ error: "Failed to update cart on the server" });
        }
      },

      removeFromCart: async (productId: number) => {
        try {
          const userData = await appwriteService.getCurrentUser();
          if (!userData) throw new Error("User not authenticated");

          const response = await fetch("/api/cart", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "user-id": userData.$id,
            },
            body: JSON.stringify({
              userId: userData.$id,
              productId,
            }),
          });

          if (!response.ok) throw new Error("Failed to remove item from cart");

          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
          }));
        } catch (error) {
          console.error("Error removing item from cart:", error);
          set({ error: "Failed to remove item from cart on the server" });
        }
      },

      clearCart: async () => {
        try {
          const userData = await appwriteService.getCurrentUser();
          if (!userData) throw new Error("User not authenticated");

          const response = await fetch("/api/cart", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "user-id": userData.$id,
            },
            body: JSON.stringify({
              userId: userData.$id,
              action: "clear",
            }),
          });

          if (!response.ok) throw new Error("Failed to clear cart");

          set({ items: [] });
        } catch (error) {
          console.error("Error clearing cart:", error);
          set({ error: "Failed to clear cart on the server" });
        }
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

export default useCartStore;
