// src/main/java/com/projeto/controller/AuthController.java
package com.projeto.controller;

import com.projeto.model.User;
import com.projeto.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional; // Importar Optional

@RestController
@RequestMapping("/auth") // Novo caminho base para autenticação
@CrossOrigin(origins = "*") // Libera acesso do React
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // NOVO MÉTODO: Endpoint para login
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginUser) {
        // Validação básica: verificar se gmail e senha foram fornecidos
        if (loginUser.getGmail() == null || loginUser.getGmail().isEmpty() ||
            loginUser.getSenha() == null || loginUser.getSenha().isEmpty()) {
            return new ResponseEntity<>("Email e senha são obrigatórios.", HttpStatus.BAD_REQUEST);
        }

        // 1. Buscar usuário pelo gmail
        // Precisamos adicionar um método findByGmail no UserRepository
        Optional<User> userOptional = userRepository.findByGmail(loginUser.getGmail());

        // 2. Verificar se o usuário existe
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>("Credenciais inválidas.", HttpStatus.UNAUTHORIZED);
        }

        User foundUser = userOptional.get();

        // 3. Comparar a senha fornecida com a senha armazenada
        // ATENÇÃO: Em uma aplicação real, senhas NUNCA devem ser armazenadas em texto puro.
        // Elas devem ser HASHadas (ex: BCrypt) e comparadas com o hash.
        if (foundUser.getSenha().equals(loginUser.getSenha())) {
            return new ResponseEntity<>("Login bem-sucedido!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Credenciais inválidas.", HttpStatus.UNAUTHORIZED);
        }
    }
}