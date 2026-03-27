package com.example.main.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.main.dto.AppDTO;

@Mapper
public interface AppMapper {
    List<AppDTO> getApps();

    int deleteAllApps();

    int deleteApps(List<String> appIds);

    int insertApps(List<AppDTO> appDTOs);

    int updateAppsIdx(AppDTO appDTO);
}