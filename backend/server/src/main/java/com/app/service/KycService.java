package com.app.service;

import com.app.dto.ApiResponse;
import com.app.dto.KycDetailsUpdateRequest;
import com.app.dto.KycRequest;
import com.app.pojos.KycEntity;

public interface KycService {
    
    Long countKycUsers();

    KycEntity getKycRecordsByUserId(Long userId);
    KycEntity updateKycDetails(Long id, KycDetailsUpdateRequest request);
    ApiResponse createKycRecord(KycRequest kycRequest);
}
