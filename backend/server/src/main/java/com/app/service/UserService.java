package com.app.service;

import com.app.dto.ApiResponse;
import com.app.dto.PasswordChangeRequest;
import com.app.dto.UserDTO;
import com.app.dto.UserProfileDTO;
import com.app.dto.UserProfileRequest;
import com.app.pojos.UserEntity;

public interface UserService {

    ApiResponse registerNewUser(UserDTO dto);

    ApiResponse updateUser(UserDTO dto);

    void changePassword(
            PasswordChangeRequest changePasswordRequest);

    UserEntity findById(Long userId);

    void resetPassword(
            String email,
            String newPassword);

    UserEntity findByEmail(String email);

    UserProfileDTO getProfile(Long userId);

    UserProfileDTO updateProfile(
            Long userId,
            UserProfileRequest request);

    byte[] getProfilePicture(Long userId);
}