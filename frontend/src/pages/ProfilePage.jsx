import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "../hooks/useRouter";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();

  if (!user)
    return (
      <p className="text-center mt-6">
        Você precisa fazer login para acessar seu perfil.
      </p>
    );

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Meu Perfil</h2>
      <div className="bg-white shadow p-4 rounded-lg space-y-3">
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/orders")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Meus Pedidos
        </button>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sair
        </button>
      </div>
    </div>
  );
}