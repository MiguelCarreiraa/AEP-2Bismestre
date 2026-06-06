// src/main/java/com/AEP2B/config/CorsConfig.java
package com.AEP2B.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Permite requisições do seu frontend React
        config.addAllowedOrigin("http://localhost:5173");

        // Permite todos os métodos HTTP
        config.addAllowedMethod("*");

        // Permite todos os headers (incluindo Authorization)
        config.addAllowedHeader("*");

        // Permite envio de credenciais (necessário para Basic Auth)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
