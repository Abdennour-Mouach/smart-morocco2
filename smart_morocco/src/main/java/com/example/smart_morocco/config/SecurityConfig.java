package com.example.smart_morocco.config;

import com.example.smart_morocco.model.Utilisateur;
import com.example.smart_morocco.service.UtilisateurService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Optional;

@Configuration
public class SecurityConfig {

    private final UtilisateurService utilisateurService;
    private final PasswordEncoder passwordEncoder;

    public SecurityConfig(UtilisateurService utilisateurService, PasswordEncoder passwordEncoder) {
        this.utilisateurService = utilisateurService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public AuthenticationProvider customAuthenticationProvider() {
        return new AuthenticationProvider() {
            @Override
            public org.springframework.security.core.Authentication authenticate(
                    org.springframework.security.core.Authentication authentication) {
                String email = authentication.getName();
                String password = authentication.getCredentials().toString();

                Optional<Utilisateur> userOpt = utilisateurService.getUtilisateurByEmail(email);

                if (userOpt.isPresent()) {
                    Utilisateur user = userOpt.get();

                    if (passwordEncoder.matches(password, user.getMot_de_passe())) {
                        return new UsernamePasswordAuthenticationToken(
                                user, null, java.util.Collections.emptyList());
                    } else {
                        throw new BadCredentialsException("Mot de passe incorrect");
                    }
                } else {
                    throw new UsernameNotFoundException("Utilisateur non trouvé");
                }
            }

            @Override
            public boolean supports(Class<?> authentication) {
                return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
            }
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults()) // Active le CORS
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/utilisateurs/**").permitAll()
                .requestMatchers("/api/contacts/**").permitAll()
                .requestMatchers("/api/evenements/**").permitAll()
                .requestMatchers("/api/hotels/**").permitAll()
                .anyRequest().authenticated()
            )
            .authenticationProvider(customAuthenticationProvider())
            .formLogin(form -> form.permitAll());

        return http.build();
    }

    // Configuration CORS pour autoriser ton frontend React
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // ton frontend React
        configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
