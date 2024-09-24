"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash,
  Plus,
  Minus,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import useCartStore from "@/stores/cartStore";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";

const CartComponent: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const {
    items: cartItems,
    isLoading,
    error,
    fetchCart,
    updateQuantity,
    removeFromCart,
  } = useCartStore();

  const [loadingItems, setLoadingItems] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleUpdateQuantity = async (
    productId: number,
    newQuantity: number
  ) => {
    setLoadingItems((prev) => ({ ...prev, [productId]: true }));
    try {
      await updateQuantity(productId, newQuantity);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveFromCart = async (productId: number) => {
    setLoadingItems((prev) => ({ ...prev, [productId]: true }));
    try {
      await removeFromCart(productId);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (subtotal, item) => subtotal + item.price * item.quantity,
      0
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // Assuming 10% tax
  };

  const calculateShipping = () => {
    return 10; // Flat shipping rate of $10
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading cart...</span>
      </div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <h2 className="text-3xl font-bold mb-6">Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-gray-50 rounded-lg"
        >
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">
            Your cart is empty
          </h3>
          <p className="mt-2 text-gray-500">
            Looks like you haven&apos;t added any items yet.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push("/")} className="px-6">
              Start Shopping
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mb-6 overflow-hidden">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row items-center">
                        <div className="flex-shrink-0 mr-4 mb-4 md:mb-0">
                          <Image
                            src={
                              item.images && item.images.length > 0
                                ? item.images[0]
                                : "https://via.placeholder.com/100x100"
                            }
                            alt={item.name}
                            width={100}
                            height={100}
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold mb-2">
                            <a
                              href={`/productDetail/${item.productId}`}
                              className="text-blue-600 hover:underline"
                            >
                              {item.name}
                            </a>
                          </h3>
                          <p className="text-gray-700 text-lg font-medium mb-2">
                            ${item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                loadingItems[item.productId]
                              }
                            >
                              {loadingItems[item.productId] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Minus className="h-4 w-4" />
                              )}
                            </Button>
                            <span className="mx-4 text-lg">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              disabled={loadingItems[item.productId]}
                            >
                              {loadingItems[item.productId] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end mt-4 md:mt-0">
                          <p className="text-xl font-bold mb-2">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveFromCart(item.productId)}
                            disabled={loadingItems[item.productId]}
                          >
                            {loadingItems[item.productId] ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Trash className="h-4 w-4 mr-2" />
                            )}
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${calculateShipping().toFixed(2)}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 py-6 text-lg"
                  onClick={() => router.push("/checkout")}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartComponent;
