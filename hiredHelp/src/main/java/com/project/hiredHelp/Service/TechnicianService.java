package com.project.hiredHelp.Service;

import com.project.hiredHelp.Entity.Technician;
import com.project.hiredHelp.Repository.TechnicianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TechnicianService {

    @Autowired
    private TechnicianRepository technicianRepository;

    public Technician saveTechnicianProfileData(Technician technicianProfile) {
        //TODO: add/update completedJobs, acceptedJobs, rejectedJobs, forfeitedJobs, slaScore = 100.0;
        // averageRating, totalRatings, profilePhoto, createdAt, updatedAt;
        return technicianRepository.save(technicianProfile);

    }

    public Technician getTechnicianData(Long userId) {
        Optional<Technician> existingTechnicianProfile = technicianRepository.findByUser_UserId(userId);
        return existingTechnicianProfile.orElse(null);
    }
}
