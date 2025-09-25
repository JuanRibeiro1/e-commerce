import React, { useEffect, useState } from "react";
import { API_BASE } from "../api/config";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Loading";

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/orders?userId=${user.id}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user)
    return (
      <p className="text-center mt-6">
        Faça login para visualizar seus pedidos.
      </p>
    );

  if (loading) return <Loading />;

  if (orders.length === 0)
    return <p className="text-center mt-6">Você ainda não fez nenhum pedido.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Meus Pedidos</h2>
      <ul className="space-y-4">
        {orders.map(order => (
          <li key={order.id} className="border p-4 rounded-lg shadow">
            <div className="flex justify-between">
              <span className="font-bold">Pedido #{order.id}</span>
              <span className="text-sm text-gray-500">
                {new Date(order.date).toLocaleDateString()}
              </span>
            </div>
            <ul className="mt-2 pl-4 list-disc">
              {order.items.map(item => (
                <li key={item.productId}>
                  {item.name} (x{item.quantity})
                </li>
              ))}
            </ul>
            <p className="font-bold mt-2">
              Total: R$ {order.total.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}