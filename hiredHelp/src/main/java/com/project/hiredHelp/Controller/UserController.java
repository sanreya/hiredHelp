package com.project.hiredHelp.Controller;

import com.project.hiredHelp.Auth.DTO.UserPrincipal;
import com.project.hiredHelp.Auth.Service.JwtService;
import com.project.hiredHelp.DTO.CompletedJobWrapper;
import com.project.hiredHelp.Entity.ServiceRequestAssignment;
import com.project.hiredHelp.Entity.User;
import com.project.hiredHelp.Repository.UserRepository;
import com.project.hiredHelp.Service.TechnicianSkillService;
import com.project.hiredHelp.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TechnicianSkillService technicianSkillService;

    @GetMapping("/me")
    public ResponseEntity<User> getUsers(@AuthenticationPrincipal  UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getUserId();
        User user = userService.findById(userId);

        if(user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateUser(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody User updatedUser) {
        Long userId = userPrincipal.getUserId();
        User user = userService.updateUserInfo(userId, updatedUser);
        if(user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/jobs/completed")
    public ResponseEntity<List<CompletedJobWrapper>> completedTechniciansData(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getUserId();
        return new ResponseEntity<>(technicianSkillService.getUserCompletedRequestsData(userId), HttpStatus.OK);
    }
}
