package com.app.service;

import com.app.dto.ApiResponse;
import com.app.dto.KycRequest;
import com.app.dto.KycResponse;
import com.app.mapper.KycMapper;
import com.app.pojos.KycEntity;
import com.app.repository.KycRepository;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class KycServiceImpl implements KycService {

    @Autowired
    private KycRepository kycRepository;

    @Value("${file.upload.directory}")
    private String uploadDirectory;

    private Path fileStorageLocation;

    // =========================================================
    // INITIALIZE FILE STORAGE
    // =========================================================

    @PostConstruct
    public void init() {

        this.fileStorageLocation =
                Paths.get(uploadDirectory)
                        .toAbsolutePath()
                        .normalize();

        try {

            Files.createDirectories(
                    fileStorageLocation
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not create directory for file storage at: "
                            + fileStorageLocation,
                    e
            );
        }
    }

    // =========================================================
    // GET MY KYC
    // =========================================================

    @Override
    public KycResponse getMyKyc(Long userId) {

        KycEntity kyc = kycRepository
                .findByUserId(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "KYC record not found"
                        )
                );

        return KycMapper.INSTANCE.toDTO(kyc);
    }

    // =========================================================
    // UPDATE / SUBMIT MY KYC
    // =========================================================

    @Override
    public ApiResponse updateMyKyc(
            Long userId,
            KycRequest kycRequest) {

        try {

            KycEntity kyc = kycRepository
                    .findByUserId(userId)
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "KYC record not found"
                            )
                    );

            // =================================================
            // Personal Information
            // =================================================

            kyc.setDob(
                    kycRequest.getDob()
            );

            kyc.setGender(
                    kycRequest.getGender()
            );

            kyc.setFatherName(
                    kycRequest.getFatherName()
            );

            kyc.setMotherName(
                    kycRequest.getMotherName()
            );

            kyc.setMaritalStatus(
                    kycRequest.getMaritalStatus()
            );

            // =================================================
            // Permanent Address
            // =================================================

            kyc.setPermanentStreet(
                    kycRequest.getPermanentStreet()
            );

            kyc.setPermanentCity(
                    kycRequest.getPermanentCity()
            );

            kyc.setPermanentState(
                    kycRequest.getPermanentState()
            );

            kyc.setPermanentZipCode(
                    kycRequest.getPermanentZipCode()
            );

            // =================================================
            // Correspondence Address
            // =================================================

            kyc.setCorrespondenceStreet(
                    kycRequest.getCorrespondenceStreet()
            );

            kyc.setCorrespondenceCity(
                    kycRequest.getCorrespondenceCity()
            );

            kyc.setCorrespondenceState(
                    kycRequest.getCorrespondenceState()
            );

            kyc.setCorrespondenceZipCode(
                    kycRequest.getCorrespondenceZipCode()
            );

            // =================================================
            // Identity Information
            // =================================================

            kyc.setPanNumber(
                    kycRequest.getPanNumber()
            );

            kyc.setAadhaarNumber(
                    kycRequest.getAadhaarNumber()
            );

            kyc.setPassportNumber(
                    kycRequest.getPassportNumber()
            );

            kyc.setVoterIdNumber(
                    kycRequest.getVoterIdNumber()
            );

            kyc.setDrivingLicenseNumber(
                    kycRequest.getDrivingLicenseNumber()
            );

            // =================================================
            // Financial Information
            // =================================================

            kyc.setAnnualIncome(
                    kycRequest.getAnnualIncome()
            );

            kyc.setSourceOfIncome(
                    kycRequest.getSourceOfIncome()
            );

            kyc.setOccupation(
                    kycRequest.getOccupation()
            );

            kyc.setEmployerName(
                    kycRequest.getEmployerName()
            );

            // =================================================
            // Banking Information
            // =================================================

            kyc.setBankName(
                    kycRequest.getBankName()
            );

            kyc.setBankAccountNumber(
                    kycRequest.getBankAccountNumber()
            );

            kyc.setIfscCode(
                    kycRequest.getIfscCode()
            );

            kyc.setAccountType(
                    kycRequest.getAccountType()
            );

            // =================================================
            // Document Uploads
            // =================================================

            if (kycRequest
                    .getAadhaarCardImagePathFile() != null
                    && !kycRequest
                    .getAadhaarCardImagePathFile()
                    .isEmpty()) {

                kyc.setAadhaarCardImagePath(
                        saveFileAndGetPath(
                                kycRequest
                                        .getAadhaarCardImagePathFile(),
                                "aadhaar-cards"
                        )
                );
            }

            if (kycRequest
                    .getUtilityBillImagePathFile() != null
                    && !kycRequest
                    .getUtilityBillImagePathFile()
                    .isEmpty()) {

                kyc.setUtilityBillImagePath(
                        saveFileAndGetPath(
                                kycRequest
                                        .getUtilityBillImagePathFile(),
                                "utility-bills"
                        )
                );
            }

            if (kycRequest
                    .getRentalAgreementImagePathFile() != null
                    && !kycRequest
                    .getRentalAgreementImagePathFile()
                    .isEmpty()) {

                kyc.setRentalAgreementImagePath(
                        saveFileAndGetPath(
                                kycRequest
                                        .getRentalAgreementImagePathFile(),
                                "rental-agreements"
                        )
                );
            }

            if (kycRequest
                    .getPassportImagePathFile() != null
                    && !kycRequest
                    .getPassportImagePathFile()
                    .isEmpty()) {

                kyc.setPassportImagePath(
                        saveFileAndGetPath(
                                kycRequest
                                        .getPassportImagePathFile(),
                                "passports"
                        )
                );
            }

            if (kycRequest
                    .getPanCardImageFile() != null
                    && !kycRequest
                    .getPanCardImageFile()
                    .isEmpty()) {

                kyc.setPanCardImagePath(
                        saveFileAndGetPath(
                                kycRequest
                                        .getPanCardImageFile(),
                                "pan-cards"
                        )
                );
            }

            // =================================================
            // Update KYC Status
            // =================================================

            // Assuming your enum contains SUBMITTED
            // kyc.setKycStatus(KycStatus.SUBMITTED);

            kycRepository.save(kyc);

            return new ApiResponse(
                    "KYC submitted successfully"
            );

        } catch (IOException e) {

            return new ApiResponse(
                    "Failed to save KYC documents: "
                            + e.getMessage()
            );
        }
    }

    // =========================================================
    // GET KYC STATUS
    // =========================================================

    @Override
    public String getKycStatus(Long userId) {

        KycEntity kyc = kycRepository
                .findByUserId(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "KYC record not found"
                        )
                );

        if (kyc.getKycStatus() == null) {
            return "NOT_COMPLETED";
        }

        return kyc.getKycStatus().name();
    }

    // =========================================================
    // COUNT KYC USERS
    // =========================================================

    @Override
    public Long countKycUsers() {

        return kycRepository.countKycUsers();
    }

    // =========================================================
    // SAVE FILE
    // =========================================================

    private String saveFileAndGetPath(
            MultipartFile file,
            String subdirectory)
            throws IOException {

        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFilename =
                file.getOriginalFilename();

        String uniqueFilename =
                UUID.randomUUID()
                        + "_"
                        + originalFilename;

        Path targetDirectory =
                fileStorageLocation
                        .resolve(subdirectory);

        Files.createDirectories(
                targetDirectory
        );

        Path targetFile =
                targetDirectory
                        .resolve(uniqueFilename);

        if (!isValidFileType(originalFilename)) {

            throw new IOException(
                    "Invalid file type for: "
                            + originalFilename
            );
        }

        Files.copy(
                file.getInputStream(),
                targetFile,
                StandardCopyOption.REPLACE_EXISTING
        );

        return targetFile.toString();
    }

    // =========================================================
    // VALIDATE FILE TYPE
    // =========================================================

    private boolean isValidFileType(
            String filename) {

        if (filename == null) {
            return false;
        }

        String lowerFilename =
                filename.toLowerCase();

        return lowerFilename.endsWith(".pdf")
                || lowerFilename.endsWith(".doc")
                || lowerFilename.endsWith(".docx")
                || lowerFilename.endsWith(".jpg")
                || lowerFilename.endsWith(".jpeg")
                || lowerFilename.endsWith(".png");
    }
}