package com.app.pojos;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "loans")
//@Getter
//@Setter
public class LoanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loan_id")
    private Long id;

    // Reference to user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "loan_amount", nullable = false)
    private Double loanAmount;

    @Column(name = "emi_amount", nullable = false)
    private Double emiAmount;

    // Duration as a text (e.g., "1 year")
    @Column(name = "duration_months", nullable = false)
    private Integer duration;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "total_emi", nullable = false)
    private Integer totalEmi;

    @Column(name = "paid_emi", nullable = false)
    private Integer paidEmi;

    @Column(name = "remaining_emi", nullable = false)
    private Integer remainingEmi;

    @Column(name = "last_emi_date")
    private LocalDate lastEmiDate;

    @Column(name = "next_emi_date")
    private LocalDate nextEmiDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LoanStatus status = LoanStatus.PENDING;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public UserEntity getUser() {
		return user;
	}

	public void setUser(UserEntity user) {
		this.user = user;
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

	public Integer getTotalEmi() {
		return totalEmi;
	}

	public void setTotalEmi(Integer totalEmi) {
		this.totalEmi = totalEmi;
	}

	public Integer getPaidEmi() {
		return paidEmi;
	}

	public void setPaidEmi(Integer paidEmi) {
		this.paidEmi = paidEmi;
	}

	public Integer getRemainingEmi() {
		return remainingEmi;
	}

	public void setRemainingEmi(Integer remainingEmi) {
		this.remainingEmi = remainingEmi;
	}

	public LocalDate getLastEmiDate() {
		return lastEmiDate;
	}

	public void setLastEmiDate(LocalDate lastEmiDate) {
		this.lastEmiDate = lastEmiDate;
	}

	public LocalDate getNextEmiDate() {
		return nextEmiDate;
	}

	public void setNextEmiDate(LocalDate nextEmiDate) {
		this.nextEmiDate = nextEmiDate;
	}

	public LoanStatus getStatus() {
		return status;
	}

	public void setStatus(LoanStatus status) {
		this.status = status;
	}
}
