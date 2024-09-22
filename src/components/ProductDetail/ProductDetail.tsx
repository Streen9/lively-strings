"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const imageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:underline"
      >
        &larr; Back to products
      </button>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div
            ref={imageRef}
            className="relative w-full h-96 overflow-hidden rounded-lg mb-4 cursor-zoom-in"
            onMouseMove={handleMouseMove}
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
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image: string, index: number) => (
              <div
                key={index}
                className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer ${
                  index === currentImage ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleImageChange(index)}
              >
                <Image
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  width={80}
                  height={80}
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
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
            <span className="ml-2 text-sm text-gray-600">
              ({product.ratingCount} ratings)
            </span>
          </div>
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <ul className="list-disc list-inside mb-6">
            {product.features.map((feature, index) => (
              <li key={index} className="text-gray-700">
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex space-x-4 mb-6">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md flex items-center justify-center hover:bg-blue-600 transition-colors">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
            <button className="border border-gray-300 px-6 py-2 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Heart className="w-5 h-5 mr-2" />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
