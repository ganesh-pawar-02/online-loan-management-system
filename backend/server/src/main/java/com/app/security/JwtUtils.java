package com.app.security;

import java.security.Key;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtils {

    @Value("${spring.security.jwt.secret.key}")
    private String jwtSecret;

    @Value("${spring.security.jwt.exp.time}")
    private int jwtExpirationMs;

    private Key key;

    @PostConstruct
    public void init() {
        // Decode the Base64 secret to obtain the correct key bytes.
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateJwtToken(Authentication authentication) {
        //log.info("Generating JWT token for authentication: {}", authentication);
        CustomUserDetailsImpl userPrincipal = (CustomUserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + jwtExpirationMs))
                .claim("authorities", getAuthoritiesInString(userPrincipal.getAuthorities()))
                .claim("user_id", userPrincipal.getUserEntity().getId())
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUserNameFromJwtToken(Claims claims) {
        return claims.getSubject();
    }

    public Claims validateJwtToken(String jwtToken) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwtToken)
                    .getBody();
        } catch (JwtException e) {
           // log.error("Invalid JWT token: {}", e.getMessage());
            return null;
        }
    }

    private String getAuthoritiesInString(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
    }

    public List<GrantedAuthority> getAuthoritiesFromClaims(Claims claims) {
        String authString = claims.get("authorities", String.class);
        return AuthorityUtils.commaSeparatedStringToAuthorityList(authString);
    }

    public Long getUserIdFromJwtToken(Claims claims) {
        Object userId = claims.get("user_id");
        if (userId instanceof Integer) {
            return ((Integer) userId).longValue();
        } else if (userId instanceof Long) {
            return (Long) userId;
        } else if (userId instanceof String) {
            try {
                return Long.parseLong((String) userId);
            } catch (NumberFormatException ex) {
                throw new IllegalArgumentException("Invalid user_id format in JWT token: " + userId);
            }
        } else {
            throw new IllegalArgumentException("Invalid type for user_id in JWT token: " + userId.getClass().getName());
        }
    }
    public String getUserRoleFromClaims(Claims claims) {
        return claims.get("authorities", String.class);
    }
    public Authentication populateAuthenticationTokenFromJWT(String jwt) {
        Claims payloadClaims = validateJwtToken(jwt);
        if (payloadClaims == null) {
            return null; // Invalid token, no authentication will be populated.
        }

        String email = getUserNameFromJwtToken(payloadClaims);
        List<GrantedAuthority> authorities = getAuthoritiesFromClaims(payloadClaims);
        Long userId = getUserIdFromJwtToken(payloadClaims);

        // Principal is set to the email and credentials hold the userId.
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(email, userId, authorities);
       // log.info("Token authenticated: isAuthenticated={}", token.isAuthenticated());
        return token;
    }
}
