package com.app.service;

import com.app.pojos.LoanApplication;
import java.util.List;

public interface LoanApplicationService {
    LoanApplication submitLoanApplication(LoanApplication loanApplication);
    List<LoanApplication> getAllLoanApplications();
    LoanApplication getLoanApplicationById(Long id);
	Long countLoanAppliedUsers();
}
