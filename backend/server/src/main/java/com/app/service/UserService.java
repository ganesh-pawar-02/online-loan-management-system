package com.app.service;

import com.app.dto.ApiResponse;
import com.app.dto.PasswordChangeRequest;
import com.app.dto.UserDTO;
import com.app.pojos.UserEntity;

public interface UserService {
    ApiResponse registerNewUser(UserDTO dto);
    ApiResponse updateUser(UserDTO dto);
    public void changePassword(PasswordChangeRequest changePasswordRequest);
	UserEntity findById(Long userId);
    
}
