'use client'; 

import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 400px; 
  margin: 2rem auto;
  padding: 2rem;
  background: #1c1c1c; 
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  color: white;
  font-family: 'Inter', sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #5300b8; 
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  padding: 0.8rem; 
  border-radius: 5px;
  border: 1px solid #444; 
  background-color: #333; 
  color: white;
  outline: none;
  &:focus {
    border-color: #5300b8; 
    box-shadow: 0 0 0 2px rgba(83, 0, 184, 0.5); 
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  background: #5300b8; 
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.1s;
  
  &:hover {
    background: #6a00e5; 
    transform: translateY(-2px); 
  }
  &:active {
    transform: translateY(0); 
  }
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

// Definindo os tipos para TypeScript
interface FormData {
  gmail: string;
  senha: string;
}

interface GeneralMessage {
  text: string;
  type: "success" | "error" | "";
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    gmail: "",
    senha: ""
  });

  const [generalMessage, setGeneralMessage] = useState<GeneralMessage>({ text: "", type: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showGeneralMessage = (text: string, type: GeneralMessage['type']) => {
    setGeneralMessage({ text, type });
    setTimeout(() => {
      setGeneralMessage({ text: "", type: "" });
    }, 3000); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gmail || !formData.senha) {
      showGeneralMessage("Por favor, preencha todos os campos.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) { 
        const message = await response.text();
        showGeneralMessage(message, "success");

      } else {
        const errorText = await response.text();
        showGeneralMessage(errorText || "Erro ao fazer login.", "error");
        console.error("Erro de login:", response.status, response.statusText, errorText);
      }
    } catch (error) {
      showGeneralMessage("Erro de conexão com o servidor.", "error");
      console.error("Erro na requisição de login:", error);
    }
  };

  return (
    <Container>
      <Title>Login de Usuário</Title>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="gmail">Gmail</Label>
          <Input 
            type="email" 
            id="gmail" 
            name="gmail" 
            value={formData.gmail} 
            onChange={handleChange} 
            required 
          />
        </Field>

        <Field>
          <Label htmlFor="senha">Senha</Label>
          <Input 
            type="password" 
            id="senha" 
            name="senha" 
            value={formData.senha} 
            onChange={handleChange} 
            required 
          />
        </Field>

        <Button type="submit">Entrar</Button>
      </Form>
      {generalMessage.text && <Message className={generalMessage.type}>{generalMessage.text}</Message>}
    </Container>
  );
}