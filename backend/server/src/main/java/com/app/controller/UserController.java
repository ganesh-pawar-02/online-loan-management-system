package com.app.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.app.dto.ApiResponse;
import com.app.dto.AuthRequest;
import com.app.dto.AuthResp;
import com.app.dto.OtpRequest;
import com.app.dto.UserDTO;
import com.app.pojos.UserEntity;
import com.app.repository.WalletRepository;
import com.app.security.CustomUserDetailsImpl;
import com.app.security.JwtUtils;
import com.app.service.EmailService;
import com.app.service.OtpService;
import com.app.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@CrossOrigin(origins = "http://65.2.80.0:3000")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-otp")
    @Operation(description = "Send OTP to email for registration")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        System.out.println("Sending OTP to email: " + email);
        String otp = otpService.generateOtp(email);
        emailService.sendOtpEmail(email, otp);
        return ResponseEntity.ok(new ApiResponse("OTP sent to your email"));
    }
    
    @PostMapping("/verify-otp")
    @Operation(description = "Verify OTP using email")
    public ResponseEntity<?> verifyOtp(@RequestBody @Valid OtpRequest otpRequest) {
        System.out.println("Verifying OTP for email: " + otpRequest.getEmail());
        boolean isValid = otpService.validateOtp(otpRequest.getEmail(), otpRequest.getOtp());
        if (isValid) {
            otpService.removeOtp(otpRequest.getEmail());
            return ResponseEntity.ok(new ApiResponse("OTP Verified Successfully"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse("Invalid OTP"));
    }
    
    @PostMapping("/register")
    @Operation(description = "Register new user after OTP verification")
    public ResponseEntity<?> registerUser(@RequestBody @Valid UserDTO dto) {
        System.out.println("Registering user: " + dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.registerNewUser(dto));
    }
    
    @PostMapping("/login")
    @Operation(description = "User login with email & password")
    public ResponseEntity<?> userSignIn(@RequestBody @Valid AuthRequest dto) {
        System.out.println("User attempting login: " + dto);
        Authentication authToken = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
        UserEntity user = ((CustomUserDetailsImpl) authToken.getPrincipal()).getUserEntity();
        String authTokenJWT = jwtUtils.generateJwtToken(authToken);
        System.out.println("Generated Auth Token: " + authTokenJWT);
        return ResponseEntity.ok(new AuthResp("Login Successful", authTokenJWT, user.getRole().name()));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody @Valid UserDTO user) {
        System.out.println("Updating user profile: " + user);
        ApiResponse response = userService.updateUser(user);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody @Valid com.app.dto.PasswordChangeRequest changePasswordRequest) {
        try {
            userService.changePassword(changePasswordRequest);
            return ResponseEntity.ok().body(new ApiResponse("Password changed successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }
}
