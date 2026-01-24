package com.app.dto;

import java.time.LocalDate;

import com.app.pojos.LoanStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//@Getter
//@Setter
//@NoArgsConstructor
@AllArgsConstructor
public class LoanDetailsResp {

	 private Long id;
	    private Double loanAmount;
	    private Double emiAmount;
	    private Integer duration;
	    private LocalDate startDate;
	    private LocalDate endDate;
	    private Integer totalEMI;
	    private Integer paidEMI;
	    private Integer remainingEMI;
	    private LocalDate lastEMIDate;
	    private LocalDate nextEMIDate;
	    private String status;
	   private Long userId;
	   
	   public LoanDetailsResp() {
		
	   }
	    
	    // Constructor matching the query
	    public LoanDetailsResp(Long id, Double loanAmount, Double emiAmount, Integer duration,
	                           LocalDate startDate, LocalDate endDate, Integer totalEmi,
	                           Integer paidEmi, Integer remainingEmi, LocalDate lastEmiDate,
	                           LocalDate nextEmiDate, LoanStatus status) {
	        this.id = id;
	        this.loanAmount = loanAmount;
	        this.emiAmount = emiAmount;
	        this.duration = duration;
	        this.startDate = startDate;
	        this.endDate = endDate;
	        this.totalEMI = totalEmi;
	        this.paidEMI = paidEmi;
	        this.remainingEMI = remainingEmi;
	        this.lastEMIDate = lastEmiDate;
	        this.nextEMIDate = nextEmiDate;
	        this.status = status.name();
	    }
	    // Constructor matching the query
	    public LoanDetailsResp(Long id, Double loanAmount, Double emiAmount, Integer duration,
	                           LocalDate startDate, LocalDate endDate, Integer totalEmi,
	                           Integer paidEmi, Integer remainingEmi, LocalDate lastEmiDate,
	                           LocalDate nextEmiDate, LoanStatus status, Long userId) {
	        this.id = id;
	        this.loanAmount = loanAmount;
	        this.emiAmount = emiAmount;
	        this.duration = duration;
	        this.startDate = startDate;
	        this.endDate = endDate;
	        this.totalEMI = totalEmi;
	        this.paidEMI = paidEmi;
	        this.remainingEMI = remainingEmi;
	        this.lastEMIDate = lastEmiDate;
	        this.nextEMIDate = nextEmiDate;
	        this.status = status.name();
	        this.userId = userId;
	    }
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public Double getLoanAmount() {
			return loanAmount;
		}
		public void setLoanAmount(Double loanAmount) {
			this.loanAmount = loanAmount;
		}
		public Double getEmiAmount() {
			return emiAmount;
		}
		public void setEmiAmount(Double emiAmount) {
			this.emiAmount = emiAmount;
		}
		public Integer getDuration() {
			return duration;
		}
		public void setDuration(Integer duration) {
			this.duration = duration;
		}
		public LocalDate getStartDate() {
			return startDate;
		}
		public void setStartDate(LocalDate startDate) {
			this.startDate = startDate;
		}
		public LocalDate getEndDate() {
			return endDate;
		}
		public void setEndDate(LocalDate endDate) {
			this.endDate = endDate;
		}
		public Integer getTotalEMI() {
			return totalEMI;
		}
		public void setTotalEMI(Integer totalEMI) {
			this.totalEMI = totalEMI;
		}
		public Integer getPaidEMI() {
			return paidEMI;
		}
		public void setPaidEMI(Integer paidEMI) {
			this.paidEMI = paidEMI;
		}
		public Integer getRemainingEMI() {
			return remainingEMI;
		}
		public void setRemainingEMI(Integer remainingEMI) {
			this.remainingEMI = remainingEMI;
		}
		public LocalDate getLastEMIDate() {
			return lastEMIDate;
		}
		public void setLastEMIDate(LocalDate lastEMIDate) {
			this.lastEMIDate = lastEMIDate;
		}
		public LocalDate getNextEMIDate() {
			return nextEMIDate;
		}
		public void setNextEMIDate(LocalDate nextEMIDate) {
			this.nextEMIDate = nextEMIDate;
		}
		public String getStatus() {
			return status;
		}
		public void setStatus(String status) {
			this.status = status;
		}
		public Long getUserId() {
			return userId;
		}
		public void setUserId(Long userId) {
			this.userId = userId;
		}	    
}
