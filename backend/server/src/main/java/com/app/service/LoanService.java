package com.app.service;

import java.util.List;
import com.app.dto.LoanDetailsResp;
import com.app.dto.LoanSummaryResp;
import com.app.pojos.LoanEntity;

public interface LoanService {

	public List<LoanSummaryResp> getLoanSummaryByUserId(Long userId);
	public List<LoanDetailsResp> getLoansByUserId(Long userId);
	public LoanEntity createLoan(LoanEntity loanEntity);
//    List<Loan> getLoansByUserId(Long userId);
	
	
// ADMIN SIDE

	public LoanDetailsResp updateLoanStatus(Long loanId, String action,Long adminId) ;
	public List<LoanDetailsResp> getAllLoanDetails();
}