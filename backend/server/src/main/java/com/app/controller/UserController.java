package com.app.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URLConnection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.app.dto.ApiResponse;
import com.app.dto.AuthRequest;
import com.app.dto.AuthResp;
import com.app.dto.PasswordChangeRequest;
import com.app.dto.UserDTO;
import com.app.dto.UserProfileDTO;
import com.app.dto.UserProfileRequest;
import com.app.pojos.UserEntity;
import com.app.repository.WalletRepository;
import com.app.security.CustomUserDetailsImpl;
import com.app.security.JwtUtils;
import com.app.service.EmailService;
import com.app.service.OtpService;
import com.app.service.UserService;

import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
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

    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    @Operation(description = "Register new user after OTP verification")
    public ResponseEntity<?> registerUser(
            @RequestBody @Valid UserDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.registerNewUser(dto));
    }

    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    @Operation(description = "User login with email & password")
    public ResponseEntity<?> userSignIn(
            @RequestBody @Valid AuthRequest dto) {

        Authentication authToken =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                dto.getEmail(),
                                dto.getPassword()));

        UserEntity user =
                ((CustomUserDetailsImpl)
                        authToken.getPrincipal())
                        .getUserEntity();

        String authTokenJWT =
                jwtUtils.generateJwtToken(
                        authToken);

        return ResponseEntity.ok(
                new AuthResp(
                        "Login Successful",
                        authTokenJWT,
                        user.getRole().name()));
    }

    // =========================================================
    // GET PROFILE
    // =========================================================

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(
            Authentication authentication) {

        CustomUserDetailsImpl userDetails =
                (CustomUserDetailsImpl)
                        authentication.getPrincipal();

        Long userId =
                userDetails.getUserEntity().getId();

        UserProfileDTO response =
                userService.getProfile(userId);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // UPDATE PROFILE
    // NAME + PHONE + PROFILE PICTURE
    // =========================================================

    @PutMapping(
            value = "/profile",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UserProfileDTO> updateProfile(
            @ModelAttribute UserProfileRequest request,
            Authentication authentication) {

        CustomUserDetailsImpl userDetails =
                (CustomUserDetailsImpl)
                        authentication.getPrincipal();

        Long userId =
                userDetails.getUserEntity().getId();

        UserProfileDTO response =
                userService.updateProfile(
                        userId,
                        request);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET PROFILE PICTURE
    // =========================================================

    @GetMapping("/profile-picture")
    public ResponseEntity<?> getProfilePicture(
            Authentication authentication) {

        CustomUserDetailsImpl userDetails =
                (CustomUserDetailsImpl)
                        authentication.getPrincipal();

        Long userId =
                userDetails.getUserEntity().getId();

        try {

            byte[] image =
                    userService.getProfilePicture(
                            userId);

            String contentType =
                    URLConnection
                            .guessContentTypeFromStream(
                                    new ByteArrayInputStream(
                                            image));

            if (contentType == null) {
                contentType = "image/jpeg";
            }

            return ResponseEntity.ok()
                    .contentType(
                            MediaType.parseMediaType(
                                    contentType))
                    .body(image);

        } catch (RuntimeException | IOException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            new ApiResponse(
                                    e.getMessage()));
        }
    }

    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody @Valid PasswordChangeRequest request) {

        try {

            userService.changePassword(
                    request);

            return ResponseEntity.ok(
                    new ApiResponse(
                            "Password changed successfully!"));

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            new ApiResponse(
                                    e.getMessage()));
        }
    }

    // =========================================================
    // YOUR EXISTING OTP APIs
    // =========================================================

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(
            @RequestBody
            java.util.Map<String, String> request) {

        String email =
                request.get("email");

        String otp =
                otpService.generateOtp(email);

        emailService.sendOtpEmail(
                email,
                otp);

        return ResponseEntity.ok(
                new ApiResponse(
                        "OTP sent to your email"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody @Valid
            com.app.dto.OtpRequest otpRequest) {

        boolean isValid =
                otpService.validateOtp(
                        otpRequest.getEmail(),
                        otpRequest.getOtp());

        if (isValid) {

            otpService.removeOtp(
                    otpRequest.getEmail());

            return ResponseEntity.ok(
                    new ApiResponse(
                            "OTP Verified Successfully"));
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(
                        new ApiResponse(
                                "Invalid OTP"));
    }
}