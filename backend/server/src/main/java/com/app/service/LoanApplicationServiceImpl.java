package com.app.service;

import com.app.pojos.LoanApplication;
import com.app.pojos.LoanEntity;
import com.app.pojos.LoanStatus;
import com.app.repository.LoanApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LoanApplicationServiceImpl implements LoanApplicationService {

    @Autowired
    private LoanApplicationRepository loanApplicationRepository;
    // Inject the LoanService to create a corresponding loan record.
    @Autowired
    private LoanService loanService;
    
    
    @Override
    public LoanApplication submitLoanApplication(LoanApplication loanApplication) {
        // Additional validation or business logic can be added here
    	LoanApplication savedApplication = loanApplicationRepository.save(loanApplication);
    	// Create a corresponding Loan record in a pending state.
    	createLoanRecordFromApplication(savedApplication);
        return savedApplication;
    }

    @Override
    public List<LoanApplication> getAllLoanApplications() {
        return loanApplicationRepository.findAll();
    }

    
    
    
    
    /**
     * Helper method to map the fields from the LoanApplication to a new LoanEntity.
     * It calculates EMI-related fields, initializes defaults, and sets the status to PENDING.
     *
     * @param application the saved loan application
     */
    private void createLoanRecordFromApplication(LoanApplication application) {
        LoanEntity loan = new LoanEntity();

        // Map fields from the application
        loan.setLoanAmount(application.getLoanAmount());
        loan.setDuration(application.getLoanPeriod()); // Map loan_period to duration

        // Fixed interest rate
        double interestRate = 0.12; // 12%

        // Calculate EMI amount
        double loanAmount = application.getLoanAmount();
        int loanPeriodMonths = application.getLoanPeriod();
        double monthlyInterestRate = interestRate / 12;
        double emiAmount = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanPeriodMonths)) /
                           (Math.pow(1 + monthlyInterestRate, loanPeriodMonths) - 1);
        loan.setEmiAmount(emiAmount);

        // Calculate total EMIs
        int totalEmis = loanPeriodMonths;
        loan.setTotalEmi(totalEmis);

        // Set paid and remaining EMIs
        loan.setPaidEmi(0);
        loan.setRemainingEmi(totalEmis);

        // Initialize status to PENDING
        loan.setStatus(LoanStatus.PENDING);

        // Set the associated user
        loan.setUser(application.getUser());

        // Set start_date as today and calculate end_date
        LocalDate startDate = LocalDate.now(); // Use current date
        loan.setStartDate(startDate);

        LocalDate endDate = startDate.plusMonths(loanPeriodMonths); // Add loan period in months
        loan.setEndDate(endDate);

        // Initialize other date fields as null or appropriate values
        loan.setLastEmiDate(null);
        loan.setNextEmiDate(null);

        // Save the loan record
        loanService.createLoan(loan);
    }

    @Override
    public LoanApplication getLoanApplicationById(Long id) {
        return loanApplicationRepository.findById(id).orElse(null);
    }

	@Override
	public Long countLoanAppliedUsers() {
		return  loanApplicationRepository.countLoanAppliedUsers();
	}
}
