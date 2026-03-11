package com.example.smart_morocco.config;

import com.example.smart_morocco.model.Utilisateur;
import com.example.smart_morocco.service.UtilisateurService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Optional;

@Configuration
public class SecurityConfig {

    private final UtilisateurService utilisateurService;

    public SecurityConfig(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
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

                    if (passwordEncoder().matches(password, user.getMot_de_passe())) {
                        // Authentifié avec succès
                        return new UsernamePasswordAuthenticationToken(
                                user, null, java.util.Collections.emptyList());
                    } else {
                        throw new RuntimeException("Mot de passe incorrect");
                    }
                } else {
                    throw new RuntimeException("Utilisateur non trouvé");
                }
            }

            @Override
            public boolean supports(Class<?> authentication) {
                return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
            }
        };
    }

    @Bean
    public SecurityFilterChain filterChain(org.springframework.security.config.annotation.web.builders.HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/user/**").hasRole("USER")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.permitAll())
            .logout(logout -> logout.permitAll())
            // ⚡️ important : utiliser ton AuthenticationProvider personnalisé
            .authenticationProvider(customAuthenticationProvider());

        return http.build();
    }
}