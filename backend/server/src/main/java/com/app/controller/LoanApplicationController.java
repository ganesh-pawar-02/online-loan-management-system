package com.app.controller;

import com.app.dto.LoanApplicationRequest;
import com.app.pojos.LoanApplication;
import com.app.pojos.UserEntity;
import com.app.security.JwtUtils;
import com.app.mapper.LoanApplicationMapper;
import com.app.service.LoanApplicationService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/loan-applications")
@CrossOrigin(origins = "http://65.2.80.0:3000")
public class LoanApplicationController {

    @Autowired
    private LoanApplicationService loanApplicationService;
    
    @Autowired
    private JwtUtils jwtUtil;

    @PostMapping("/apply")
    public ResponseEntity<String> submitLoanApplication(@RequestBody LoanApplicationRequest loanApplicationDTO, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);
        System.out.println("in apply ctrlor");
        Claims claims = jwtUtil.validateJwtToken(token);
        if (claims == null) {
            return ResponseEntity.status(401).body("Failure: Unauthorized");
        }
        Long userId = jwtUtil.getUserIdFromJwtToken(claims);
        String userRole = jwtUtil.getUserRoleFromClaims(claims);

        LoanApplication loanApplication = LoanApplicationMapper.INSTANCE.toEntity(loanApplicationDTO);
        UserEntity user = new UserEntity();
        user.setId(userId);
        loanApplication.setUser(user);

        LoanApplication savedApplication = loanApplicationService.submitLoanApplication(loanApplication);
        if (savedApplication != null) {
            return ResponseEntity.ok("Success: Loan application submitted");
        } else {
            return ResponseEntity.status(500).body("Failure: Loan application submission failed");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<LoanApplication>> getAllLoanApplications(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        Claims claims = jwtUtil.validateJwtToken(token);
        if (claims == null) {
            return ResponseEntity.status(401).build();
        }
        String userRole = jwtUtil.getUserRoleFromClaims(claims);

        List<LoanApplication> loanApplications = loanApplicationService.getAllLoanApplications();
        return ResponseEntity.ok(loanApplications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanApplication> getLoanApplicationById(@PathVariable Long id, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        Claims claims = jwtUtil.validateJwtToken(token);
        if (claims == null) {
            return ResponseEntity.status(401).build();
        }
        Long userId = jwtUtil.getUserIdFromJwtToken(claims);

        LoanApplication loanApplication = loanApplicationService.getLoanApplicationById(id);
        return ResponseEntity.ok(loanApplication);
    }

    @GetMapping("/Loancount")
    public Long getLoanAppliedUsersCount() {
        return loanApplicationService.countLoanAppliedUsers();
    }
}
