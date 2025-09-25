// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";

import { CartProvider } from "./contexts/CartContext";

// Componente para renderizar Header apenas quando necessário
function HeaderWrapper() {
  const location = useLocation();
  // não mostrar header em login e register
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }
  return <Header />;
}

function App() {
  return (
    <Router>
      <CartProvider>
        <HeaderWrapper /> {/* Header condicional */}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/my-orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;