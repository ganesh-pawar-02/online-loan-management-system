package com.app.mapper;

import com.app.dto.LoanApplicationRequest;
import com.app.pojos.LoanApplication;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface LoanApplicationMapper {
    LoanApplicationMapper INSTANCE = Mappers.getMapper(LoanApplicationMapper.class);

    LoanApplication toEntity(LoanApplicationRequest dto);

    LoanApplicationRequest toDTO(LoanApplication entity);
    
}
