import ProductDetail from "@/components/ProductDetail";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProductDetail id={params.id} />;
}
