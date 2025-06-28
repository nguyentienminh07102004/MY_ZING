package com.ptit.b22cn539.myzing.Configuration.Security;

import com.nimbusds.jwt.JWTClaimsSet;
import com.ptit.b22cn539.myzing.Commons.Enums.ROLE;
import com.ptit.b22cn539.myzing.ExceptionHandler.AppException;
import com.ptit.b22cn539.myzing.ExceptionHandler.DataInvalidException;
import com.ptit.b22cn539.myzing.Models.Entity.UserEntity;
import com.ptit.b22cn539.myzing.Repository.IUserRepository;
import com.ptit.b22cn539.myzing.Service.Jwt.IJwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(jsr250Enabled = true)
@RequiredArgsConstructor
@Slf4j
public class WebSecurityConfiguration {
    @Value("${secret_key}")
    private String apiKey;
    @Value("${server.servlet.context-path}")
    private String servletContextPath;
    private final IJwtService jwtService;
    private final IUserRepository userRepository;
    private final HttpServletRequest httpServletRequest;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.decoder(jwtDecoder())
                        .jwtAuthenticationConverter(jwtAuthenticationConverter())));
        http.cors(corsConfigurer -> corsConfigurer.configurationSource(urlBasedCorsConfigurationSource()));
        http.authorizeHttpRequests(req -> req
                .requestMatchers(HttpMethod.POST, "/auth/singers").hasRole(ROLE.ADMIN.toString())

                .requestMatchers(HttpMethod.GET, "/public/playlists").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/playlists").authenticated()
                .requestMatchers(HttpMethod.PUT, "/auth/playlist/{playlistId}/songs/{songIds}").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/auth/playlist/{playlistId}/songs/{songIds}").authenticated()

                .requestMatchers(HttpMethod.PUT, "/auth/songs").authenticated()
                .requestMatchers(HttpMethod.GET, "/public/songs").permitAll()
                .requestMatchers(HttpMethod.POST, "/auth/songs").authenticated()
                .requestMatchers(HttpMethod.PUT, "/auth/songs/favourites/{id}").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/auth/songs/{ids}").authenticated()
                .requestMatchers(HttpMethod.GET, "/auth/songs/my-song").authenticated()
                .requestMatchers(HttpMethod.GET, "/auth/songs/my-favourites").authenticated()

                .requestMatchers(HttpMethod.POST, "/public/users/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/public/users/login/google").permitAll()

                .requestMatchers("/swagger-ui/**", "/css/**", "/js/*", "/v3/**").permitAll()

                .requestMatchers("/fakes/**").permitAll()
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/auth/**").authenticated()
                .anyRequest().authenticated()
        );
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return jwt -> {
            String contextPath = this.httpServletRequest.getRequestURI();
            log.info(contextPath);
            try {
                JWTClaimsSet claimsSet = this.jwtService.getPayloadFromToken(jwt);
                String jwtID = claimsSet.getJWTID();
                if (this.jwtService.isExists(jwtID)) {
                    // logout
                    throw new DataInvalidException(AppException.TOKEN_INVALID);
                }
                boolean isExpired = this.jwtService.getPayloadFromToken(jwt).getExpirationTime().before(new Date(System.currentTimeMillis()));
                if (isExpired && contextPath.startsWith("%s/public".formatted(this.servletContextPath))) {
                    return Jwt.withTokenValue(jwt).build();
                }
                String email = claimsSet.getSubject();
                UserEntity user = this.userRepository.findByEmail(email)
                        .orElseThrow(() -> new DataInvalidException(AppException.USER_NOT_FOUND));
                if (user.isDeleted()) {
                    throw new DataInvalidException(AppException.UNAUTHENTICATED);
                }
                SecretKey secretKey = new SecretKeySpec(this.apiKey.getBytes(), MacAlgorithm.HS512.getName());
                return NimbusJwtDecoder.withSecretKey(secretKey)
                        .macAlgorithm(MacAlgorithm.HS512)
                        .build()
                        .decode(jwt);
            } catch (Exception exception) {
                if (contextPath.startsWith("%s/public".formatted(this.servletContextPath))) {
                    return new Jwt(jwt, Instant.now(), Instant.now().plusSeconds(3600), Map.of("alg", MacAlgorithm.HS512), Map.of("scope", "ROLE_ANONYMOUS"));
                }
                throw new DataInvalidException(AppException.TOKEN_INVALID);
            }
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
