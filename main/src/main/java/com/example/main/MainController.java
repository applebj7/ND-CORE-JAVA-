package com.example.main;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.main.dto.MemberDTO;
import com.example.main.dto.AppDTO;


@Controller
public class MainController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/")
    public String test(Model model) {
        return "hello"; // views/hello.jsp 를 호출
    }

    @PostMapping("/users")
    @ResponseBody
    public List<MemberDTO> getUsers() {
        System.out.println("**************************");
        System.out.println("/users");
        System.out.println("**************************");
        String sql = "SELECT ID, NAME, EMAIL, CREATE_DATE FROM TB_MEMBER ORDER BY CREATE_DATE ASC";

        List<MemberDTO> members = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(MemberDTO.class));
        
        return members;
    }
    
    @PostMapping("/apps")
    @ResponseBody
    public List<AppDTO> getApps() {
        System.out.println("**************************");
        System.out.println("/apps");
        System.out.println("**************************");
        String sql = "SELECT ID, NAME, ICON, COLOR, CREATE_DATE FROM TB_APP ORDER BY IDX ASC";

        List<AppDTO> apps = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(AppDTO.class));
        
        return apps;
    }
}