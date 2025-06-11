package com.ptit.b22cn539.myzing.Configuration.Security;

import com.ptit.b22cn539.myzing.ExceptionHandler.AppException;
import com.ptit.b22cn539.myzing.ExceptionHandler.DataInvalidException;
import com.ptit.b22cn539.myzing.Service.Jwt.IJwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(jsr250Enabled = true)
@RequiredArgsConstructor
public class WebSecurityConfiguration {
    @Value("${secret_key}")
    private String apiKey;
    private final IJwtService jwtService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.decoder(jwtDecoder())
                        .jwtAuthenticationConverter(jwtAuthenticationConverter())));
        http.cors(corsConfigurer -> corsConfigurer.configurationSource(urlBasedCorsConfigurationSource()));
        http.authorizeHttpRequests(req -> req
                .requestMatchers(HttpMethod.GET, "/singers").permitAll()

                .requestMatchers(HttpMethod.GET, "/playlists/public").permitAll()
                .requestMatchers(HttpMethod.POST, "/playlists").authenticated()
                .requestMatchers(HttpMethod.PUT, "/playlist/{playlistId}/songs/{songIds}").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/playlist/{playlistId}/songs/{songIds}").authenticated()

                .requestMatchers(HttpMethod.PUT, "/songs").permitAll()
                .requestMatchers(HttpMethod.GET, "/songs").permitAll()

                .requestMatchers(HttpMethod.POST, "/users/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/users/login/google").permitAll()

                .requestMatchers("/fakes/**").permitAll()
                .anyRequest().authenticated()
        );
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return jwt -> {
            String jwtID = this.jwtService.getPayloadFromToken(jwt).getJWTID();
            if (this.jwtService.isExists(jwtID)) {
                // logout
                throw new DataInvalidException(AppException.TOKEN_INVALID);
            }
            SecretKey secretKey = new SecretKeySpec(this.apiKey.getBytes(), MacAlgorithm.HS512.getName());
            return NimbusJwtDecoder.withSecretKey(secretKey)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build()
                    .decode(jwt);
        };
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        authenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return authenticationConverter;
    }

    @Bean
    public UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedOrigin("*");
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return urlBasedCorsConfigurationSource;
    }
}
