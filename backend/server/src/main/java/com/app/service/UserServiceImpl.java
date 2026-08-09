package com.app.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.app.dto.ApiResponse;
import com.app.dto.PasswordChangeRequest;
import com.app.dto.UserDTO;
import com.app.dto.UserProfileDTO;
import com.app.dto.UserProfileRequest;
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

    @Value("${file.upload.directory}")
    private String uploadDirectory;

    // =========================================================
    // REGISTER
    // =========================================================

    @Override
    public ApiResponse registerNewUser(UserDTO dto) {

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalStateException(
                    "Email already exists");
        }

        if (userRepository.findByPhone(dto.getPhone()).isPresent()) {
            throw new IllegalStateException(
                    "Phone already exists");
        }

        UserEntity userEntity =
                modelMapper.map(dto, UserEntity.class);

        userEntity.setPassword(
                passwordEncoder.encode(
                        userEntity.getPassword()));

        UserEntity savedUser =
                userRepository.save(userEntity);

        WalletEntity wallet =
                new WalletEntity();

        wallet.setBalance(0.0);

        wallet.setUser(savedUser);

        savedUser.setWallet(wallet);

        walletRepository.save(wallet);

        return new ApiResponse(
                "User registered with ID "
                        + savedUser.getId());
    }

    // =========================================================
    // OLD UPDATE USER
    // =========================================================

    @Override
    public ApiResponse updateUser(UserDTO dto) {

        UserEntity existingUser =
                userRepository.findByEmail(dto.getEmail())
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "User not found"));

        modelMapper.map(dto, existingUser);

        if (dto.getPassword() != null &&
                !dto.getPassword().isEmpty()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            dto.getPassword()));
        }

        UserEntity updatedUser =
                userRepository.save(existingUser);

        return new ApiResponse(
                "User updated with ID "
                        + updatedUser.getId());
    }

    // =========================================================
    // GET USER PROFILE
    // =========================================================

    @Override
    public UserProfileDTO getProfile(Long userId) {

        UserEntity user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        UserProfileDTO response =
                new UserProfileDTO();

        response.setFirstName(
                user.getFirstName());

        response.setLastName(
                user.getLastName());

        response.setEmail(
                user.getEmail());

        response.setPhone(
                user.getPhone());

        response.setProfilePicturePath(
                user.getProfilePicturePath());

        return response;
    }

    // =========================================================
    // UPDATE USER PROFILE
    // NAME + PHONE + PROFILE PICTURE
    // =========================================================

    @Override
    public UserProfileDTO updateProfile(
            Long userId,
            UserProfileRequest request) {

        UserEntity user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        // -----------------------------------------
        // Update profile information
        // -----------------------------------------

        user.setFirstName(
                request.getFirstName());

        user.setLastName(
                request.getLastName());

        user.setPhone(
                request.getPhone());

        // -----------------------------------------
        // Update profile picture if provided
        // -----------------------------------------

        MultipartFile profilePicture =
                request.getProfilePicture();

        if (profilePicture != null &&
                !profilePicture.isEmpty()) {

            String newPath =
                    saveProfilePicture(
                            profilePicture,
                            user.getProfilePicturePath());

            user.setProfilePicturePath(
                    newPath);
        }

        UserEntity savedUser =
                userRepository.save(user);

        return convertToProfileDTO(savedUser);
    }

    // =========================================================
    // GET PROFILE PICTURE
    // =========================================================

    @Override
    public byte[] getProfilePicture(Long userId) {

        UserEntity user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        String imagePath =
                user.getProfilePicturePath();

        if (imagePath == null ||
                imagePath.isBlank()) {

            throw new RuntimeException(
                    "Profile picture not found");
        }

        try {

            Path path =
                    Paths.get(imagePath);

            if (!Files.exists(path)) {

                throw new RuntimeException(
                        "Profile picture file not found");
            }

            return Files.readAllBytes(path);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Unable to read profile picture",
                    e);
        }
    }

    // =========================================================
    // SAVE PROFILE PICTURE
    // =========================================================

    private String saveProfilePicture(
            MultipartFile profilePicture,
            String oldImagePath) {

        // Validate content type

        String contentType =
                profilePicture.getContentType();

        if (contentType == null ||
                !contentType.startsWith("image/")) {

            throw new IllegalArgumentException(
                    "Only image files are allowed");
        }

        // Max 5 MB

        if (profilePicture.getSize()
                > 5 * 1024 * 1024) {

            throw new IllegalArgumentException(
                    "Profile picture must be less than 5 MB");
        }

        try {

            Path profileDirectory =
                    Paths.get(uploadDirectory)
                            .toAbsolutePath()
                            .normalize()
                            .resolve("profile-pictures");

            Files.createDirectories(
                    profileDirectory);

            // -----------------------------------------
            // Delete old picture
            // -----------------------------------------

            if (oldImagePath != null &&
                    !oldImagePath.isBlank()) {

                Path oldImage =
                        Paths.get(oldImagePath);

                Files.deleteIfExists(
                        oldImage);
            }

            // -----------------------------------------
            // Generate unique filename
            // -----------------------------------------

            String originalFilename =
                    profilePicture.getOriginalFilename();

            String extension = "";

            if (originalFilename != null &&
                    originalFilename.contains(".")) {

                extension =
                        originalFilename.substring(
                                originalFilename
                                        .lastIndexOf("."));
            }

            String filename =
                    UUID.randomUUID()
                            + extension;

            Path targetPath =
                    profileDirectory.resolve(
                            filename);

            // -----------------------------------------
            // Save file
            // -----------------------------------------

            Files.copy(
                    profilePicture.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING);

            return targetPath.toString();

        } catch (IOException e) {

            throw new RuntimeException(
                    "Unable to save profile picture",
                    e);
        }
    }

    // =========================================================
    // PROFILE DTO MAPPER
    // =========================================================

    private UserProfileDTO convertToProfileDTO(
            UserEntity user) {

        UserProfileDTO dto =
                new UserProfileDTO();

        dto.setFirstName(
                user.getFirstName());

        dto.setLastName(
                user.getLastName());

        dto.setEmail(
                user.getEmail());

        dto.setPhone(
                user.getPhone());

        dto.setProfilePicturePath(
                user.getProfilePicturePath());

        return dto;
    }

    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    @Override
    public void changePassword(
            PasswordChangeRequest changePasswordRequest) {

        UserEntity user =
                userRepository.findByEmail(
                                changePasswordRequest.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        if (!passwordEncoder.matches(
                changePasswordRequest
                        .getCurrentPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Current password is incorrect");
        }

        if (changePasswordRequest
                .getNewPassword()
                .equals(
                        changePasswordRequest
                                .getCurrentPassword())) {

            throw new RuntimeException(
                    "New password cannot be the same as the current password");
        }

        user.setPassword(
                passwordEncoder.encode(
                        changePasswordRequest
                                .getNewPassword()));

        userRepository.save(user);
    }

    // =========================================================
    // FIND BY ID
    // =========================================================

    @Override
    public UserEntity findById(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with ID: "
                                        + userId));
    }

    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @Override
    public void resetPassword(
            String email,
            String newPassword) {

        UserEntity user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        user.setPassword(
                passwordEncoder.encode(
                        newPassword));

        userRepository.save(user);
    }

    // =========================================================
    // FIND BY EMAIL
    // =========================================================

    @Override
    public UserEntity findByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));
    }
}