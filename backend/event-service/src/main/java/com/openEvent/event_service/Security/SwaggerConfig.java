package com.openEvent.event_service.Security;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI userAPI() {
        return new OpenAPI().info(
                new Info()
                        .title("openEvent")
                        .description("Plan your event. Be there when it happens.")
                        .version("1.0.0"));
    }
}

