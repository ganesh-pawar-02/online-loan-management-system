package com.app.service;

import com.app.dto.CreditFundsRequest;
import com.app.dto.LoanDetailsResp;
import com.app.dto.LoanSummaryResp;
import com.app.pojos.LoanEntity;
import com.app.pojos.LoanStatus;
import com.app.repository.LoanRepository;
import com.app.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class LoanServiceImpl implements LoanService {

	@Autowired
	private LoanRepository loanRepository;

	

    @Autowired
    private WalletService walletService;
    

    @Autowired
    private UserRepository userRepository;
	/**
     * Creates and saves a new loan record.
     * This method can be used to create a pending loan when a loan application is submitted.
     *
     * @param loanEntity the loan record to be created
     * @return the saved LoanEntity
     */
    @Override
    public LoanEntity createLoan(LoanEntity loanEntity) {
        return loanRepository.save(loanEntity);
    }
	
	
	public List<LoanSummaryResp> getLoanSummaryByUserId(Long userId) {
        // Fetch existing summaries from the repository
		List<Object[]> results = loanRepository.findLoanSummaryByUserId(userId);
		List<LoanSummaryResp> summaries = results.stream()
		    .map(obj -> new LoanSummaryResp((String) obj[0], ((Number) obj[1]).longValue(), ((Number) obj[2]).doubleValue()))
		    .collect(Collectors.toList());

        // Convert the list to a map for easy lookup
        Map<String, LoanSummaryResp> summaryMap = new HashMap<>();
        for (LoanSummaryResp summary : summaries) {
            summaryMap.put(summary.getStatus(), summary);
        }

        // Create a list to hold the final results
        List<LoanSummaryResp> finalSummaries = new ArrayList<>();

        // Loop through all possible statuses
        for (LoanStatus status : LoanStatus.values()) {
            LoanSummaryResp summary = summaryMap.get(status.name());
            if (summary == null) {
                // Create a new summary with zero count and zero totalAmount
                summary = new LoanSummaryResp(status, 0L, 0.0);
            }
            finalSummaries.add(summary);
        }

        return finalSummaries;
    }

	@Override
	public List<LoanDetailsResp> getLoansByUserId(Long userId) {
		return loanRepository.findLoanDetailsByUserId(userId);
	}
	
	
	
	
	//ADMIN SIDE
	public LoanDetailsResp updateLoanStatus(Long loanId, String action,Long adminId) {
        Optional<LoanEntity> optionalLoan = loanRepository.findById(loanId);
        if (optionalLoan.isPresent()) {
            LoanEntity loan = optionalLoan.get();
            if (action.equalsIgnoreCase("approve")) {
                loan.setStatus(LoanStatus.APPROVED);
                loan.setNextEmiDate(loan.getStartDate()); 
                loan.setEndDate(loan.getStartDate().plusMonths(loan.getDuration()));
             // Transfer the loan amount to the user's wallet and record the transaction
                CreditFundsRequest creditFundsRequest = new CreditFundsRequest(loan.getLoanAmount());
                walletService.creditFunds(loan.getUser().getId(), creditFundsRequest, adminId); 
            } else if (action.equalsIgnoreCase("reject")) {
                loan.setStatus(LoanStatus.REJECTED);
            } else {
                throw new IllegalArgumentException("Invalid action: " + action);
            }
            LoanEntity updatedLoan = loanRepository.save(loan);

            // Map the updated loan entity to the LoanDetailsResp DTO with only necessary fields
            LoanDetailsResp loanDetailsResp = new LoanDetailsResp();
            loanDetailsResp.setId(updatedLoan.getId());
            loanDetailsResp.setLoanAmount(updatedLoan.getLoanAmount());
            loanDetailsResp.setEmiAmount(updatedLoan.getEmiAmount());
            loanDetailsResp.setStartDate(updatedLoan.getStartDate());
            loanDetailsResp.setEndDate(updatedLoan.getEndDate());
            loanDetailsResp.setNextEMIDate(updatedLoan.getNextEmiDate());
            loanDetailsResp.setStatus(updatedLoan.getStatus().toString());

            return loanDetailsResp;
        } else {
            throw new RuntimeException("Loan not found");
        }
    }


	 // New method: Get all loans (for admin)
    @Override
    public List<LoanDetailsResp> getAllLoanDetails() {
        return loanRepository.findAllLoanDetails(Sort.by(Sort.Order.desc("id")));
    }

}
