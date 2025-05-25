'use client'

import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #5300b8;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  color: white;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
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
  padding: 0.6rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
  &:focus {
    border-color: #7b00ff; 
    background-color: black;
  }
`;

const Group = styled.div`
  display: flex;
  gap: 1rem;

  & > div {
    flex: 1;
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #45a049;
  }
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

const ValidationError = styled.span`
  color: #ffdddd;
  font-size: 0.85rem;
  margin-top: 0.2rem;
  background-color: #c0392b;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
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

// Definindo o tipo para os dados do formulário
interface FormData {
  nome: string;
  gmail: string;
  idade: string; 
  formacao: string;
  rua: string;
  numero: string; 
  cidade: string;
  senha: string;
}

// Definindo o tipo para os erros de validação

interface ValidationErrors {
  idade?: string; // Opcional, pois pode não haver erro
  numero?: string; // Opcional, pois pode não haver erro
}

// Definindo o tipo para a mensagem geral
interface GeneralMessage {
  text: string;
  type: "success" | "error" | ""; // Tipos específicos permitidos
}

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    gmail: "",
    idade: "",
    formacao: "",
    rua: "",
    numero: "",
    cidade: "",
    senha: ""
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({}); // Inicializar como objeto vazio ou com chaves vazias
  const [generalMessage, setGeneralMessage] = useState<GeneralMessage>({ text: "", type: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limpa o erro de validação para o campo atual ao digitar
    setValidationErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[e.target.name as keyof ValidationErrors]; // Remove a chave se existir
      return newErrors;
    });
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

    let errors: ValidationErrors = {}; // Explicitamente tipado como ValidationErrors
    const idadeNum = parseInt(formData.idade);
    const numeroNum = parseInt(formData.numero);

    if (isNaN(idadeNum) || idadeNum <= 0 || idadeNum >= 100) {
      errors.idade = "A idade deve estar entre 0 e 100.";
    }
    if (isNaN(numeroNum) || numeroNum <= 0) {
      errors.numero = "O número deve ser positivo.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showGeneralMessage("Por favor, corrija os erros de validação.", "error");
      return;
    }

    // Limpa quaisquer erros de validação antigos se a validação passou
    setValidationErrors({}); // Corrigido para corresponder ao tipo ValidationErrors
    
    try {
      const response = await fetch("http://localhost:8080/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showGeneralMessage("Usuário cadastrado com sucesso!", "success");
        setFormData({
          nome: "",
          gmail: "",
          idade: "",
          formacao: "",
          rua: "",
          numero: "",
          cidade: "",
          senha: ""
        });
      } else {
        showGeneralMessage("Erro ao cadastrar usuário.", "error");
        console.error("Erro ao cadastrar usuário:", response.status, response.statusText);
        const errorData = await response.json();
        console.error("Detalhes do erro do backend:", errorData);
      }
    } catch (error) {
      showGeneralMessage("Erro de conexão com o servidor.", "error");
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <Container>
      <Title>Cadastro de Usuário</Title>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label>Nome</Label>
          <Input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
        </Field>

        <Field>
          <Label>Gmail</Label>
          <Input type="email" name="gmail" value={formData.gmail} onChange={handleChange} required />
        </Field>

        <Field>
          <Label>Idade</Label>
          <Input type="text" name="idade" value={formData.idade} onChange={handleChange} required />
          {validationErrors.idade && <ValidationError>{validationErrors.idade}</ValidationError>}
        </Field>

        <Field>
          <Label>Formação</Label>
          <Input type="text" name="formacao" value={formData.formacao} onChange={handleChange} required />
        </Field>

        <Center>
          <Title> Endereço </Title>
        </Center>
      
        <Group>
          <Field>
            <Label>Rua</Label>
            <Input type="text" name="rua" value={formData.rua} onChange={handleChange} required />
          </Field>

          <Field>
            <Label>Número</Label>
            <Input type="text" name="numero" value={formData.numero} onChange={handleChange} required />
            {validationErrors.numero && <ValidationError>{validationErrors.numero}</ValidationError>}
          </Field>
        </Group>

        <Field>
          <Label>Cidade</Label>
          <Input type="text" name="cidade" value={formData.cidade} onChange={handleChange} required />
        </Field>
        
        <Field>
          <Center>
            <Title> Senha </Title>
          </Center>
          <Input type="password" name="senha" value={formData.senha} onChange={handleChange} required />
        </Field>

        <Button type="submit"> Enviar </Button>
      </Form>
      {generalMessage.text && <Message className={generalMessage.type}>{generalMessage.text}</Message>}
    </Container>
  );
}