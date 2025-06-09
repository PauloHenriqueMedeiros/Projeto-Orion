package com.projeto.controller;

import com.projeto.model.User;
import com.projeto.repository.UserRepository;
import jakarta.persistence.EntityManager; 
import jakarta.persistence.PersistenceContext; 
import jakarta.transaction.Transactional; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*") 
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PersistenceContext 
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
    @Transactional 
    public ResponseEntity<String> deletarTodosUsuarios() {
        try {
            userRepository.deleteAll(); 

            entityManager.createNativeQuery("ALTER TABLE usuarios AUTO_INCREMENT = 1").executeUpdate();

            return new ResponseEntity<>("Todos os usuários foram excluídos com sucesso!", HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Erro ao deletar todos os usuários: " + e.getMessage());
            e.printStackTrace(); 
            return new ResponseEntity<>("Erro ao excluir usuários: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}