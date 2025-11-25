import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminPage from "../AdminPage";


beforeAll(() => {
  window.alert = jest.fn();
  global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
});

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes("/dashboard")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            totalVendasMes: 0,
            produtoMaisVendido: null,
            baixoEstoque: []
          })
      });
    }

    if (url.includes("/products")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    }

    if (url.includes("/suppliers")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    }

    if (url.includes("/reports")) {
      return Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob(["fake pdf"], { type: "application/pdf" }))
      });
    }

    return Promise.reject("URL não mockada: " + url);
  });
});


jest.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ token: "fake-token-123" }),
}));

jest.mock("react-router-dom", () => ({
  Link: ({ children }) => <a>{children}</a>,
  useNavigate: () => jest.fn(),
}));

global.alert = jest.fn();

delete window.open;
window.open = jest.fn();

global.fetch = jest.fn();

describe("AdminPage - Testes completos", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalVendasMes: 1000,
        produtoMaisVendido: { id: 1, name: "Produto Teste", totalVendido: 12 },
        baixoEstoque: [],
      }),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
  });

  test("Renderiza o título do Dashboard", async () => {
    render(<AdminPage />);

    expect(
      await screen.findByText("Dashboard Administrativo")
    ).toBeInTheDocument();
  });

  test("Exibe Total de Vendas carregado", async () => {
    render(<AdminPage />);

    expect(await screen.findByText("R$ 1000.00")).toBeInTheDocument();
  });

  test("Ao clicar em adicionar produto, abre o formulário", async () => {
    render(<AdminPage />);

    const botao = await screen.findByText("Adicionar Produto");
    fireEvent.click(botao);

    expect(await screen.findByText("Novo Produto")).toBeInTheDocument();
  });

  test("Exibe produto carregado na lista", async () => {
    fetch.mockReset();
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          totalVendasMes: 1500,
          produtoMaisVendido: null,
          baixoEstoque: [],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            name: "PlayStation 5",
            description: "Console",
            price: 4500,
            stock: 3,
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    render(<AdminPage />);

    expect(await screen.findByText("PlayStation 5")).toBeInTheDocument();
  });

  test("Botão de relatório deve gerar PDF e chamar window.open", async () => {

    fetch.mockReset();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalVendasMes: 0,
        produtoMaisVendido: null,
        baixoEstoque: [],
      }),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(["PDF"], { type: "application/pdf" }),
    });

    render(<AdminPage />);

    const botao = await screen.findByText("Gerar Relatório de Vendas (PDF)");

    fireEvent.click(botao);

    expect(fetch).toHaveBeenLastCalledWith(
      "http://localhost:3001/api/reports/sales",
      {
        method: "GET",
        headers: { Authorization: "Bearer fake-token-123" },
      }
    );

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledTimes(1);
    });
  });
});