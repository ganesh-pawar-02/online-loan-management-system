package com.app.pojos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "users")
@NoArgsConstructor
@ToString(callSuper = true, exclude = {"password", "wallet", "kyc"})
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    // =========================
    // User Profile Information
    // =========================

    @Column(name = "first_name", length = 20)
    private String firstName;

    @Column(name = "last_name", length = 20)
    private String lastName;

    @Column(length = 100, unique = true)
    private String email;

    @Column(length = 500, nullable = false)
    private String password;

    @Column(length = 15, nullable = false, name = "phone_number")
    private String phone;

    @Column(name = "profile_picture_path")
    private String profilePicturePath;

    // =========================
    // Wallet
    // =========================

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "wallet_id")
    private WalletEntity wallet;

    // =========================
    // KYC
    // =========================

    @OneToOne(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private KycEntity kyc;

    // =========================
    // Role
    // =========================

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private UserRole role;

    @PrePersist
    private void setDefaultRole() {
        if (role == null) {
            role = UserRole.ROLE_USER;
        }
    }

    // =========================
    // Getters / Setters
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public WalletEntity getWallet() {
        return wallet;
    }

    public void setWallet(WalletEntity wallet) {
        this.wallet = wallet;
    }

    public KycEntity getKyc() {
        return kyc;
    }

    public void setKyc(KycEntity kyc) {
        this.kyc = kyc;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getProfilePicturePath() {
        return profilePicturePath;
    }

    public void setProfilePicturePath(String profilePicturePath) {
        this.profilePicturePath = profilePicturePath;
    }
}