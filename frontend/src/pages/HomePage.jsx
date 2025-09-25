import React, { useEffect, useState } from "react";
import { API_BASE } from "../api/config";
import { useCart } from "../contexts/CartContext";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 shadow-md flex flex-col">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-gray-600 flex-1">{product.description}</p>
          <p className="text-green-600 font-bold mt-2">
            R$ {product.price.toFixed(2)}
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
            >
              Adicionar ao Carrinho
            </button>
            <Link
              to={`/product/${product.id}`}
              className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 text-black"
            >
              Ver Detalhes
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}