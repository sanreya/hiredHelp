package com.project.hiredHelp.Controller;

import com.project.hiredHelp.Auth.DTO.UserPrincipal;
import com.project.hiredHelp.Entity.Review;
import com.project.hiredHelp.Entity.ServiceRequestAssignment;
import com.project.hiredHelp.Entity.Technician;
import com.project.hiredHelp.Entity.TechnicianSkill;
import com.project.hiredHelp.Service.ReviewService;
import com.project.hiredHelp.Service.TechnicianService;
import com.project.hiredHelp.Service.TechnicianSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/technicians")
public class TechnicianController {

    @Autowired
    private TechnicianService technicianService;

    @Autowired
    private TechnicianSkillService technicianSkillService;

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/profile")
    public ResponseEntity<Technician> saveTechnicianProfileData(@RequestBody Technician technicianProfile) {
            Technician tech = technicianService.saveTechnicianProfileData(technicianProfile);
            return new ResponseEntity<>(tech, HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<Technician> getTechniciansData(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getUserId();
        Technician tech = technicianService.getTechnicianData(userId);
        if(tech == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }else  {
            return new ResponseEntity<>(tech, HttpStatus.OK);
        }
    }

    @PutMapping("/me")
    public ResponseEntity<Technician> modifyTechnicianProfileData(@RequestBody Technician technicianProfile) {
        Technician tech = technicianService.saveTechnicianProfileData(technicianProfile);
        return new ResponseEntity<>(tech, HttpStatus.OK);
    }

    @PostMapping("/skills")
    public ResponseEntity<TechnicianSkill> setTechnicianSkill(@RequestBody TechnicianSkill technicianSkill) {
        return technicianSkillService.setTechnicianSkill(technicianSkill);
    }

    @GetMapping("/skills")
    public ResponseEntity<List<TechnicianSkill>> getTechnicianSkillData(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getUserId();
        List<TechnicianSkill> technicianSkill = technicianSkillService.getTechnicianSkillData(userId);
        if(technicianSkill.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }else  {
            return new ResponseEntity<>(technicianSkill, HttpStatus.OK);
        }
    }

    @PutMapping("/skills")
    public ResponseEntity<TechnicianSkill> modifyTechnicianSkill
            (@RequestBody TechnicianSkill technicianSkill) {
        TechnicianSkill newTechnicianSkill = technicianSkillService.modifyTechnicianSkill(technicianSkill);
        if(newTechnicianSkill == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(newTechnicianSkill, HttpStatus.OK);
    }

    @DeleteMapping("/skills")
    public ResponseEntity<String> deleteTechnicianSkillData(@RequestParam Long technicianSkillId) {
        return technicianSkillService.deleteTechnicianSkill(technicianSkillId);
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<List<ServiceRequestAssignment>> pendingTechniciansData(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getUserId();
        return new ResponseEntity<>(technicianSkillService.getPendingRequestsData(userId), HttpStatus.OK);
    }

    @GetMapping("/jobs/active")
    public ResponseEntity<List<ServiceRequestAssignment>> activeTechniciansData(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getUserId();
        return new ResponseEntity<>(technicianSkillService.getActiveTechniciansData(userId), HttpStatus.OK);
    }

    @GetMapping("/jobs/completed")
    public ResponseEntity<List<ServiceRequestAssignment>> completedTechniciansData(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getUserId();
        return new ResponseEntity<>(technicianSkillService.getCompletedRequestsData(userId), HttpStatus.OK);
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> fetchReviewData(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getUserId();
        return new ResponseEntity<>(reviewService.getTechnicianReviews(userId), HttpStatus.OK);
    }
}
