package com.app.service;

import com.app.dto.ApiResponse;
import com.app.pojos.TransactionEntity;

import java.util.List;

import org.springframework.data.domain.Sort;

public interface TransactionHistoryService {
    List<TransactionEntity> getTransactionHistoryByUserId(Long userId);
    ApiResponse recordTransaction(TransactionEntity transactionHistory);
    

    public List<TransactionEntity> getEmiReceivedTransactions();
}
