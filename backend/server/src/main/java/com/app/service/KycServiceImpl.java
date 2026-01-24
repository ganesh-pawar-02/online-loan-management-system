package com.app.service;

import com.app.dto.ApiResponse;
import com.app.dto.KycDetailsUpdateRequest;
import com.app.dto.KycRequest;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class KycServiceImpl implements KycService {

    @Autowired
    private KycRepository kycRepository;

    @Value("${file.upload.directory}")
    private String uploadDirectory;
    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDirectory).toAbsolutePath().normalize();
        try {
            Files.createDirectories(fileStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create directory for file storage at: " + fileStorageLocation, e);
        }
    }

    @Override
    public KycEntity getKycRecordsByUserId(Long userId) {
        return kycRepository.findByUserId(userId);
    }

    @Override
    public ApiResponse createKycRecord(KycRequest kycRequest) {
        try {
            // Manual Mapping from KycRequest to KycEntity
            KycEntity kyc = new KycEntity();
            kyc.setUserId(kycRequest.getUserId());
            kyc.setFirstName(kycRequest.getFirstName());
            kyc.setLastName(kycRequest.getLastName());
            kyc.setEmail(kycRequest.getEmail());
            kyc.setPhone(kycRequest.getPhone());
            kyc.setGender(kycRequest.getGender());
            kyc.setCorrespondenceCity(kycRequest.getCorrespondenceCity());
            kyc.setCorrespondenceState(kycRequest.getCorrespondenceState());
            kyc.setCorrespondenceZipCode(kycRequest.getCorrespondenceZipCode());
            kyc.setPanNumber(kycRequest.getPanNumber());
            kyc.setAadhaarNumber(kycRequest.getAadhaarNumber());
            kyc.setPassportNumber(kycRequest.getPassportNumber());
            kyc.setVoterIdNumber(kycRequest.getVoterIdNumber());
            kyc.setDrivingLicenseNumber(kycRequest.getDrivingLicenseNumber());
            kyc.setAnnualIncome(kycRequest.getAnnualIncome());
            kyc.setSourceOfIncome(kycRequest.getSourceOfIncome());
            kyc.setOccupation(kycRequest.getOccupation());
            kyc.setEmployerName(kycRequest.getEmployerName());
            kyc.setBankAccountNumber(kycRequest.getBankAccountNumber());
            kyc.setIfscCode(kycRequest.getIfscCode());
            kyc.setAccountType(kycRequest.getAccountType());

            // Convert Date to LocalDate
            kyc.setDob(kycRequest.getDob()) ;
            

            // File Upload Handling
            if (kycRequest.getAadhaarCardImagePathFile() != null && !kycRequest.getAadhaarCardImagePathFile().isEmpty()) {
                kyc.setAadhaarCardImagePath(saveFileAndGetPath(kycRequest.getAadhaarCardImagePathFile(), "aadhaar-cards"));
            }
            if (kycRequest.getUtilityBillImagePathFile() != null && !kycRequest.getUtilityBillImagePathFile().isEmpty()) {
                kyc.setUtilityBillImagePath(saveFileAndGetPath(kycRequest.getUtilityBillImagePathFile(), "utility-bills"));
            }
            if (kycRequest.getRentalAgreementImagePathFile() != null && !kycRequest.getRentalAgreementImagePathFile().isEmpty()) {
                kyc.setRentalAgreementImagePath(saveFileAndGetPath(kycRequest.getRentalAgreementImagePathFile(), "rental-agreements"));
            }
            if (kycRequest.getPassportImagePathFile() != null && !kycRequest.getPassportImagePathFile().isEmpty()) {
                kyc.setPassportImagePath(saveFileAndGetPath(kycRequest.getPassportImagePathFile(), "passports"));
            }
            if (kycRequest.getPanCardImageFile() != null && !kycRequest.getPanCardImageFile().isEmpty()) {
                kyc.setPanCardImagePath(saveFileAndGetPath(kycRequest.getPanCardImageFile(), "pan-cards"));
            }

            kycRepository.save(kyc);
            return new ApiResponse("KYC record created successfully");

        } catch (IOException e) {
            return new ApiResponse("Failed to create KYC record due to file saving error: " + e.getMessage());
        }
    }

    private String saveFileAndGetPath(MultipartFile file, String subdirectory) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;
        Path targetDirectory = fileStorageLocation.resolve(subdirectory);
        Files.createDirectories(targetDirectory);
        Path targetFile = targetDirectory.resolve(uniqueFilename);

        if (!isValidFileType(originalFilename)) {
            throw new IOException("Invalid file type for: " + originalFilename);
        }

        Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);

        return targetFile.toString();
    }

    private boolean isValidFileType(String filename) {
        String lowerFilename = filename.toLowerCase();
        return lowerFilename.endsWith(".pdf") || lowerFilename.endsWith(".doc") || lowerFilename.endsWith(".docx") ||
               lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg") || lowerFilename.endsWith(".png");
    }

    @Override
    public KycEntity updateKycDetails(Long id, KycDetailsUpdateRequest request) {
        Optional<KycEntity> optionalKycDetails = kycRepository.findById(id);
        if (optionalKycDetails.isPresent()) {
            KycEntity kycDetails = optionalKycDetails.get();
            kycDetails.setFirstName(request.getFirstName());
            kycDetails.setLastName(request.getLastName());
            kycDetails.setEmail(request.getEmail());
            kycDetails.setPhone(request.getPhone());
            kycDetails.setGender(request.getGender());
            kycDetails.setCorrespondenceCity(request.getCorrespondenceCity());
            kycDetails.setCorrespondenceState(request.getCorrespondenceState());
            kycDetails.setCorrespondenceZipCode(request.getCorrespondenceZipCode());

            Date dateOfBirth = request.getDateOfBirth();
            if (dateOfBirth != null) {
                LocalDate dob = dateOfBirth.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                kycDetails.setDob(dob);
            }

            return kycRepository.save(kycDetails);
        } else {
            throw new RuntimeException("KYC Details not found with ID: " + id);
        }
    }

    @Override
    public Long countKycUsers() {
        return kycRepository.countKycUsers();
    }
}
