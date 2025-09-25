import React, { useEffect, useState } from 'react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Pedidos</h1>
      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {orders.map(order => (
            <div key={order.id} className="border p-4 rounded shadow">
              <p><strong>ID:</strong> {order.id}</p>
              <p><strong>Usuário:</strong> {order.userName}</p>
              <p><strong>Data:</strong> {new Date(order.date).toLocaleDateString()}</p>
              <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>
              <ul className="mt-2 list-disc list-inside">
                {order.items.map(item => (
                  <li key={item.id}>{item.name} - R$ {item.price.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;