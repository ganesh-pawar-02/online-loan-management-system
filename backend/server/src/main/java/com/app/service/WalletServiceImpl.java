package com.app.service;

import com.app.custom_exceptions.ApiException;
import com.app.dto.AddFundsRequest;
import com.app.dto.ApiResponse;
import com.app.dto.CreditFundsRequest;
import com.app.dto.LoanDetailsResp;
import com.app.dto.WithdrawFundsRequest;
import com.app.pojos.LoanEntity;
import com.app.pojos.TransactionEntity;
import com.app.pojos.TransactionStatus;
import com.app.pojos.UserEntity;
import com.app.pojos.UserRole;
import com.app.pojos.WalletEntity;
import com.app.repository.LoanRepository;
import com.app.repository.TransactionRepository;
import com.app.repository.UserRepository;
import com.app.repository.WalletRepository;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class WalletServiceImpl implements WalletService {

	@Autowired
	private WalletRepository walletRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TransactionRepository transactionRepository;

	@Autowired
	private LoanRepository loanRepository;

	@Override
	public void addFunds(Long userId, AddFundsRequest request) {
		WalletEntity wallet = walletRepository.findByUserId(userId)
				.orElseThrow(() -> new ApiException("Wallet not found for user ID " + userId));
		wallet.setBalance(wallet.getBalance() + request.getAmount());// Record transaction
		Double amount = request.getAmount();
		System.out.println(amount);
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		TransactionEntity transaction = new TransactionEntity(wallet, user, amount, "Deposit",
				TransactionStatus.COMPLETED);
		System.out.println(transaction);
		transactionRepository.save(transaction);

		walletRepository.save(wallet);
	}

	@Override

	public boolean withdrawFunds(Long userId, WithdrawFundsRequest request) {
		WalletEntity wallet = walletRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("Wallet not found"));
		Double amount = request.getAmount();
		if (wallet.getBalance().compareTo(amount) < 0) {
			// Record failed transaction
			UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
			TransactionEntity transaction = new TransactionEntity(wallet, user, amount, "Withdraw",
					TransactionStatus.FAILED);
			transactionRepository.save(transaction);
			return false;
		}
		wallet.setBalance(wallet.getBalance() - (amount));

		// Record transaction
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		TransactionEntity transaction = new TransactionEntity(wallet, user, amount, "Withdraw",
				TransactionStatus.COMPLETED);
		transactionRepository.save(transaction);

		walletRepository.save(wallet);
		return true;
	}

	public WalletEntity payEmi(Long userId, Double emiAmount, Long loanId) {
		// Fetch user's wallet by userId
		WalletEntity userWallet = walletRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("Wallet not found"));

		// Check if the user has sufficient balance to pay the EMI
		if (userWallet.getBalance().compareTo(emiAmount) < 0) {
			throw new RuntimeException("Insufficient balance");
		}

		// Find the loan by loanId
		LoanEntity loan = loanRepository.findById(loanId).orElseThrow(() -> new RuntimeException("Loan not found"));

		// Ensure that the loan belongs to the correct user
		if (!loan.getUser().getId().equals(userId)) {
			throw new RuntimeException("This loan does not belong to the specified user");
		}

		// Find the admin user (ROLE_ADMIN)
		UserEntity adminUser = userRepository.findByRole(UserRole.ROLE_ADMIN).stream().findFirst()
				.orElseThrow(() -> new RuntimeException("Admin not found"));

		// Fetch admin's wallet
		WalletEntity adminWallet = walletRepository.findByUserId(adminUser.getId())
				.orElseThrow(() -> new RuntimeException("Admin wallet not found"));

		// Deduct the EMI amount from the user's wallet
		userWallet.setBalance(userWallet.getBalance() - emiAmount);

		// Create debit transaction for the user
		TransactionEntity debitTransaction = new TransactionEntity(userWallet,
				userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")), emiAmount,
				"EMI Payment", TransactionStatus.COMPLETED);

		// Create credit transaction for the admin
		TransactionEntity creditTransaction = new TransactionEntity(adminWallet, adminUser, emiAmount, "EMI Received",
				TransactionStatus.COMPLETED);

		// Save both transactions to the transaction repository
		transactionRepository.save(debitTransaction);
		transactionRepository.save(creditTransaction);

		// Save updated wallets
		walletRepository.save(userWallet);
		walletRepository.save(adminWallet);

		// Update loan entity: Paid EMI and Remaining EMI
		loan.setPaidEmi(loan.getPaidEmi() + 1);
		loan.setRemainingEmi(loan.getRemainingEmi() - 1);
		loan.setEmiAmount(emiAmount); // Optional, ensure this is updated correctly if needed

		// Save the updated loan entity
		loanRepository.save(loan);

		return userWallet; // Return the updated user wallet after EMI payment
	}

	@Override
	public WalletEntity getWalletByUserId(Long userId) {
		return walletRepository.findByUserId(userId)
				.orElseThrow(() -> new ApiException("Wallet not found for user ID " + userId));
	}

	@Override
	public ApiResponse updateWallet(WalletEntity wallet) {
		WalletEntity updatedWallet = walletRepository.save(wallet);
		return new ApiResponse("Wallet updated with ID " + updatedWallet.getId());
	}

	@Override
	public Double getBalance(Long userId) {
		WalletEntity wallet = walletRepository.findByUserId(userId)
				.orElseThrow(() -> new ApiException("Wallet not found for user ID " + userId));
		return wallet.getBalance();
	}

	@Override
	public void creditFunds(Long userId, CreditFundsRequest request, Long adminId) {
		WalletEntity adminWallet = walletRepository.findByUserId(adminId)
				.orElseThrow(() -> new ApiException("Admin wallet not found for user ID " + adminId));

		// Check if admin wallet has sufficient balance
		if (adminWallet.getBalance() < request.getAmount()) {
			throw new RuntimeException("Insufficient balance in admin wallet");
		}

		WalletEntity userWallet = walletRepository.findByUserId(userId)
				.orElseThrow(() -> new ApiException("User wallet not found for user ID " + userId));

		// Deduct the amount from admin wallet
		adminWallet.setBalance(adminWallet.getBalance() - request.getAmount());

		// Credit the amount to user wallet
		userWallet.setBalance(userWallet.getBalance() + request.getAmount());

		// Record transactions
		UserEntity adminUser = userRepository.findById(adminId)
				.orElseThrow(() -> new RuntimeException("Admin not found"));
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		TransactionEntity debitTransaction = new TransactionEntity(adminWallet, adminUser, request.getAmount(),
				"Loan Transfer Out", TransactionStatus.COMPLETED);
		TransactionEntity creditTransaction = new TransactionEntity(userWallet, user, request.getAmount(),
				"Loan Transfer In", TransactionStatus.COMPLETED);

		transactionRepository.save(debitTransaction);
		transactionRepository.save(creditTransaction);
		walletRepository.save(adminWallet);
		walletRepository.save(userWallet);
	}

//	private LoanEntity convertToLoanEntity(LoanDetailsResp loanDetailsResp) {
//	    LoanEntity loanEntity = new LoanEntity();
//	    loanEntity.setId(loanDetailsResp.getId());
//	    loanEntity.setPaidEmi(loanDetailsResp.getPaidEMI());
//	    loanEntity.setRemainingEmi(loanDetailsResp.getRemainingEMI());
//	    loanEntity.setDuration(loanDetailsResp.getDuration());
//	    loanEntity.setEmiAmount(loanDetailsResp.getEmiAmount());
//	    // Set other necessary fields
//	    return loanEntity;
//	}

}
