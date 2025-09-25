import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "../hooks/useRouter";

export default function RegisterPage() {
  const { register } = useAuth();
  const { navigate } = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register(name, email, password);
    if (result.success) navigate("/");
    else setError(result.error || "Erro ao registrar");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleRegister} className="bg-white p-6 shadow-md rounded-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Cadastro</h2>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border rounded p-2 mb-3"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded p-2 mb-3"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded p-2 mb-3"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
        >
          Criar Conta
        </button>
        <p className="mt-3 text-center">
          Já tem conta?{" "}
          <span onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer hover:underline">
            Faça login
          </span>
        </p>
      </form>
    </div>
  );
}