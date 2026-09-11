package com.example.legal_contract_management.config;

import com.example.legal_contract_management.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            org.springframework.security.config.annotation.web.builders.HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Login + Registration
                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        // ADMIN only
                        .requestMatchers("/api/audit-logs/**")
                        .hasRole("ADMIN")

                        // ADMIN + APPROVER
                        .requestMatchers("/api/approvals/**")
                        .hasAnyRole("ADMIN", "APPROVER")

                        // ADMIN + LEGAL_EDITOR
                        .requestMatchers("/api/modifications/**")
                        .hasAnyRole("ADMIN", "LEGAL_EDITOR")

                        // ADMIN + LEGAL_EDITOR + REVIEWER
                        .requestMatchers("/api/contracts/**")
                        .hasAnyRole("ADMIN", "LEGAL_EDITOR", "REVIEWER")

                        .requestMatchers("/api/documents/**")
                        .hasAnyRole("ADMIN", "LEGAL_EDITOR", "REVIEWER")

                        .requestMatchers("/api/versions/**")
                        .hasAnyRole("ADMIN", "LEGAL_EDITOR", "REVIEWER")

                        .requestMatchers("/api/clauses/**")
                        .hasAnyRole("ADMIN", "LEGAL_EDITOR", "REVIEWER")

                        // Everything else requires authentication
                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}