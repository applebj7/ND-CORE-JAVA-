package com.example.main;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.main.dto.MemberDTO;
import com.example.main.dto.MenuDTO;
import com.example.main.dto.AppDTO;
import com.example.main.mapper.AppMapper;
import com.example.main.mapper.MemberMapper;
import com.example.main.mapper.MenuMapper;


@Controller
public class MainController {

    // MyBatis Mapper 주입
    private final AppMapper appMapper;
    private final MemberMapper memberMapper;
    private final MenuMapper menuMapper;
    
    public MainController(AppMapper appMapper, MemberMapper memberMapper, MenuMapper menuMapper) {
        this.appMapper      = appMapper;
        this.memberMapper   = memberMapper;
        this.menuMapper     = menuMapper;
    }

    @GetMapping("/")
    public String test(Model model) {
        return "index"; // views/index.jsp 를 호출
    }

    @GetMapping("/board")
    public String board(Model model) {
        return "board"; // views/board.jsp 를 호출
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

    @PostMapping("/menus")
    @ResponseBody
    public List<MenuDTO> getMenus(@RequestBody MenuDTO menuDTO) {
        System.out.println("**************************");
        System.out.println("/menus");
        System.out.println("**************************");

        List<MenuDTO> menus = menuMapper.getMenus(menuDTO);
        
        return menus;
    }
}