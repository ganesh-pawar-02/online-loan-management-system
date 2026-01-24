package com.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Store OTPs temporarily, could be done in database or in-memory store like Redis.
    private Map<String, String> otpStore = new HashMap<>();

    /**
     * Generate and send OTP to the provided email.
     * 
     * @param email the email to send the OTP
     * @return boolean indicating success or failure
     */
    public boolean generateOtp(String email) {
        // Generate a 6-digit OTP
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        
        // Save OTP in memory for verification later
        otpStore.put(email, otp);
        
        // Send the OTP to the user's email
        sendOtpEmail(email, otp);
        return true;
    }

    /**
     * Send OTP email to the user.
     * 
     * @param toEmail the recipient email address
     * @param otp     the OTP to be sent
     */
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP for login verification is: " + otp);
        mailSender.send(message);
    }

    /**
     * Verify the OTP provided by the user.
     * 
     * @param email the user's email
     * @param otp   the OTP provided by the user
     * @return boolean indicating if the OTP is valid
     */
    public boolean verifyOtp(String email, String otp) {
        // Check if OTP matches the one stored in the map
        String storedOtp = otpStore.get(email);
        
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStore.remove(email);  // Remove OTP after verification
            return true;
        }
        return false;
    }
}
