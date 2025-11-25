import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Building2,
  BarChart3,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";

const API_BASE = "http://localhost:3001/api";

const AdminPage = () => {
  const { token } = useAuth();

  const [totalSales, setTotalSales] = useState(0);
  const [topProduct, setTopProduct] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    supplierId: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
  });
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierSubmitting, setSupplierSubmitting] = useState(false);

  const loadDashboard = async () => {
    try {
      const resp = await fetch(`${API_BASE}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        console.error("Erro ao carregar dashboard:", err);
        return;
      }
      const data = await resp.json();
      setTotalSales(data.totalVendasMes || 0);
      if (data.produtoMaisVendido) {
        setTopProduct({
          id: data.produtoMaisVendido.id,
          name: data.produtoMaisVendido.name,
          totalVendido: data.produtoMaisVendido.totalVendido,
        });
      } else {
        setTopProduct(null);
      }
      setLowStockProducts(Array.isArray(data.baixoEstoque) ? data.baixoEstoque : []);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const loadSuppliers = async () => {
    try {
      const resp = await fetch(`${API_BASE}/suppliers`);
      const data = await resp.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar fornecedores:", err);
      setSuppliers([]);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadProducts();
    loadSuppliers();
    setLoading(false);
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      supplierId: "",
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      data.append("supplierId", formData.supplierId);

      const fileInput = document.getElementById("image");
      if (fileInput?.files[0]) {
        data.append("image", fileInput.files[0]);
      }

      const url = editingProduct
        ? `${API_BASE}/products/${editingProduct.id}`
        : `${API_BASE}/products`;

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (response.ok) {
        alert(
          editingProduct
            ? "Produto atualizado com sucesso!"
            : "Produto criado com sucesso!"
        );
        resetForm();
        await loadProducts();
        await loadDashboard();
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error || "Erro ao salvar produto"}`);
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Tente novamente.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEdit = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      category: product.category || "",
      supplierId: product.supplierId || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Tem certeza que deseja deletar este produto?")) return;

    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Produto deletado com sucesso!");
        await loadProducts();
        await loadDashboard();
      } else {
        const errorData = await response.json();
        alert(`Erro ao deletar produto: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto. Tente novamente.");
    }
  };

  const handleNewProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    resetForm();
    setShowForm(true);
  };


  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    setSupplierSubmitting(true);

    try {
      const url = editingSupplier
        ? `${API_BASE}/suppliers/${editingSupplier.id}`
        : `${API_BASE}/suppliers`;

      const method = editingSupplier ? "PUT" : "POST";

      const resp = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(supplierForm),
      });

      if (resp.ok) {
        alert(editingSupplier ? "Fornecedor atualizado!" : "Fornecedor criado!");
        setSupplierForm({ name: "", contact: "", email: "", phone: "" });
        setEditingSupplier(null);
        await loadSuppliers();
      } else {
        const errData = await resp.json();
        alert(errData.error || "Erro ao salvar fornecedor.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar fornecedor. Tente novamente.");
    } finally {
      setSupplierSubmitting(false);
    }
  };

  const handleSupplierEdit = (supplier) => {
    setEditingSupplier(supplier);
    setSupplierForm(supplier);
  };

  const handleSupplierDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este fornecedor?"))
      return;

    try {
      const resp = await fetch(`${API_BASE}/suppliers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.ok) {
        alert("Fornecedor removido.");
        loadSuppliers();
      } else {
        const errData = await resp.json();
        alert(errData.error || "Erro ao remover fornecedor.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao remover fornecedor. Tente novamente.");
    }
  };
  
  const gerarRelatorioVendas = async () => {
  try {
    const resp = await fetch(`${API_BASE}/reports/sales`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resp.ok) {
      const erro = await resp.json();
      alert(erro.error || "Erro ao gerar relatório de vendas.");
      return;
    }

    const blob = await resp.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (e) {
    console.error(e);
    alert("Erro ao gerar relatório de vendas.");
  }
};

const gerarRelatorioFinanceiro = async () => {
  try {
    const resp = await fetch(`${API_BASE}/reports/financial`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!resp.ok) {
      const erro = await resp.json();
      alert(erro.error || "Erro ao gerar relatório financeiro.");
      return;
    }

    const blob = await resp.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (e) {
    console.error(e);
    alert("Erro ao gerar relatório financeiro.");
  }
};

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* --------------------------------------- */}
      {/*           DASHBOARD ADMIN              */}
      {/* --------------------------------------- */}

      <h1 className="text-3xl font-bold mb-6">Dashboard Administrativo</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {}
        <div className="bg-white shadow p-6 rounded-lg border flex items-center gap-4">
          <div className="bg-green-100 text-green-700 p-4 rounded-lg">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total de vendas no mês</p>
            <h2 className="text-2xl font-bold">R$ {Number(totalSales || 0).toFixed(2)}</h2>
          </div>
        </div>

        {/* Produto mais vendido */}
        <div className="bg-white shadow p-6 rounded-lg border flex items-center gap-4">
          <div className="bg-blue-100 text-blue-700 p-4 rounded-lg">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Produto mais vendido</p>
            <h2 className="text-xl font-bold">
              {topProduct ? topProduct.name : "Nenhum"}
            </h2>
            {topProduct && (
              <p className="text-gray-600 text-sm">{topProduct.totalVendido} unidades</p>
            )}
          </div>
        </div>

        {/* Produtos com baixo estoque */}
        <div className="bg-white shadow p-6 rounded-lg border flex items-center gap-4">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Produtos com baixo estoque</p>
            <h2 className="text-xl font-bold">{lowStockProducts.length}</h2>
            {lowStockProducts.length > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                {lowStockProducts.slice(0, 3).map((p) => (
                  <div key={p.id}>
                    {p.name} — {p.stock}
                  </div>
                ))}
                {lowStockProducts.length > 3 && <div>e mais {lowStockProducts.length - 3}...</div>}
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Painel Admin - Produtos</h1>
        <button
          onClick={handleNewProduct}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Produto
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border">
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? "Editar Produto" : "Novo Produto"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fornecedor:</label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione um fornecedor</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Produto:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categoria:</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Console">Console</option>
                  <option value="Jogo">Jogo</option>
                  <option value="Acessório">Acessório</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preço (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estoque:</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Imagem do Produto:</label>
              <input id="image" type="file" accept="image/*" className="w-full p-3 border border-gray-300 rounded-lg" />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={formSubmitting} className="bg-blue-600 text-white px-8 py-3 rounded-lg">
                {formSubmitting ? (editingProduct ? "Atualizando..." : "Criando...") : editingProduct ? "Atualizar Produto" : "Criar Produto"}
              </button>

              <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-8 py-3 rounded-lg">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Lista de Produtos ({products.length})</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Nenhum produto cadastrado ainda.</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    {product.image_url ? (
                      <img src={`http://localhost:3001${product.image_url}`} alt={product.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      <div className="text-2xl">🎮</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-green-600 font-bold text-lg">R$ {product.price?.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">Estoque: {product.stock}</span>
                      {product.category && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">{product.category}</span>}
                      {product.supplierId && (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs ml-2">
                          Fornecedor: {(() => {
                            const s = suppliers.find((sup) => sup.id === product.supplierId);
                            return s ? s.name : "—";
                          })()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={(e) => handleEdit(product, e)} className="bg-yellow-500 text-white p-2 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button onClick={(e) => handleDelete(product.id, e)} className="bg-red-500 text-white p-2 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-12 p-6 bg-white shadow rounded-lg border">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Gerenciar Fornecedores
        </h2>

        <form onSubmit={handleSupplierSubmit} className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-medium text-sm mb-1 block">Nome</label>
            <input type="text" value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })} required className="w-full p-3 border rounded-lg" />
          </div>

          <div>
            <label className="font-medium text-sm mb-1 block">Contato</label>
            <input type="text" value={supplierForm.contact} onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })} className="w-full p-3 border rounded-lg" />
          </div>

          <div>
            <label className="font-medium text-sm mb-1 block">Email</label>
            <input type="email" value={supplierForm.email} onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })} className="w-full p-3 border rounded-lg" />
          </div>

          <div>
            <label className="font-medium text-sm mb-1 block">Telefone</label>
            <input type="text" value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })} className="w-full p-3 border rounded-lg" />
          </div>

          <button type="submit" disabled={supplierSubmitting} className="bg-blue-600 text-white py-3 rounded-lg col-span-2">
            {supplierSubmitting ? "Salvando..." : editingSupplier ? "Atualizar Fornecedor" : "Criar Fornecedor"}
          </button>
        </form>

        <div>
          <h3 className="text-lg font-semibold mb-2">Lista de Fornecedores ({suppliers.length})</h3>

          <div className="divide-y">
            {suppliers.length === 0 && <p className="text-gray-500 p-4 text-center">Nenhum fornecedor cadastrado.</p>}

            {suppliers.map((s) => (
              <div key={s.id} className="p-3 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="font-bold text-lg">{s.name}</p>
                  <p className="text-gray-600 text-sm">Contato: {s.contact || "—"}</p>
                  <p className="text-gray-600 text-sm">Email: {s.email || "—"}</p>
                  <p className="text-gray-600 text-sm">Telefone: {s.phone || "—"}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleSupplierEdit(s)} className="bg-yellow-500 text-white p-2 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button onClick={() => handleSupplierDelete(s.id)} className="bg-red-500 text-white p-2 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      

      <div className="mt-12 p-6 bg-white shadow rounded-lg border">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Relatórios de Vendas e Financeiro
        </h2>

        <p className="text-gray-600 mb-6">
          Gere relatórios com dados completos de vendas, faturamento mensal,
          produtos mais vendidos e desempenho financeiro.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold mb-3">📄 Relatório de Vendas</h3>
            <p className="text-gray-700 mb-4">
              Baixe um relatório detalhado com todas as vendas realizadas no sistema,
              incluindo valores, datas e produtos vendidos.
            </p>

            <button
              onClick = {gerarRelatorioVendas}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Gerar Relatório de Vendas (PDF)
            </button>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold mb-3">💰 Relatório Financeiro</h3>
            <p className="text-gray-700 mb-4">
              Gere um relatório com somatório de faturamento mensal, ticket médio,
              total vendido e balanço completo do período.
            </p>

            <button
              onClick= {gerarRelatorioFinanceiro}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Gerar Relatório Financeiro (PDF)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPage;