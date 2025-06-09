package com.projeto.controller;

import com.projeto.model.User;
import com.projeto.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional; 

@RestController
@RequestMapping("/auth") 
@CrossOrigin(origins = "*") 
public class AuthController {

    @Autowired
    private UserRepository userRepository;


    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User loginUser) {

        if (loginUser.getGmail() == null || loginUser.getGmail().isEmpty() ||
            loginUser.getSenha() == null || loginUser.getSenha().isEmpty()) {
            return new ResponseEntity<>("Email e senha são obrigatórios.", HttpStatus.BAD_REQUEST);
        }


        Optional<User> userOptional = userRepository.findByGmail(loginUser.getGmail());

        if (userOptional.isEmpty()) {
            return new ResponseEntity<>("Credenciais inválidas.", HttpStatus.UNAUTHORIZED);
        }

        User foundUser = userOptional.get();


        if (foundUser.getSenha().equals(loginUser.getSenha())) {
            return new ResponseEntity<>("Login bem-sucedido!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Credenciais inválidas.", HttpStatus.UNAUTHORIZED);
        }
    }
}