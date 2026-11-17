package com.project.hiredHelp.Service;

import com.project.hiredHelp.DTO.CompletedJobWrapper;
import com.project.hiredHelp.Entity.*;
import com.project.hiredHelp.Enum.AssignmentStatus;
import com.project.hiredHelp.Enum.ServiceRequestStatus;
import com.project.hiredHelp.Repository.*;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TechnicianSkillService {

    @Autowired
    private TechnicianSkillRepository technicianSkillRepository;

    @Autowired
    private TechnicianRepository technicianRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ServiceRequestAssignmentRepository serviceRequestAssignmentRepository;

    public ResponseEntity<TechnicianSkill> setTechnicianSkill(TechnicianSkill technicianSkill) {
        Long technicianId = technicianSkill.getTechnician().getTechnicianId();
        Optional<Technician> existingTechnicianProfile = technicianRepository.findById(technicianId);
        if(existingTechnicianProfile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = existingTechnicianProfile.get().getUser();

        return ResponseEntity.ok(technicianSkillRepository.save(technicianSkill));
    }

    public List<TechnicianSkill> getTechnicianSkillData(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Technician> technician = technicianRepository.findByUser_UserId(userId);

        if(user.isEmpty() || technician.isEmpty()) {
            return null;
        }

        List<TechnicianSkill> technicianSkills = technicianSkillRepository.findByTechnician_User_UserId(userId);
        if(technicianSkills.isEmpty()) {
            return null;
        }

        return technicianSkills;
    }

    public TechnicianSkill modifyTechnicianSkill(TechnicianSkill technicianSkill) {

        Optional<TechnicianSkill> existingSkill = technicianSkillRepository.findById(technicianSkill.getId());

        if (existingSkill.isEmpty()) {
            return null;
        }
        Optional<Skill> newSkill = skillRepository.findById(technicianSkill.getSkill().getSkillId());
        if(newSkill.isEmpty()) {
            return null;
        }

        TechnicianSkill skill = existingSkill.get();
        skill.setSkill(newSkill.get());
        skill.setExperienceYears(technicianSkill.getExperienceYears());
        skill.setCertificateUrl(technicianSkill.getCertificateUrl());
        skill.setWorkPhotos(technicianSkill.getWorkPhotos());

        return technicianSkillRepository.save(skill);
    }

    public ResponseEntity<String> deleteTechnicianSkill(Long technicianSkillId) {
        boolean exists = technicianSkillRepository.existsById(technicianSkillId);
        if(!exists) {
            return  ResponseEntity.notFound().build();
        }
        technicianSkillRepository.deleteById(technicianSkillId);

        return ResponseEntity.ok("Technician skill deleted successfully");
    }

    public List<ServiceRequestAssignment> getActiveTechniciansData(Long userId) {
        return serviceRequestAssignmentRepository.findByTechnician_User_UserIdAndStatus(userId, AssignmentStatus.ACCEPTED);
    }

    public List<ServiceRequestAssignment> getPendingRequestsData(Long userId) {
        return serviceRequestAssignmentRepository.findByTechnician_User_UserIdAndStatus(userId, AssignmentStatus.REQUESTED);
    }

    public List<ServiceRequestAssignment> getCompletedRequestsData(Long userId) {
        return serviceRequestAssignmentRepository.findByTechnicianUserIdAndRequestStatus(userId, ServiceRequestStatus.COMPLETED);
    }

    public List<CompletedJobWrapper> getUserCompletedRequestsData(Long userId) {

        List<ServiceRequestAssignment> assignments =
                serviceRequestAssignmentRepository.findByUserIdAndRequestStatus(
                        userId,
                        ServiceRequestStatus.COMPLETED
                );

        return assignments.stream()
                .map(assignment -> {
                    CompletedJobWrapper wrapper = new CompletedJobWrapper();

                    wrapper.setServiceRequestAssignment(assignment);

                    Review review = reviewRepository
                            .findByRequest_RequestId(assignment.getRequest().getRequestId())
                            .orElse(null);

                    wrapper.setReview(review);

                    return wrapper;
                })
                .toList();
    }
}
