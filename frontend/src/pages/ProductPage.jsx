import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../api/config";
import { useCart } from "../contexts/CartContext";
import Loading from "../components/Loading";

export default function ProductPage() {
  const { id } = useParams(); // pega o id da URL
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!product) return <p className="text-center mt-6">Produto não encontrado.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-green-600 font-bold mt-4 text-lg">
        R$ {product.price.toFixed(2)}
      </p>
      <button
        onClick={() => addToCart(product)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
}