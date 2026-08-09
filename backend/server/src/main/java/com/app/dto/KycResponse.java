package com.app.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class KycResponse {

    private Long id;

    // Personal Information
    private LocalDate dob;
    private String gender;
    private String fatherName;
    private String motherName;
    private String maritalStatus;

    // Permanent Address
    private String permanentStreet;
    private String permanentCity;
    private String permanentState;
    private String permanentZipCode;

    // Correspondence Address
    private String correspondenceStreet;
    private String correspondenceCity;
    private String correspondenceState;
    private String correspondenceZipCode;

    // Identity Information
    private String panNumber;
    private String aadhaarNumber;
    private String passportNumber;
    private String voterIdNumber;
    private String drivingLicenseNumber;

    // Financial Information
    private Double annualIncome;
    private String sourceOfIncome;
    private String occupation;
    private String employerName;

    // Banking Information
    private String bankName;
    private String bankAccountNumber;
    private String ifscCode;
    private String accountType;

    // Document paths
    private String aadhaarCardImagePath;
    private String utilityBillImagePath;
    private String rentalAgreementImagePath;
    private String passportImagePath;
    private String panCardImagePath;

    // KYC Status
    private String kycStatus;
}