package com.example.realestate.config;

import java.util.Collections;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class AppConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            )
            .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
            .csrf().disable()
            .cors().configurationSource(new CorsConfigurationSource() {
                @Override
                public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                    CorsConfiguration cfg = new CorsConfiguration();
                    
                    // Recommended: Allow dynamic subdomains like Vercel & other frontend clients
                    cfg.setAllowedOriginPatterns(Collections.singletonList("*"));

                    // Allow all HTTP methods & headers
                    cfg.setAllowedMethods(Collections.singletonList("*"));
                    cfg.setAllowedHeaders(Collections.singletonList("*"));
                    
                    cfg.setAllowCredentials(true);
                    cfg.setExposedHeaders(Collections.singletonList("Authorization"));
                    cfg.setMaxAge(3600L);
                    return cfg;
                }
            })
            .and()
            .httpBasic()
            .and()
            .formLogin();

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
