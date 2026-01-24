package com.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.service.EmailService;

@RestController
@RequestMapping("/auth")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        boolean otpSent = emailService.generateOtp(email);
        if (otpSent) {
            return ResponseEntity.ok("OTP sent successfully.");
        }
        return ResponseEntity.badRequest().body("Failed to send OTP. Please try again.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = emailService.verifyOtp(email, otp);
        return isValid ? ResponseEntity.ok("OTP Verified successfully.") : ResponseEntity.badRequest().body("Invalid OTP.");
    }
}
