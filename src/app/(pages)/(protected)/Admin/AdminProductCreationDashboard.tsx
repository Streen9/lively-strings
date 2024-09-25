"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { PlusCircle, MinusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import appwriteService from "@/appwrite/config";
import { ID } from "appwrite";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: string;
  rating: string;
  ratingCount: string;
  description: string;
  category: string;
  features: string[];
  images: File[];
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_IMAGES = 5;

const AdminProductCreationDashboard: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    id: "",
    name: "",
    price: "",
    rating: "",
    ratingCount: "",
    description: "",
    category: "",
    features: [""],
    images: [],
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    setProduct((prev) => ({ ...prev, id: ID.unique() }));
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    index: number,
    field: keyof Product,
    value: string
  ) => {
    setProduct((prev) => ({
      ...prev,
      [field]: prev[field as keyof Pick<Product, "features">].map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const addArrayField = (field: keyof Pick<Product, "features">) => {
    setProduct((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (
    field: keyof Pick<Product, "features">,
    index: number
  ) => {
    setProduct((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.size <= MAX_FILE_SIZE);

    if (validFiles.length + product.images.length > MAX_IMAGES) {
      setError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    if (validFiles.length !== files.length) {
      setError(
        "Some files were not added because they exceed the 2MB size limit."
      );
    }

    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, MAX_IMAGES),
    }));

    setError("");
  };

  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!product.name || !product.price || !product.category) {
      setError("Please fill in all required fields.");
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls = await Promise.all(
        product.images.map(async (file, index) => {
          const fileId = `${product.id}_${index + 1}`;
          const result = await appwriteService.uploadFileToBucket({
            file,
            fileId,
          });
          return appwriteService.getFileUrl(result.$id);
        })
      );

      const productWithImageUrls = {
        ...product,
        images: uploadedUrls,
      };

      const response = await fetch("/api/products/createItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productWithImageUrls),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      setSuccess("Product created successfully!");

      // Reset form and generate a new UUID
      setProduct({
        id: ID.unique(),
        name: "",
        price: "",
        rating: "",
        ratingCount: "",
        description: "",
        category: "",
        features: [""],
        images: [],
      });
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to create product. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create New Product
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product ID (UUID)
            </label>
            <Input
              name="id"
              value={product.id}
              readOnly
              className="bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name*
            </label>
            <Input
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price*
            </label>
            <Input
              name="price"
              type="number"
              step="0.01"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <Input
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={product.rating}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating Count
            </label>
            <Input
              name="ratingCount"
              type="number"
              value={product.ratingCount}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <Input
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Features
          </label>
          {product.features.map((feature, index) => (
            <div key={index} className="flex mb-2">
              <Input
                value={feature}
                onChange={(e) =>
                  handleArrayChange(index, "features", e.target.value)
                }
                className="flex-grow"
              />
              <Button
                type="button"
                onClick={() => removeArrayField("features", index)}
                className="ml-2"
                variant="destructive"
              >
                <MinusCircle size={20} />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addArrayField("features")}
            className="mt-2"
            variant="outline"
          >
            <PlusCircle size={20} className="mr-2" /> Add Feature
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images (Max 5, 2MB each)
          </label>
          <Input
            type="file"
            multiple
            onChange={handleImageSelect}
            disabled={product.images.length >= MAX_IMAGES}
            accept="image/*"
          />
          {product.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    height={100}
                    width={100}
                    src={URL.createObjectURL(image)}
                    alt={`Selected image ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    type="button"
                    onClick={() => removeImage(index)}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={uploading}>
          {uploading ? "Creating Product..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
};

export default AdminProductCreationDashboard;
