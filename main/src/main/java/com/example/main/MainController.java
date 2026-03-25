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
import com.example.main.mapper.AppMapper;
import com.example.main.mapper.MemberMapper;
import com.example.main.dto.AppDTO;


@Controller
public class MainController {

    // MyBatis Mapper 주입
    private final AppMapper appMapper;
    private final MemberMapper memberMapper;
    
    public MainController(AppMapper appMapper, MemberMapper memberMapper) {
        this.appMapper = appMapper;
        this.memberMapper = memberMapper;
    }

    @GetMapping("/")
    public String test(Model model) {
        return "index"; // views/index.jsp 를 호출
    }

    @PostMapping("/users")
    @ResponseBody
    public List<MemberDTO> getUsers() {
        System.out.println("**************************");
        System.out.println("/users");
        System.out.println("**************************");

        List<MemberDTO> members = memberMapper.getMembers();
        
        return members;
    }
    
    @PostMapping("/apps")
    @ResponseBody
    public List<AppDTO> getApps() {
        System.out.println("**************************");
        System.out.println("/apps");
        System.out.println("**************************");

        List<AppDTO> apps = appMapper.getApps();
        
        return apps;
    }
}