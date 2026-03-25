package com.example.main.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.main.dto.MenuDTO;

@Mapper
public interface MenuMapper {
    List<MenuDTO> getMenus(MenuDTO menuDTO);
}
