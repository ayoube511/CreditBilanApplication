package com.creditbilan.auth.service;

import com.creditbilan.auth.dto.AuthDtos;
import com.creditbilan.auth.security.JwtService;
import com.creditbilan.auth.security.UserDetailsServiceImpl;
import com.creditbilan.audit.service.AuditService;
import com.creditbilan.users.entity.User;
import com.creditbilan.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Value("${jwt.expiration-minutes}")
    private long expirationMinutes;

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request, String ipAddress) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(userDetails);

        User user = userRepository.findByEmailAndIsActiveTrue(request.getEmail()).orElseThrow();

        auditService.log("LOGIN", "USER", user.getId(), null, ipAddress);
        log.info("Connexion réussie: {}", request.getEmail());

        AuthDtos.UserInfo userInfo = new AuthDtos.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setEmail(user.getEmail());
        userInfo.setFullName(user.getFullName());
        userInfo.setRoles(user.getRoles().stream().map(r -> r.getCode()).collect(Collectors.toList()));
        if (user.getOrganization() != null) {
            userInfo.setOrganizationId(user.getOrganization().getId());
            userInfo.setOrganizationName(user.getOrganization().getName());
        }

        AuthDtos.AuthResponse response = new AuthDtos.AuthResponse();
        response.setToken(token);
        response.setExpiresIn(expirationMinutes * 60);
        response.setUser(userInfo);
        return response;
    }

    public AuthDtos.UserInfo getMe(String email) {
        User user = userRepository.findByEmailAndIsActiveTrue(email).orElseThrow();
        AuthDtos.UserInfo userInfo = new AuthDtos.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setEmail(user.getEmail());
        userInfo.setFullName(user.getFullName());
        userInfo.setRoles(user.getRoles().stream().map(r -> r.getCode()).collect(Collectors.toList()));
        if (user.getOrganization() != null) {
            userInfo.setOrganizationId(user.getOrganization().getId());
            userInfo.setOrganizationName(user.getOrganization().getName());
        }
        return userInfo;
    }
}
