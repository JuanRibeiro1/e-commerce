import React from "react";
import { useCart } from "../hooks/useCart";
import { useRouter } from "../hooks/useRouter";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const { navigate } = useRouter();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate("/checkout");
  };

  if (cart.length === 0)
    return <p className="text-center mt-6">Seu carrinho está vazio.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Carrinho</h2>
      <ul className="space-y-4">
        {cart.map(item => (
          <li
            key={item.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <h3 className="font-bold">{item.name}</h3>
              <p>Qtd: {item.quantity}</p>
              <p className="text-green-600">
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:underline"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between items-center font-bold text-lg">
        <span>Total:</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={clearCart}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Limpar Carrinho
        </button>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
}