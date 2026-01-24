package com.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.dto.LoanDetailsResp;
import com.app.pojos.LoanEntity;

@Repository
public interface LoanRepository extends JpaRepository<LoanEntity, Long> {

	@Query(value = "SELECT l.status, COUNT(*) as count, SUM(l.loan_amount) as totalAmount "
			+ "FROM loans l WHERE l.user_id = :userId GROUP BY l.status", nativeQuery = true)
	List<Object[]> findLoanSummaryByUserId(@Param("userId") Long userId);

	
	
	// Fetch loan details by user ID
	@Query("SELECT new com.app.dto.LoanDetailsResp("
			+ "l.id, l.loanAmount, l.emiAmount, l.duration, l.startDate, l.endDate, "
			+ "l.totalEmi, l.paidEmi, l.remainingEmi, l.lastEmiDate, l.nextEmiDate, l.status) "
			+ "FROM LoanEntity l WHERE l.user.id = :userId")
	List<LoanDetailsResp> findLoanDetailsByUserId(@Param("userId") Long userId);


	  // New method: Fetch all loans (for admin)
  @Query("SELECT new com.app.dto.LoanDetailsResp(" +
         "l.id, l.loanAmount, l.emiAmount, l.duration, l.startDate, l.endDate, " +
         "l.totalEmi, l.paidEmi, l.remainingEmi, l.lastEmiDate, l.nextEmiDate, l.status,l.user.id) " +
         "FROM LoanEntity l")
  List<LoanDetailsResp> findAllLoanDetails(Sort sort);
	
	
	  LoanEntity getReferenceById(Long userId);

}
