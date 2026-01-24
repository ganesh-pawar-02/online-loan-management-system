package com.app.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Date;

//@Getter
//@Setter
public class KycDetailsUpdateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String gender;
    private String correspondenceCity;
    private String correspondenceState;
    private String correspondenceZipCode;
    private Date dateOfBirth;
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
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
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
	public Date getDateOfBirth() {
		return dateOfBirth;
	}
	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
}
