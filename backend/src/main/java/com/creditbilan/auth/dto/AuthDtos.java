package com.creditbilan.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class LoginRequest {
        @Email(message = "Email invalide")
        @NotBlank(message = "Email obligatoire")
        private String email;

        @NotBlank(message = "Mot de passe obligatoire")
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String tokenType = "Bearer";
        private long expiresIn;
        private UserInfo user;
    }

    @Data
    public static class UserInfo {
        private Long id;
        private String email;
        private String fullName;
        private java.util.List<String> roles;
        private Long organizationId;
        private String organizationName;
    }
}
