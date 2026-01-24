package com.app.dto;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import com.app.pojos.KycEntity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

public class KycRequest {
    private Long userId;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String gender;
    private String fatherName;
    private String motherName;
    private String maritalStatus;
    private String permanentStreet;
    private String permanentCity;
    private String permanentState;
    private String permanentZipCode;
    private String correspondenceStreet;
    private String correspondenceCity;
    private String correspondenceState;
    private String correspondenceZipCode;
    private String phone;
    private String email;
    private String panNumber;
    private String aadhaarNumber;
    private String passportNumber;
    private String voterIdNumber;
    private String drivingLicenseNumber;
    private Double annualIncome;
    private String sourceOfIncome;
    private String occupation;
    private String employerName;
    private String bankAccountNumber;
    private String ifscCode;
    private String accountType;

    private MultipartFile aadhaarCardImagePathFile;
    private MultipartFile utilityBillImagePathFile;
    private MultipartFile rentalAgreementImagePathFile;
    private MultipartFile passportImagePathFile;
    private MultipartFile panCardImageFile;

    public KycEntity toEntity() {
        KycEntity kyc = new KycEntity();
        kyc.setUserId(userId);
        kyc.setFirstName(firstName);
        kyc.setLastName(lastName);
        kyc.setDob(dob);
        kyc.setGender(gender);
        kyc.setFatherName(fatherName);
        kyc.setMotherName(motherName);
        kyc.setMaritalStatus(maritalStatus);
        kyc.setPermanentStreet(permanentStreet);
        kyc.setPermanentCity(permanentCity);
        kyc.setPermanentState(permanentState);
        kyc.setPermanentZipCode(permanentZipCode);
        kyc.setCorrespondenceStreet(correspondenceStreet);
        kyc.setCorrespondenceCity(correspondenceCity);
        kyc.setCorrespondenceState(correspondenceState);
        kyc.setCorrespondenceZipCode(correspondenceZipCode);
        kyc.setPhone(phone);
        kyc.setEmail(email);
        kyc.setPanNumber(panNumber);
        kyc.setAadhaarNumber(aadhaarNumber);
        kyc.setPassportNumber(passportNumber);
        kyc.setVoterIdNumber(voterIdNumber);
        kyc.setDrivingLicenseNumber(drivingLicenseNumber);
        kyc.setAnnualIncome(annualIncome);
        kyc.setSourceOfIncome(sourceOfIncome);
        kyc.setOccupation(occupation);
        kyc.setEmployerName(employerName);
        kyc.setBankAccountNumber(bankAccountNumber);
        kyc.setIfscCode(ifscCode);
        kyc.setAccountType(accountType);
        return kyc;
    }

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public LocalDate getDob() {
		return dob;
	}

	public void setDob(LocalDate dob) {
		this.dob = dob;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getFatherName() {
		return fatherName;
	}

	public void setFatherName(String fatherName) {
		this.fatherName = fatherName;
	}

	public String getMotherName() {
		return motherName;
	}

	public void setMotherName(String motherName) {
		this.motherName = motherName;
	}

	public String getMaritalStatus() {
		return maritalStatus;
	}

	public void setMaritalStatus(String maritalStatus) {
		this.maritalStatus = maritalStatus;
	}

	public String getPermanentStreet() {
		return permanentStreet;
	}

	public void setPermanentStreet(String permanentStreet) {
		this.permanentStreet = permanentStreet;
	}

	public String getPermanentCity() {
		return permanentCity;
	}

	public void setPermanentCity(String permanentCity) {
		this.permanentCity = permanentCity;
	}

	public String getPermanentState() {
		return permanentState;
	}

	public void setPermanentState(String permanentState) {
		this.permanentState = permanentState;
	}

	public String getPermanentZipCode() {
		return permanentZipCode;
	}

	public void setPermanentZipCode(String permanentZipCode) {
		this.permanentZipCode = permanentZipCode;
	}

	public String getCorrespondenceStreet() {
		return correspondenceStreet;
	}

	public void setCorrespondenceStreet(String correspondenceStreet) {
		this.correspondenceStreet = correspondenceStreet;
	}

	public String getCorrespondenceCity() {
		return correspondenceCity;
	}

	public void setCorrespondenceCity(String correspondenceCity) {
		this.correspondenceCity = correspondenceCity;
	}

	public String getCorrespondenceState() {
		return correspondenceState;
	}

	public void setCorrespondenceState(String correspondenceState) {
		this.correspondenceState = correspondenceState;
	}

	public String getCorrespondenceZipCode() {
		return correspondenceZipCode;
	}

	public void setCorrespondenceZipCode(String correspondenceZipCode) {
		this.correspondenceZipCode = correspondenceZipCode;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPanNumber() {
		return panNumber;
	}

	public void setPanNumber(String panNumber) {
		this.panNumber = panNumber;
	}

	public String getAadhaarNumber() {
		return aadhaarNumber;
	}

	public void setAadhaarNumber(String aadhaarNumber) {
		this.aadhaarNumber = aadhaarNumber;
	}

	public String getPassportNumber() {
		return passportNumber;
	}

	public void setPassportNumber(String passportNumber) {
		this.passportNumber = passportNumber;
	}

	public String getVoterIdNumber() {
		return voterIdNumber;
	}

	public void setVoterIdNumber(String voterIdNumber) {
		this.voterIdNumber = voterIdNumber;
	}

	public String getDrivingLicenseNumber() {
		return drivingLicenseNumber;
	}

	public void setDrivingLicenseNumber(String drivingLicenseNumber) {
		this.drivingLicenseNumber = drivingLicenseNumber;
	}

	public Double getAnnualIncome() {
		return annualIncome;
	}

	public void setAnnualIncome(Double annualIncome) {
		this.annualIncome = annualIncome;
	}

	public String getSourceOfIncome() {
		return sourceOfIncome;
	}

	public void setSourceOfIncome(String sourceOfIncome) {
		this.sourceOfIncome = sourceOfIncome;
	}

	public String getOccupation() {
		return occupation;
	}

	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}

	public String getEmployerName() {
		return employerName;
	}

	public void setEmployerName(String employerName) {
		this.employerName = employerName;
	}

	public String getBankAccountNumber() {
		return bankAccountNumber;
	}

	public void setBankAccountNumber(String bankAccountNumber) {
		this.bankAccountNumber = bankAccountNumber;
	}

	public String getIfscCode() {
		return ifscCode;
	}

	public void setIfscCode(String ifscCode) {
		this.ifscCode = ifscCode;
	}

	public String getAccountType() {
		return accountType;
	}

	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}

	public MultipartFile getAadhaarCardImagePathFile() {
		return aadhaarCardImagePathFile;
	}

	public void setAadhaarCardImagePathFile(MultipartFile aadhaarCardImagePathFile) {
		this.aadhaarCardImagePathFile = aadhaarCardImagePathFile;
	}

	public MultipartFile getUtilityBillImagePathFile() {
		return utilityBillImagePathFile;
	}

	public void setUtilityBillImagePathFile(MultipartFile utilityBillImagePathFile) {
		this.utilityBillImagePathFile = utilityBillImagePathFile;
	}

	public MultipartFile getRentalAgreementImagePathFile() {
		return rentalAgreementImagePathFile;
	}

	public void setRentalAgreementImagePathFile(MultipartFile rentalAgreementImagePathFile) {
		this.rentalAgreementImagePathFile = rentalAgreementImagePathFile;
	}

	public MultipartFile getPassportImagePathFile() {
		return passportImagePathFile;
	}

	public void setPassportImagePathFile(MultipartFile passportImagePathFile) {
		this.passportImagePathFile = passportImagePathFile;
	}

	public MultipartFile getPanCardImageFile() {
		return panCardImageFile;
	}

	public void setPanCardImageFile(MultipartFile panCardImageFile) {
		this.panCardImageFile = panCardImageFile;
	}
    
    
}

