package ProjectRuX.Authentication.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)) // or HttpStatus.FORBIDDEN
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
//                                "/auth/user/signup",
//                                "/auth/user/login",
//                                "/auth/user/validate",
                                "/auth/**",
                                    "/error"
//                                "/auth/user/validate"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .build();
    }
}

