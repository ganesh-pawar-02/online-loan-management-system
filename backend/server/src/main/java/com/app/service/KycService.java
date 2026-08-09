package com.app.service;

import com.app.dto.ApiResponse;
import com.app.dto.KycRequest;
import com.app.dto.KycResponse;

public interface KycService {

    // Admin / dashboard count
    Long countKycUsers();

    // Get logged-in user's KYC
    KycResponse getMyKyc(Long userId);

    // Update / submit logged-in user's KYC
    ApiResponse updateMyKyc(
            Long userId,
            KycRequest kycRequest
    );

    // Get logged-in user's KYC status
    String getKycStatus(Long userId);
}