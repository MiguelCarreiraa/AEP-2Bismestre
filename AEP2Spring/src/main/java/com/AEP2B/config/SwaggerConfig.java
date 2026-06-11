package com.AEP2B.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {

        // Define o esquema de autenticação como HTTP Basic
        SecurityScheme basicAuth = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("basic")
                .description("Informe email e senha do usuário (cidadão ou gestor)");

        // Aplica o esquema globalmente a todos os endpoints
        SecurityRequirement securityRequirement =
                new SecurityRequirement().addList("basicAuth");

        return new OpenAPI()
                .info(new Info()
                        .title("falaUrbana API")
                        .description(
                                "API do portal de participação cidadã falaUrbana.\n\n" +
                                        "**Como autenticar:**\n" +
                                        "1. Clique no botão **Authorize 🔓** acima\n" +
                                        "2. Informe o email e senha de um usuário cadastrado\n" +
                                        "3. Clique em **Authorize** e depois **Close**\n" +
                                        "4. Agora você pode testar os endpoints protegidos\n\n" +
                                        "**Perfis disponíveis:**\n" +
                                        "- `ROLE_CIDADAO` — acessa /solicitacoes/minhas e confirmar\n" +
                                        "- `ROLE_GESTOR` — acessa todos os endpoints de gestão\n" +
                                        "- USERNAME:email\n" +
                                        "- PASSWORD:senha\n"

                        )
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("falaUrbana")
                                .email("contato@falaurbana.com.br")
                        )
                )
                .addSecurityItem(securityRequirement)
                .components(new Components()
                        .addSecuritySchemes("basicAuth", basicAuth)
                );
    }
}