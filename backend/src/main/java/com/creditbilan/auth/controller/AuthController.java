package com.creditbilan.auth.controller;

import com.creditbilan.auth.dto.AuthDtos;
import com.creditbilan.auth.service.AuthService;
import com.creditbilan.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDtos.AuthResponse>> login(
            @Valid @RequestBody AuthDtos.LoginRequest request,
            HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        AuthDtos.AuthResponse response = authService.login(request, ip);
        return ResponseEntity.ok(ApiResponse.ok("Connexion réussie", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthDtos.UserInfo>> getMe(
            @AuthenticationPrincipal UserDetails userDetails) {
        AuthDtos.UserInfo userInfo = authService.getMe(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(userInfo));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.ok("OK"));
    }

    // Endpoint temporaire pour générer un hash BCrypt
    @GetMapping("/generate-hash")
    public ResponseEntity<ApiResponse<Map<String, String>>> generateHash(@RequestParam String password) {
        String hash = passwordEncoder.encode(password);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("password", password, "hash", hash)));
    }
}