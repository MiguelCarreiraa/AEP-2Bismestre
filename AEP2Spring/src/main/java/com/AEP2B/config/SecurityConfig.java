package com.AEP2B.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity   // habilita @PreAuthorize nos controllers
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth

                        // Swagger e auth
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/auth/**").permitAll()

                        // Registro público
                        .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()

                        // Criar solicitação: anônimos podem criar
                        .requestMatchers(HttpMethod.POST, "/solicitacoes").permitAll()

                        // Rotas específicas do cidadão — vêm ANTES das genéricas
                        .requestMatchers(HttpMethod.GET,  "/solicitacoes/minhas").authenticated()
                        .requestMatchers(HttpMethod.GET,  "/solicitacoes/meus-protocolos").authenticated()

                        // Confirmar: exige autenticação (validação de duplicata feita no service)
                        .requestMatchers(HttpMethod.PUT, "/solicitacoes/*/confirmar").authenticated()

                        // Perfil
                        .requestMatchers("/usuarios/perfil").authenticated()
                        .requestMatchers("/usuarios/senha").authenticated()

                        // Busca pública
                        .requestMatchers(HttpMethod.GET, "/solicitacoes/protocolo/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/solicitacoes/publicas").permitAll()
                        .requestMatchers(HttpMethod.GET, "/solicitacoes/*/historico").permitAll()
                        .requestMatchers(HttpMethod.GET, "/solicitacoes/*").permitAll()

                        // Resto: autenticado
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}