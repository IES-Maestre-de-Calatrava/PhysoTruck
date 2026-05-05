package com.physiotrack.physiotrack.controller;

import com.physiotrack.physiotrack.entity.User;
import com.physiotrack.physiotrack.repository.UserRepository;
import com.physiotrack.physiotrack.security.JwtService;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@SecurityRequirements
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request == null || request.email() == null || request.password() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findByEmail(request.email()).orElse(null);
        if (user == null || !passwordEncoder.matches(request.password(), user.getContrasena())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(new LoginResponse(token));
    }

    public record LoginRequest(String email, String password) {
    }

    public record LoginResponse(String token) {
    }
}
