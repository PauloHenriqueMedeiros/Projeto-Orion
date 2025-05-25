package com.projeto.controller;

import com.projeto.model.User;
import com.projeto.repository.UserRepository;
import jakarta.persistence.EntityManager; // Importar EntityManager
import jakarta.persistence.PersistenceContext; // Importar PersistenceContext
import jakarta.transaction.Transactional; // Importar Transactional

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*") // Libera acesso do React
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PersistenceContext // Injetar o EntityManager
    private EntityManager entityManager;

    @PostMapping
    public User cadastrarUsuario(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping
    public List<User> listarUsuarios() {
        return userRepository.findAll();
    }

    @DeleteMapping
    @Transactional // Garante que a operação de exclusão e o reset sejam atômicos
    public ResponseEntity<String> deletarTodosUsuarios() {
        try {
            userRepository.deleteAll(); // Exclui todos os registros

            // Resetar o auto-incremento da tabela 'usuarios'
            // IMPORTANTE: O nome da tabela é 'usuarios' (do @Table(name = "usuarios") em User.java)
            // Certifique-se de que o nome da tabela no SQL corresponde ao nome real no banco.
            entityManager.createNativeQuery("ALTER TABLE usuarios AUTO_INCREMENT = 1").executeUpdate();

            return new ResponseEntity<>("Todos os usuários foram excluídos com sucesso!", HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Erro ao deletar todos os usuários: " + e.getMessage());
            e.printStackTrace(); // Imprimir o stack trace completo para depuração
            return new ResponseEntity<>("Erro ao excluir usuários: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}