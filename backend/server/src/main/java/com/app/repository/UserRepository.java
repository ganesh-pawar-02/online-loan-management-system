package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.pojos.UserEntity;
import com.app.pojos.UserRole;
import com.app.pojos.WalletEntity;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
  Optional<UserEntity> findByEmail(String email);
  Optional<UserEntity> findByPhone(String phone);
Optional<UserEntity> findByRole(UserRole roleAdmin);
}
