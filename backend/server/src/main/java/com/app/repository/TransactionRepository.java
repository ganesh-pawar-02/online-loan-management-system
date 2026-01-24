package com.app.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import com.app.pojos.TransactionEntity;
import com.app.pojos.WalletEntity;

import java.util.List;

 
public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {
	List<TransactionEntity> findByUserId(Long userId, Sort sort);

	// Find transactions by user ID and transaction type
	List<TransactionEntity> findByType(String string,Sort sort);

 
}
