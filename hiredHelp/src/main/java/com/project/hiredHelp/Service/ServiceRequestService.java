package com.project.hiredHelp.Service;

import com.project.hiredHelp.DTO.TechnicianSearchWrapper;
import com.project.hiredHelp.Entity.ServiceRequest;
import com.project.hiredHelp.Entity.Technician;
import com.project.hiredHelp.Entity.TechnicianSkill;
import com.project.hiredHelp.Enum.ServiceRequestStatus;
import com.project.hiredHelp.Repository.ServiceRequestRepository;
import com.project.hiredHelp.Repository.SkillRepository;
import com.project.hiredHelp.Repository.TechnicianRepository;
import com.project.hiredHelp.Repository.TechnicianSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private TechnicianRepository technicianRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private TechnicianSkillRepository technicianSkillRepository;

    public ServiceRequest createServiceRequest(ServiceRequest serviceRequest) {
        return serviceRequestRepository.save(serviceRequest);
    }

    public List<ServiceRequest> getServiceRequests(Long userId) {
        return serviceRequestRepository.findByCustomer_UserId(userId);
    }

    public ServiceRequest getServiceRequestById(Long serviceId) {
        return serviceRequestRepository.findById(serviceId).orElse(null);
    }

    public String cancelServiceRequest(Long serviceId) {

        Optional<ServiceRequest> optionalRequest = serviceRequestRepository.findById(serviceId);
        if (optionalRequest.isEmpty()) {
            return null;
        }

        ServiceRequest serviceRequest = optionalRequest.get();
        serviceRequest.setStatus(ServiceRequestStatus.CANCELLED);
        serviceRequestRepository.save(serviceRequest);

        return "Service request has been cancelled";
    }

    public List<TechnicianSearchWrapper> getTechnicianList(Long skillId) {

        if (!skillRepository.existsById(skillId)) {
            return null;
        }
        List<Technician> technicians = technicianRepository.findTechniciansBySkillId(skillId);

        List<TechnicianSearchWrapper> technicianList = new ArrayList<>();

        for (Technician technician : technicians) {
            TechnicianSearchWrapper wrapper = new TechnicianSearchWrapper();
            wrapper.setTechnician(technician);

            List<TechnicianSkill> skills = technicianSkillRepository.findByTechnician_TechnicianId(technician.getTechnicianId());
            wrapper.setTechnicianSkills(skills);
            technicianList.add(wrapper);
        }

        return technicianList;
    }
}
