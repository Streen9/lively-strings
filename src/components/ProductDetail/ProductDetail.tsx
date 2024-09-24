"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useCartStore from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  ratingCount: number;
  description: string;
  features: string[];
  images: string[];
}

export default function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageChange = (index: number) => {
    setCurrentImage(index);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current) {
      const { left, top, width, height } =
        imageRef.current.getBoundingClientRect();
      const x = ((e.pageX - left) / width) * 100;
      const y = ((e.pageY - top) / height) * 100;
      setZoomPosition({ x, y });
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0],
      });
      toast({
        title: "Success",
        description: "Item added to cart successfully",
      });
    } catch (err) {
      console.error("Error adding item to cart:", err);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">Error: {error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 flex items-center"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
      </Button>
      <div className="grid lg:grid-cols-2 gap-12">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <motion.div
              ref={imageRef}
              className="relative w-full h-[500px] overflow-hidden cursor-zoom-in"
              onMouseMove={handleMouseMove}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={product.images[currentImage]}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-200 ease-in-out transform hover:scale-150"
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            </motion.div>
            <div className="flex space-x-2 p-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <motion.div
                  key={index}
                  className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer ${
                    index === currentImage ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => handleImageChange(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.ratingCount} ratings)
              </span>
            </div>
            <Badge variant="secondary" className="text-lg font-semibold mb-4">
              ${product.price.toFixed(2)}
            </Badge>
          </motion.div>

          <motion.p
            className="text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {product.description}
          </motion.p>

          <motion.ul
            className="list-disc list-inside space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {product.features.map((feature, index) => (
              <li key={index} className="text-gray-700">
                {feature}
              </li>
            ))}
          </motion.ul>

          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="w-5 h-5 mr-2" />
              )}
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <Button variant="outline" className="flex-1">
              <Heart className="w-5 h-5 mr-2" />
              Add to Wishlist
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
