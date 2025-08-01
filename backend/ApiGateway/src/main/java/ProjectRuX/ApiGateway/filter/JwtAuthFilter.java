package ProjectRuX.ApiGateway.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthFilter implements GatewayFilter, Ordered {

    @Value("${auth.service.url}")
    private String authServiceUrl;

    @Value("${auth.path-prefix}")
    private String authPathPrefix;

    private final WebClient webClient = WebClient.create();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().toString();

        if (path.startsWith(authPathPrefix)) {
            return chain.filter(exchange);
        }

        HttpHeaders headers = exchange.getRequest().getHeaders();
        String authHeader = headers.getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        return webClient.post()
            .uri(authServiceUrl)
            .header(HttpHeaders.AUTHORIZATION, authHeader)
            .retrieve()
            .bodyToMono(AuthResponse.class) // <-- correct parsing
            .flatMap(response -> {
                if (!"success".equalsIgnoreCase(response.status)) {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                ServerWebExchange mutatedExchange = exchange.mutate()
                        .request(builder -> builder.header("X-User-Name", response.username))
                        .build();

                return chain.filter(mutatedExchange);
            })
            .onErrorResume(error -> {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            });
    }

        @Override
    public int getOrder() {
        return -1; // Make sure it runs early
    }

    public static class AuthResponse {
        public String status;
        public String username;
    }

}
