package com.app.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Service
public class OtpService {

    private final Map<String, String> otpStorage = new HashMap<>();
    private final Map<String, Long> otpExpiryStorage = new HashMap<>();

    private final Map<String, String> resetTokenStorage = new HashMap<>();
    private final Map<String, Long> resetTokenExpiryStorage = new HashMap<>();

    private final Random random = new Random();

    // OTP and reset token validity: 5 minutes
    private static final long EXPIRY_TIME = 5 * 60 * 1000;

    // =========================
    // OTP
    // =========================

    public String generateOtp(String email) {

        String otp = String.format(
                "%06d",
                random.nextInt(1000000)
        );

        otpStorage.put(email, otp);

        otpExpiryStorage.put(
                email,
                System.currentTimeMillis() + EXPIRY_TIME
        );

        return otp;
    }

    public boolean validateOtp(String email, String otp) {

        String storedOtp = otpStorage.get(email);
        Long expiryTime = otpExpiryStorage.get(email);

        if (storedOtp == null || expiryTime == null) {
            return false;
        }

        // OTP expired
        if (System.currentTimeMillis() > expiryTime) {
            removeOtp(email);
            return false;
        }

        return storedOtp.equals(otp);
    }

    public void removeOtp(String email) {

        otpStorage.remove(email);
        otpExpiryStorage.remove(email);
    }

    // =========================
    // Password Reset Token
    // =========================

    public String generateResetToken(String email) {

        String token = UUID.randomUUID().toString();

        resetTokenStorage.put(email, token);

        resetTokenExpiryStorage.put(
                email,
                System.currentTimeMillis() + EXPIRY_TIME
        );

        return token;
    }

    public boolean validateResetToken(
            String email,
            String token
    ) {

        String storedToken = resetTokenStorage.get(email);
        Long expiryTime = resetTokenExpiryStorage.get(email);

        if (storedToken == null || expiryTime == null) {
            return false;
        }

        // Token expired
        if (System.currentTimeMillis() > expiryTime) {
            removeResetToken(email);
            return false;
        }

        return storedToken.equals(token);
    }

    public void removeResetToken(String email) {

        resetTokenStorage.remove(email);
        resetTokenExpiryStorage.remove(email);
    }
}