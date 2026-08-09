package com.app.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.app.dto.KycResponse;
import com.app.pojos.KycEntity;

@Mapper
public interface KycMapper {

    KycMapper INSTANCE = Mappers.getMapper(KycMapper.class);

    KycResponse toDTO(KycEntity entity);
}