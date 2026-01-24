package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.app.pojos.LoanApplication;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
  
	@Query("SELECT COUNT(u) FROM LoanApplication u")
    Long countLoanAppliedUsers();
}
