import { CartItem, Product } from "../interfaces";

const fetchCart = async () => {
  try {
    const response = await fetch("/api/cart", {
      headers: {
        "user-id": "123", // Replace with actual user ID
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }
    const data: CartItem[] = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching cart:", err);
  }
};

const addToCart = async (product: Product) => {
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "123", // Replace with actual user ID
        productId: product.id,
        quantity: 1,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to add item to cart");
    }
    fetchCart();
  } catch (err) {
    console.error("Error adding item to cart:", err);
  }
};

const updateCartItemQuantity = async (productId: number, quantity: number) => {
  try {
    const response = await fetch("/api/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "123", // Replace with actual user ID
        productId,
        quantity,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to update cart item quantity");
    }
    fetchCart();
  } catch (err) {
    console.error("Error updating cart item quantity:", err);
  }
};

const removeFromCart = async (productId: number) => {
  try {
    const response = await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "123", // Replace with actual user ID
        productId,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to remove item from cart");
    }
    fetchCart();
  } catch (err) {
    console.error("Error removing item from cart:", err);
  }
};
