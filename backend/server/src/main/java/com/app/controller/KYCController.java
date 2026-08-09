package com.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.app.dto.ApiResponse;
import com.app.dto.KycRequest;
import com.app.dto.KycResponse;
import com.app.security.CustomUserDetailsImpl;
import com.app.service.KycService;

@RestController
@RequestMapping("/kyc")
@CrossOrigin(origins = "*")
public class KYCController {

    @Autowired
    private KycService kycService;

    // =========================================================
    // GET MY KYC PROFILE
    // =========================================================

    @GetMapping("/profile")
    public ResponseEntity<?> getMyKyc(
            Authentication authentication) {

        CustomUserDetailsImpl userDetails =
                (CustomUserDetailsImpl) authentication.getPrincipal();

        Long userId =
                userDetails.getUserEntity().getId();

        KycResponse response =
                kycService.getMyKyc(userId);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // UPDATE / SUBMIT MY KYC
    // =========================================================

    @PutMapping(
            value = "/profile",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<?> updateMyKyc(
            @ModelAttribute KycRequest kycRequest,
            Authentication authentication) {

        CustomUserDetailsImpl userDetails =
                (CustomUserDetailsImpl) authentication.getPrincipal();

        Long userId =
                userDetails.getUserEntity().getId();

        ApiResponse response =
                kycService.updateMyKyc(
                        userId,
                        kycRequest
                );

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET KYC COUNT
    // =========================================================

    @GetMapping("/kyccount")
    public Long getKycUsersCount() {

        return kycService.countKycUsers();
    }

    // =========================================================
    // GET KYC STATUS
    // =========================================================

    @GetMapping("/status")
    public ResponseEntity<?> getKycStatus(
            Authentication authentication) {

        CustomUserDetailsImpl userDetails =
                (CustomUserDetailsImpl) authentication.getPrincipal();

        Long userId =
                userDetails.getUserEntity().getId();

        String status =
                kycService.getKycStatus(userId);

        return ResponseEntity.ok(status);
    }
}