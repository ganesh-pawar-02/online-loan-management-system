package com.app.security;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private CustomJWTAuthenticationFilter customJWTAuthenticationFilter;

	@Bean
	public SecurityFilterChain authorizeRequests(HttpSecurity http) throws Exception {
	    http
	        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
	        .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs
	        .authorizeHttpRequests(request -> request
	            // Public endpoints
	            .requestMatchers("/users/**", "/users/login", "/v*/api-doc*/**", "/swagger-ui/**").permitAll()
	            .requestMatchers(HttpMethod.OPTIONS).permitAll()
	            // Public data endpoints
	            .requestMatchers("/api/users/AllUsers", "/api/users/AllUsers/count").permitAll()
	            .requestMatchers("/loan-applications/Loancount").permitAll()
	            .requestMatchers("/kyc/kyccount").permitAll()
	            .requestMatchers("/users/change-password").permitAll()
	            .requestMatchers("/kyc/user/**").permitAll()
	            .requestMatchers("/kyc/update/**", "/transactions/**").permitAll()
	            // Common access (e.g., wallet balance)
	            .requestMatchers("/wallet/balance", "wallet/withdraw-funds", "wallet/add-funds").permitAll()
	            // Role-based access control
	            .requestMatchers("wallet/pay-emi", 
	                    "/loans/summary", "/loans/details", "/loan-applications/apply").hasAuthority("ROLE_USER")
	            .requestMatchers("/loans/**", "/transactions/**").hasAuthority("ROLE_ADMIN")
	            // Any other request requires authentication
	            .anyRequest().authenticated()
	        )
	        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // Stateless session management

	    // Add JWT Authentication Filter before UsernamePasswordAuthenticationFilter
	    http.addFilterBefore(customJWTAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

	    return http.build();
	}


	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of("http://localhost:3000","http://react_frontend","http://65.2.80.0:3000")); // Allow frontend origin
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("*")); // Allow all headers
		configuration.setAllowCredentials(true); // Allow authentication headers & cookies

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration); // Apply CORS settings globally to all endpoints
		return source;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
