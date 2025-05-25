'use client'

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Register from "@/app/Register/page"; // seu formulário
import ListUsers from "@/app/ListarUsuarios/page";

export default function App() {
  return (
    <Router>
      <nav style={{ textAlign: "center", marginTop: "1rem" }}>
        <button>
          <Link to="/" style={{ margin: "1rem", color: "#5300b8", fontWeight: "bold" }}>Cadastro</Link>
        </button>
        <button>
          <Link to="/usuarios" style={{ margin: "1rem", color: "#5300b8", fontWeight: "bold" }}>Usuários</Link>
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/usuarios" element={<ListUsers />} />
      </Routes>
    </Router>
  );
}
