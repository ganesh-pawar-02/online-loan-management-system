package com.app.dto;

import com.app.pojos.LoanStatus;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//@Getter
//@Setter

@NoArgsConstructor
public class LoanSummaryResp {
	private String status;
	private Long count;
	private Double totalAmount;
	public LoanSummaryResp(LoanStatus status, Long count, Double totalAmount) {
	    this.status = status.name(); // Convert enum to String if needed
	    this.count = count;
	    this.totalAmount = totalAmount;
	}
	public LoanSummaryResp(String status, Long count, Double totalAmount) {
	    this.status = status; // Convert enum to String if needed
	    this.count = count;
	    this.totalAmount = totalAmount;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Long getCount() {
		return count;
	}
	public void setCount(Long count) {
		this.count = count;
	}
	public Double getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}
}
