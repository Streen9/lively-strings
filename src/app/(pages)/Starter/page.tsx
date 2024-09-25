"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Play,
  Loader2,
} from "lucide-react";
import { Product } from "@/app/interfaces";
import appwriteService from "@/appwrite/config";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import LoginPopup from "@/components/popup/LoginPopup";
import useCartStore from "@/stores/cartStore";

export default function Starter() {
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [loadingItems, setLoadingItems] = useState<{ [key: number]: boolean }>(
    {}
  );

  const {
    items: cartItems,
    fetchCart,
    addToCart,
    isLoading: isCartLoading,
    error: cartError,
  } = useCartStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      fetchCart();
      router.replace(redirect);
    }
  }, [router, fetchCart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products/all/`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await response.json();
        setProducts(data);
        const uniqueCategories = Array.from(
          new Set(data.map((product) => product.category))
        );
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCart();
  }, [fetchCart]);

  const handleAddToCart = async (product: Product) => {
    setLoadingItems((prev) => ({ ...prev, [product.id]: true }));
    try {
      const userData = await appwriteService.getCurrentUser();
      if (!userData) {
        setIsLoginPopupOpen(true);
        return;
      }
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
      setLoadingItems((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const featuredProducts = products.slice(0, 3);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    setIsPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length
    );
    setIsPlaying(false);
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.currentTime = 0;
        videoRef.current
          .play()
          .catch((error) => console.error("Error playing video:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const scrollCategory = (
    categoryIndex: number,
    direction: "left" | "right"
  ) => {
    const container = categoryRefs.current[categoryIndex];
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-16 bg-gradient-to-b from-neutral-50 to-neutral-100">
      <section className="relative">
        <h2 className="text-4xl font-bold mb-8 text-neutral-800 tracking-tight">
          Featured Products
        </h2>
        <div className="relative h-[80vh] overflow-hidden rounded-2xl shadow-2xl">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-5xl font-bold text-white mb-4 leading-tight">
                  {product.name}
                </h3>
                <p className="text-3xl text-white mb-6">
                  ${product.price.toFixed(2)}
                </p>
                <Button
                  size="lg"
                  className="w-fit text-lg px-8 py-6 bg-white text-black hover:bg-black hover:text-white transition-colors duration-300"
                >
                  Shop Now
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white transition-colors duration-300"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white transition-colors duration-300"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </section>

      {/* Product Categories */}
      {categories.map((category, categoryIndex) => (
        <section key={category} className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-neutral-800">{category}</h2>
            <Button
              variant="link"
              className="text-lg text-neutral-600 hover:text-neutral-900 transition-colors duration-300"
            >
              View all
            </Button>
          </div>
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white transition-colors duration-300"
              onClick={() => scrollCategory(categoryIndex, "left")}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div
              ref={(el) => (categoryRefs.current[categoryIndex] = el)}
              className="flex overflow-x-auto scrollbar-hide space-x-8 pb-6"
            >
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <Card
                    key={product.id}
                    className="flex-none w-80 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link href={`/productDetail/${product.id}`}>
                      <div className="relative h-80">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-lg hover:scale-105 transition-transform duration-500"
                        />
                        <Badge className="absolute top-3 right-3 text-lg px-3 py-1 bg-white/80 text-black">
                          ${product.price.toFixed(2)}
                        </Badge>
                      </div>
                    </Link>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold text-xl truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-1">
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
                        <span className="text-sm text-gray-600 ml-2">
                          ({product.ratingCount})
                        </span>
                      </div>
                      <Button
                        className="w-full text-lg py-6 bg-neutral-800 hover:bg-neutral-900 text-white transition-colors duration-300"
                        onClick={() => handleAddToCart(product)}
                        disabled={loadingItems[product.id]}
                      >
                        {loadingItems[product.id] ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <ShoppingCart className="w-5 h-5 mr-2" />
                        )}
                        {loadingItems[product.id] ? "Adding..." : "Add to Cart"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white transition-colors duration-300"
              onClick={() => scrollCategory(categoryIndex, "right")}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </section>
      ))}
      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
      />
    </div>
  );
}
