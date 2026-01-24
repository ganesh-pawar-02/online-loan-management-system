package com.app.pojos;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "transactions")
//@Getter
//@Setter
//@NoArgsConstructor
public class TransactionEntity {

    public TransactionEntity() {
		
	}

	public TransactionEntity(WalletEntity wallet, UserEntity user2, Double valueOf, String string,
			TransactionStatus string2) {
    	this.wallet = wallet;
        this.user = user2;
        this.amount = valueOf;
        this.date = LocalDate.now(); // Set the current date and time
        this.type = string;
        this.status = string2;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long id;
	
	@ManyToOne
    @JoinColumn(name = "wallet_id")
	@JsonIgnore
    private WalletEntity wallet;

    // Many-to-one relationship: Transaction --> UserEntity.
    // We use @JsonIgnoreProperties to avoid serializing sensitive or deeply nested properties.
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "wallet", "role"})
    @JsonIgnore
    private UserEntity user;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate date;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "transaction_type", nullable = false)
    private String type;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_status", nullable = false)
    private TransactionStatus status;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public WalletEntity getWallet() {
		return wallet;
	}

	public void setWallet(WalletEntity wallet) {
		this.wallet = wallet;
	}

	public UserEntity getUser() {
		return user;
	}

	public void setUser(UserEntity user) {
		this.user = user;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public TransactionStatus getStatus() {
		return status;
	}

	public void setStatus(TransactionStatus status) {
		this.status = status;
	}
}
