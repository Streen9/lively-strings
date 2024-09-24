import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const featuredProducts = [
  {
    name: "Handcrafted Swing",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Beautifully woven macramé swing, perfect for indoor or outdoor relaxation.",
  },
  {
    name: "Intricate Thread Art",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Stunning thread art piece showcasing vibrant colors and intricate patterns.",
  },
  {
    name: "Bohemian Summer Dress",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Handmade ladies' dress with unique embroidery and flowing design.",
  },
  {
    name: "Artisanal Craft Set",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Curated set of handmade crafting tools and materials for DIY enthusiasts.",
  },
];

const artisans = [
  {
    name: "Emma Craftswoman",
    specialty: "Master Weaver",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Liam Threadmaster",
    specialty: "Thread Artist",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Sophia Designeur",
    specialty: "Fashion Designer",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Oliver Craftsman",
    specialty: "Multi-craft Artisan",
    image: "/placeholder.svg?height=200&width=200",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
        About Our Handmade Haven
      </h1>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-4">Our Artisanal Journey</h2>
        <p className="text-lg mb-4">
          Welcome to our world of handcrafted wonders! Founded in 2023, our
          ecommerce site is a celebration of artisanal skill and creativity. We
          bring together a curated collection of handmade treasures, from
          whimsical swings to intricate thread art, bespoke ladies&apos;
          dresses, and an array of arts and crafts.
        </p>
        <p className="text-lg mb-4">
          Each item in our store tells a unique story - of tradition, of
          innovation, and of the skilled hands that brought it to life.
          We&apos;re not just selling products; we&apos;re sharing pieces of art
          that carry the warmth and dedication of their creators.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Featured Handmade Creations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.name} className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Meet Our Artisans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {artisans.map((artisan) => (
            <Card key={artisan.name} className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={artisan.image}
                  alt={artisan.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{artisan.name}</h3>
                  <p className="text-gray-600">{artisan.specialty}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-4">Our Handmade Promise</h2>
        <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
          &quot;To bring the beauty and uniqueness of handcrafted items to homes
          around the world, supporting artisans and preserving traditional
          craftsmanship while embracing modern design.&quot;
        </blockquote>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">What Sets Us Apart</h2>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>
            100% Handmade: Every item is crafted with care and attention to
            detail
          </li>
          <li>
            Unique Designs: Each piece is one-of-a-kind or part of a limited
            series
          </li>
          <li>
            Artisan Support: We work directly with skilled craftspeople,
            ensuring fair compensation
          </li>
          <li>
            Eco-Friendly: We prioritize sustainable materials and practices
          </li>
          <li>
            Quality Assurance: Rigorous quality checks to ensure the best for
            our customers
          </li>
        </ul>
      </section>
    </div>
  );
}
