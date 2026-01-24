package com.app.dto;

import lombok.Getter;
import lombok.Setter;

//@Getter
//@Setter
public class AddFundsRequest {
    private Double amount;

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}
}
