package com.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.app.dto.ApiResponse;
import com.app.dto.KycDetailsUpdateRequest;
import com.app.dto.KycRequest;
import com.app.pojos.KycEntity;
import com.app.security.JwtUtils;
import com.app.service.KycService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/kyc")
@CrossOrigin(origins = "*")
public class KYCController {

    @Autowired
    private KycService kycService;
    
    @Autowired
    private JwtUtils jwtUtil;

    @GetMapping("/user/profile")
    public ResponseEntity<?> getKYCByUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        Claims claims = jwtUtil.validateJwtToken(token);
        Long userId = jwtUtil.getUserIdFromJwtToken(claims);

        KycEntity kyc = kycService.getKycRecordsByUserId(userId);
        if (kyc != null) {
            return ResponseEntity.ok(kyc);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("KYC record not found for user ID: " + userId));
        }
    }

    @PutMapping("/user/update")
    public ResponseEntity<KycEntity> updateKycDetails(
            HttpServletRequest request,
            @RequestBody KycDetailsUpdateRequest kycDetailsUpdateRequest) {

        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        Claims claims = jwtUtil.validateJwtToken(token);
        Long userId = jwtUtil.getUserIdFromJwtToken(claims);

        KycEntity updatedDetails = kycService.updateKycDetails(userId, kycDetailsUpdateRequest);
        return ResponseEntity.ok(updatedDetails);
    }

    @GetMapping("/kyccount")
    public Long getLoanAppliedUsersCount() {
        return kycService.countKycUsers();
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<ApiResponse> createKYC(@RequestBody KycRequest kycRequest) {
        try {
            ApiResponse response = kycService.createKycRecord(kycRequest);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new ApiResponse("Error creating KYC record: " + e.getMessage()));
        }
    }
}
