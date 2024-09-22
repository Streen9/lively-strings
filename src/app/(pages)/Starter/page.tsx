import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Play,
} from "lucide-react";
import { CartItem, Product } from "@/app/interfaces";
import appwriteService from "@/appwrite/config";

export default function Starter() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userData, setUserData] = useState<{ id: string } | null>(null);

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
  }, []);

  const fetchCart = async () => {
    try {
      const userData = await appwriteService.getCurrentUser();
      if (!userData) {
        return [];
      }
      const response = await fetch("/api/cart", {
        headers: {
          "user-id": userData?.$id || "",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data: CartItem[] = await response.json();
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      const userData = await appwriteService.getCurrentUser();
      if (!userData) {
        return "";
      }
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.$id || "",
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

  const updateCartItemQuantity = async (
    productId: number,
    quantity: number
  ) => {
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
    <div className="container mx-auto px-4 py-8">
      {/* Featured Products Slider */}
      <div className="relative mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="relative h-96 overflow-hidden rounded-lg">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-lg">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
          onClick={nextSlide}
        >
          <ChevronRight className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* Product Categories */}
      {categories.map((category, categoryIndex) => (
        <div key={category} className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{category}</h2>
            <button className="text-blue-500 hover:text-blue-700">
              View all
            </button>
          </div>
          <div className="relative">
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-300"
              onClick={() => scrollCategory(categoryIndex, "left")}
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <div
              ref={(el) => (categoryRefs.current[categoryIndex] = el)}
              className="flex overflow-x-auto scrollbar-hide space-x-6 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <Link href={`/productDetail/${product.id}`} key={product.id}>
                    <div className="flex-none w-64 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer">
                      <div className="relative h-64">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-4">
                          <div className="flex items-center justify-between">
                            <div className="bg-white rounded-full px-2 py-1 text-sm font-semibold text-gray-800">
                              ${product.price.toFixed(2)}
                            </div>
                            <div className="flex items-center bg-white rounded-full px-2 py-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm font-semibold text-gray-800">
                                {product.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-black">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-black"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({product.ratingCount} ratings)
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-300"
              onClick={() => scrollCategory(categoryIndex, "right")}
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
