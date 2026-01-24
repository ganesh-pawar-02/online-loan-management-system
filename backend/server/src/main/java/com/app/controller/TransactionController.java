package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.pojos.TransactionEntity;
import com.app.security.JwtUtils;
import com.app.service.TransactionHistoryService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://65.2.80.0:3000")
public class TransactionController {

    @Autowired
    private TransactionHistoryService transactionService;

    @Autowired
    private JwtUtils jwtUtil;

    @GetMapping
    public List<TransactionEntity> getTransactionsByUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        Claims claims = jwtUtil.validateJwtToken(token);
        Long userId = jwtUtil.getUserIdFromJwtToken(claims);

        return transactionService.getTransactionHistoryByUserId(userId);
    }

    @GetMapping("/emi-received")
    public ResponseEntity<List<TransactionEntity>> getEmiReceivedTransactions(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        Claims claims = jwtUtil.validateJwtToken(token);
        Long userId = jwtUtil.getUserIdFromJwtToken(claims);

        List<TransactionEntity> emiReceivedTransactions = transactionService.getEmiReceivedTransactions();

        return ResponseEntity.ok(emiReceivedTransactions);
    }
}
