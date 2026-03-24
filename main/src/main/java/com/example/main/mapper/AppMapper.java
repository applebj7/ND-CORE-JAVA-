package com.example.main.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.main.dto.AppDTO;

@Mapper
public interface AppMapper {
    List<AppDTO> getApps();
}