package com.app.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dto.ApiResponse;
import com.app.dto.PasswordChangeRequest;
import com.app.dto.UserDTO;
import com.app.pojos.UserEntity;
import com.app.pojos.WalletEntity;
import com.app.repository.UserRepository;
import com.app.repository.WalletRepository;

@Service
@Transactional
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private WalletRepository walletRepository;
	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private PasswordEncoder passwordEncoder;

	// Inject WalletService if you use it; otherwise, create wallet directly.
	// @Autowired
	// private WalletService walletService;

	@Override
	public ApiResponse registerNewUser(UserDTO dto) {
		// Basic duplicate checks
		if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
			throw new IllegalStateException("Email already exists");
		}
		if (userRepository.findByPhone(dto.getPhone()).isPresent()) {
			throw new IllegalStateException("Phone already exists");
		}

		// Map DTO to entity
		UserEntity userEntity = modelMapper.map(dto, UserEntity.class);
		userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));

		// Save the user entity first
		UserEntity savedUser = userRepository.save(userEntity);

		// Create a new WalletEntity for the user with initial balance 0
		WalletEntity wallet = new WalletEntity();
		wallet.setBalance(0.0);

		// Associate wallet with user
		wallet.setUser(savedUser);
		savedUser.setWallet(wallet);

		// Save wallet
		walletRepository.save(wallet);

		// Return response
		return new ApiResponse("User registered with ID " + savedUser.getId());
	}

	@Override
	public ApiResponse updateUser(UserDTO dto) {
		UserEntity existingUser = userRepository.findByEmail(dto.getEmail())
				.orElseThrow(() -> new IllegalStateException("User not found"));

		modelMapper.map(dto, existingUser);
		if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
			existingUser.setPassword(passwordEncoder.encode(dto.getPassword()));
		}

		UserEntity updatedUser = userRepository.save(existingUser);
		return new ApiResponse("User updated with ID " + updatedUser.getId());
	}

	@Override

	public void changePassword(PasswordChangeRequest changePasswordRequest) {
        UserEntity user = userRepository.findByEmail(changePasswordRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (changePasswordRequest.getNewPassword().equals(changePasswordRequest.getCurrentPassword())) {
            throw new RuntimeException("New password cannot be the same as the current password");
        }

        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);
    }

	@Override
	public UserEntity findById(Long userId) {
		return userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
	}

	 

}
