package com.app.service;

import com.app.dto.AddFundsRequest;
import com.app.dto.ApiResponse;
import com.app.dto.CreditFundsRequest;
import com.app.dto.WithdrawFundsRequest;
import com.app.pojos.WalletEntity;

public interface WalletService {
    WalletEntity getWalletByUserId(Long userId);
    ApiResponse updateWallet(WalletEntity wallet);
    void addFunds(Long userId, AddFundsRequest request);
    boolean withdrawFunds(Long userId, WithdrawFundsRequest request);

	public WalletEntity payEmi(Long userId, Double emiAmount, Long loanId);
	 public Double getBalance(Long userId);
	 
	 void creditFunds(Long userId, CreditFundsRequest request,Long adminId);
}
