import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import './App.css'
import { supabase } from './lib/supabaseClient';

export default function App() {
  const [imoveis, setImoveis] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [cidade, setCidade] = useState("");

  useEffect(() => {
    getImoveis();
  }, []);

  async function getImoveis() {
    const { data } = await supabase.from("imoveis").select();
    setImoveis(data);
  }

  // Controle de login e usuários
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginData, setLoginData] = useState({ usuario: "", senha: "" });
  const [showLogin, setShowLogin] = useState(false);

  // Lista de usuários autorizados
  const usuarios = [
    { usuario: "admin", senha: "Rob@#010447" },
    { usuario: "gestor", senha: "5678" },
  ];

  const autenticar = () => {
    const autorizado = usuarios.some(
      (u) => u.usuario === loginData.usuario && u.senha === loginData.senha
    );
    if (autorizado) {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginData({ usuario: "", senha: "" });
    } else {
      alert("Usuário ou senha inválidos!");
    }
  };

  const reservar = (imovel) => {
    setReservas([...reservas, imovel]);
  };

  // Cadastro de novo imóvel
  const [novoImovel, setNovoImovel] = useState({
    titulo: "",
    cidade: "",
    preco: "",
    detalhes: "",
    imagem: "",
  });

  const adicionarImovel = async () => {
    if (!novoImovel.titulo || !novoImovel.cidade) {
      alert("Preencha pelo menos título e cidade!");
      return;
    }
    const { data, error } = await supabase.from("imoveis").insert([novoImovel]).select();
    if (error) {
      console.error("Erro ao adicionar imóvel:", error);
      alert("Erro ao adicionar imóvel!");
    } else {
      setImoveis([...imoveis, ...data]);
      setNovoImovel({ titulo: "", cidade: "", preco: "", detalhes: "", imagem: "" });
    }
  };

  const removerImovel = async (id) => {
    const { error } = await supabase.from("imoveis").delete().eq("id", id);
    if (error) {
      console.error("Erro ao remover imóvel:", error);
      alert("Erro ao remover imóvel!");
    } else {
      setImoveis(imoveis.filter((imovel) => imovel.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Topo */}
      <header className="bg-blue-900 text-silver py-6 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <motion.img
            src="/logo-padrao-bc.png"
            alt="Padrão BC Imóveis"
            className="h-14 w-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          />
          <div className="flex gap-4 items-center">
            <h1 className="text-2xl font-bold text-silver">Padrão BC Imóveis</h1>
            <Button
              className="bg-silver text-blue-900 rounded-xl"
              onClick={() => setShowLogin(true)}
            >
              Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Tela de Login */}
      {showLogin && !isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Login Admin</h2>
            <input
              type="text"
              placeholder="Usuário"
              value={loginData.usuario}
              onChange={(e) => setLoginData({ ...loginData, usuario: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="password"
              placeholder="Senha"
              value={loginData.senha}
              onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <Button className="w-full bg-blue-900 text-silver" onClick={autenticar}>
              Entrar
            </Button>
          </div>
        </div>
      )}

      {/* Busca */}
      <section className="bg-blue-50 py-6">
        <div className="max-w-4xl mx-auto px-4 flex gap-2">
          <input
            type="text"
            placeholder="Digite a cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="flex-1 p-3 rounded-xl border border-blue-200 focus:outline-none"
          />
          <Button className="bg-blue-900 text-silver px-6 py-3 rounded-xl flex items-center gap-2">
            <Search size={18} /> Buscar
          </Button>
        </div>
      </section>

      {/* Lista de Imóveis */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imoveis
          .filter((imovel) =>
            cidade ? imovel.cidade.toLowerCase().includes(cidade.toLowerCase()) : true
          )
          .map((imovel) => (
            <motion.div key={imovel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="rounded-2xl overflow-hidden shadow-lg border border-silver">
                <img src={imovel.imagem} alt={imovel.titulo} className="h-48 w-full object-cover" />
                <CardContent className="p-4">
                  <h2 className="text-lg font-bold text-blue-900">{imovel.titulo}</h2>
                  <p className="text-gray-600">{imovel.detalhes}</p>
                  <p className="text-blue-900 font-semibold mt-2">R$ {imovel.preco}/noite</p>
                  <Button onClick={() => reservar(imovel)} className="mt-3 w-full bg-blue-900 text-silver rounded-xl">
                    Reservar
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </main>

      {/* Reservas */}
      <footer className="bg-blue-900 text-silver py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-3">Minhas Reservas</h2>
          {reservas.length === 0 ? (
            <p>Nenhuma reserva feita ainda.</p>
          ) : (
            <ul className="space-y-2">
              {reservas.map((r, idx) => (
                <li key={idx} className="border-b border-silver pb-2">
                  {r.titulo} - {r.cidade} (R$ {r.preco}/noite)
                </li>
              ))}
            </ul>
          )}
        </div>
      </footer>

      {/* Painel Administrativo */}
      {isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Painel Administrativo</h2>

            <div className="grid gap-2 mb-4">
              <input
                type="text"
                placeholder="Título"
                value={novoImovel.titulo}
                onChange={(e) => setNovoImovel({ ...novoImovel, titulo: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Cidade"
                value={novoImovel.cidade}
                onChange={(e) => setNovoImovel({ ...novoImovel, cidade: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Preço por noite"
                value={novoImovel.preco}
                onChange={(e) => setNovoImovel({ ...novoImovel, preco: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Detalhes"
                value={novoImovel.detalhes}
                onChange={(e) => setNovoImovel({ ...novoImovel, detalhes: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="URL da Imagem"
                value={novoImovel.imagem}
                onChange={(e) => setNovoImovel({ ...novoImovel, imagem: e.target.value })}
                className="p-2 border rounded"
              />
              <Button onClick={adicionarImovel} className="bg-blue-900 text-silver mt-2">
                Adicionar Imóvel
              </Button>
            </div>

            <h3 className="text-lg font-bold mb-2">Lista de Imóveis</h3>
            <ul className="max-h-48 overflow-y-auto space-y-2">
              {imoveis.map((i) => (
                <li key={i.id} className="flex justify-between items-center border-b pb-1">
                  {i.titulo} - {i.cidade}
                  <Button
                    onClick={() => removerImovel(i.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Remover
                  </Button>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => setIsAdmin(false)}
              className="mt-4 bg-gray-500 text-white rounded-xl"
            >
              Sair do Painel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}



// Forcing a new deploy on Vercel - 

