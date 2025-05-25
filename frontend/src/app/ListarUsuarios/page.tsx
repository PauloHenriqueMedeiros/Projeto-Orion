// src/app/usuarios/page.tsx
'use client'; // Muito importante para componentes interativos no App Router

import React, { useEffect, useState } from "react";
import styled from "styled-components";

// Copie TODOS os seus styled-components (Container, Title, Table, Th, Td, DeleteButton, ButtonGroup, Message) para cá
// Para simplificar, vou omitir a repetição de todos eles aqui, mas eles devem estar no seu arquivo.

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #1c1c1c;
  color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
`;

const Th = styled.th`
  background: #5300b8;
  padding: 0.8rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 0.6rem;
  border-bottom: 1px solid #444;
`;

const DeleteButton = styled.button`
  padding: 0.8rem 1.2rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #c0392b;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center; /* CENTRALIZA O BOTÃO */
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
`;

const Message = styled.div`
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 5px;
  text-align: center;
  font-weight: 600;

  &.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  &.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
`;


interface GeneralMessage {
  text: string;
  type: "success" | "error" | "";
}

interface User {
  id: number;
  nome: string;
  gmail: string;
  idade: number;
  formacao: string;
  rua: string;
  numero: string;
  cidade: string;
  senha: string;
}

export default function UsuariosPage() { // Renomeado de UserList para UsuariosPage
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [generalMessage, setGeneralMessage] = useState<GeneralMessage>({ text: "", type: "" });

  const fetchUsuarios = () => {
    fetch("http://localhost:8080/usuarios")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: User[]) => setUsuarios(data))
      .catch((err) => {
        console.error("Erro ao buscar usuários:", err);
        showGeneralMessage("Erro ao carregar lista de usuários.", "error");
      });
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const showGeneralMessage = (text: string, type: GeneralMessage['type']) => {
    setGeneralMessage({ text, type });
    setTimeout(() => {
      setGeneralMessage({ text: "", type: "" });
    }, 3000);
  };

  const handleDeleteAllUsers = async () => {
    if (!window.confirm("Tem certeza que deseja excluir TODOS os usuários? Esta ação é irreversível!")) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/usuarios", {
        method: "DELETE",
      });

      if (response.ok) {
        const message = await response.text();
        showGeneralMessage(message, "success");
        setUsuarios([]); // Limpa a lista no frontend
      } else {
        const errorText = await response.text();
        showGeneralMessage(`Erro ao excluir usuários: ${errorText}`, "error");
        console.error("Erro ao excluir usuários:", response.status, response.statusText, errorText);
      }
    } catch (error) {
      showGeneralMessage("Erro de conexão ao tentar excluir usuários.", "error");
      console.error("Erro na requisição DELETE:", error);
    }
  };

  return (
    <Container>
      <Title>Usuários Cadastrados</Title>

      {generalMessage.text && <Message className={generalMessage.type}>{generalMessage.text}</Message>}

      {usuarios.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#ccc' }}>Nenhum usuário cadastrado.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Nome</Th>
              <Th>Gmail</Th>
              <Th>Idade</Th>
              <Th>Formação</Th>
              <Th>Endereço</Th>
              <Th>Senha</Th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user: User) => (
              <tr key={user.id}>
                <Td>{user.nome}</Td>
                <Td>{user.gmail}</Td>
                <Td>{user.idade}</Td>
                <Td>{user.formacao}</Td>
                <Td>{`${user.rua}, ${user.numero} - ${user.cidade}`}</Td>
                <Td>{user.senha}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Botão de Excluir Todos os Usuários fica abaixo da tabela e centralizado */}
      <ButtonGroup>
        <DeleteButton type="button" onClick={handleDeleteAllUsers}>
          Excluir Todos os Usuários
        </DeleteButton>
      </ButtonGroup>
      
    </Container>
  );
}