package ProjectRuX.ApiGateway.config;

import ProjectRuX.ApiGateway.filter.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()

            .route("user-management", r -> r.path("/user/**")
                    .filters(f -> f.filter(jwtAuthFilter))
                    .uri("lb://user-management"))
            // keep adding filters
            .route("authentication", r -> r.path("/auth/**")
                    .uri("lb://authentication"))
            .route("post-service", r -> r.path("/post/**")
                    .filters(f -> f.filter(jwtAuthFilter))
                    .uri("lb://post-service"))
            .build();

    }
}
