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
@EnableMethodSecurity
public class SecurityConfig {

  // -------------------------------------------------------------------------
  // Rotas públicas — documentação e autenticação
  // -------------------------------------------------------------------------

  // Recursos do Swagger UI (interface HTML, assets e especificação OpenAPI).
  private static final String[] SWAGGER_WHITELIST = {
          "/swagger-ui/**",
          "/swagger-ui.html",
          "/v3/api-docs/**",
          "/v3/api-docs.yaml",
          "/webjars/**"
  };

  // Endpoints de autenticação e registro, sempre acessíveis.
  private static final String[] AUTH_WHITELIST = {
          "/auth/**"
  };

  // -------------------------------------------------------------------------
  // Bean principal — cadeia de filtros HTTP
  // -------------------------------------------------------------------------

  @Bean
  public SecurityFilterChain filterChain(final HttpSecurity http) throws Exception {
    return http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth

                    // -- Swagger e autenticação: sem restrição --------------------
                    .requestMatchers(SWAGGER_WHITELIST).permitAll()
                    .requestMatchers(AUTH_WHITELIST).permitAll()

                    // -- Registro público de usuário ------------------------------
                    .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()

                    // -- Criar solicitação: permitido a anônimos ------------------
                    .requestMatchers(HttpMethod.POST, "/solicitacoes").permitAll()

                    // -- Cidadão autenticado (específicas antes das genéricas) ----
                    .requestMatchers(HttpMethod.GET,  "/solicitacoes/minhas").authenticated()
                    .requestMatchers(HttpMethod.GET,  "/solicitacoes/meus-protocolos").authenticated()
                    .requestMatchers(HttpMethod.PUT,  "/solicitacoes/*/confirmar").authenticated()

                    // -- Perfil do usuário logado ---------------------------------
                    .requestMatchers("/usuarios/perfil").authenticated()
                    .requestMatchers("/usuarios/senha").authenticated()

                    // -- Consultas públicas de solicitações -----------------------
                    .requestMatchers(HttpMethod.GET, "/solicitacoes/protocolo/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/solicitacoes/publicas").permitAll()
                    .requestMatchers(HttpMethod.GET, "/solicitacoes/*/historico").permitAll()
                    .requestMatchers(HttpMethod.GET, "/solicitacoes/*").permitAll()

                    // -- Qualquer outra rota exige autenticação -------------------
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
          final AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }
}