package com.app.controller;

import com.app.dto.AddFundsRequest;
import com.app.dto.PayEmiRequest;
import com.app.dto.WithdrawFundsRequest;
import com.app.pojos.WalletEntity;
import com.app.security.JwtUtils;
import com.app.service.WalletService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wallet")
@CrossOrigin(origins = "http://65.2.80.0:3000") 
public class WalletController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private JwtUtils jwtUtil;

    @PostMapping("/add-funds")
    public ResponseEntity<String> addFunds(@RequestBody AddFundsRequest dto, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        Claims claims = jwtUtil.validateJwtToken(token);
        Long userId = jwtUtil.getUserIdFromJwtToken(claims);

        walletService.addFunds(userId, dto);
        return ResponseEntity.ok("Funds added successfully");
    }

    @PostMapping("/withdraw-funds")
    public ResponseEntity<String> withdrawFunds(@RequestBody WithdrawFundsRequest dto, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        Claims claims = jwtUtil.validateJwtToken(token);
        Long userId = jwtUtil.getUserIdFromJwtToken(claims);
        boolean success = walletService.withdrawFunds(userId, dto);
        if (success) {
            return ResponseEntity.ok("Funds withdrawn successfully");
        } else {
            return ResponseEntity.status(400).body("Insufficient funds");
        }
    }

    @PostMapping("/pay-emi")
    public ResponseEntity<Double> payEmi(@RequestBody PayEmiRequest payEmiRequest, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        Claims claims = jwtUtil.validateJwtToken(token);
        Long userId = jwtUtil.getUserIdFromJwtToken(claims);

        WalletEntity updatedWallet = walletService.payEmi(userId, payEmiRequest.getEmiAmount(), payEmiRequest.getLoanId());
        
        return ResponseEntity.ok(updatedWallet.getBalance());
    }

    @GetMapping("/balance")
    public ResponseEntity<Double> getBalance(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        Claims claims = jwtUtil.validateJwtToken(token);
        Long userId = jwtUtil.getUserIdFromJwtToken(claims);
        Double balance = walletService.getBalance(userId);
        return ResponseEntity.ok(balance);
    }
}
