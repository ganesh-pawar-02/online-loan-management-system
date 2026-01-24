package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.pojos.WalletEntity;

import java.util.Optional;

public interface WalletRepository extends JpaRepository<WalletEntity, Long> {
  Optional<WalletEntity> findByUserId(Long userId);
 
}
