package com.project.hiredHelp.Service;

import com.project.hiredHelp.Entity.ServiceRequest;
import com.project.hiredHelp.Entity.ServiceRequestAssignment;
import com.project.hiredHelp.Entity.Technician;
import com.project.hiredHelp.Enum.AssignmentStatus;
import com.project.hiredHelp.Enum.ServiceRequestStatus;
import com.project.hiredHelp.GlobalExceptionHandler.ErrorType;
import com.project.hiredHelp.GlobalExceptionHandler.HiredHelpException;
import com.project.hiredHelp.Repository.ServiceRequestAssignmentRepository;
import com.project.hiredHelp.Repository.ServiceRequestRepository;
import com.project.hiredHelp.Repository.TechnicianRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ServiceRequestAssignmentService {

    @Autowired
    private ServiceRequestAssignmentRepository serviceRequestAssignmentRepository;

    @Autowired
    private TechnicianRepository technicianRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    public ServiceRequestAssignment requestTechnician(
            Long requestId,
            Long technicianId
    ) {
        ServiceRequest serviceRequest = serviceRequestRepository.findById(requestId)
                        .orElseThrow(() -> new HiredHelpException(ErrorType.SERVICE_REQUEST_NOT_FOUND));
        Technician technician = technicianRepository.findById(technicianId)
                        .orElseThrow(() -> new HiredHelpException(ErrorType.USER_NOT_FOUND));

        ServiceRequestAssignment assignment = new ServiceRequestAssignment();

        assignment.setRequest(serviceRequest);
        assignment.setTechnician(technician);
        assignment.setStatus(AssignmentStatus.REQUESTED);

        return serviceRequestAssignmentRepository.save(assignment);
    }

    @Transactional
    public ServiceRequestAssignment technicianAcceptRequest(Long assignmentId) {

        ServiceRequestAssignment assignment =
                serviceRequestAssignmentRepository.findById(assignmentId)
                        .orElseThrow(() -> new HiredHelpException(
                                ErrorType.ASSIGNMENT_NOT_FOUND
                        ));

        if (assignment.getStatus() != AssignmentStatus.REQUESTED) {
            throw new HiredHelpException(ErrorType.INVALID_STATUS);
        }

        assignment.setStatus(AssignmentStatus.ACCEPTED);
        assignment.setRespondedAt(LocalDateTime.now());

        ServiceRequest serviceRequest = assignment.getRequest();
        serviceRequest.setStatus(ServiceRequestStatus.ACCEPTED);
        serviceRequest.setAcceptedAt(LocalDateTime.now());
        serviceRequestRepository.save(serviceRequest);

        Technician technician = assignment.getTechnician();
        technician.setAcceptedJobs(technician.getAcceptedJobs() + 1);
        technicianRepository.save(technician);

        return serviceRequestAssignmentRepository.save(assignment);
    }


    @Transactional
    public ServiceRequestAssignment technicianRejectRequest(Long assignmentId, String rejectionReason) {

        ServiceRequestAssignment assignment =
                serviceRequestAssignmentRepository.findById(assignmentId)
                        .orElseThrow(() -> new HiredHelpException(
                                ErrorType.ASSIGNMENT_NOT_FOUND
                        ));

        if (assignment.getStatus() != AssignmentStatus.REQUESTED) {
            throw new HiredHelpException(ErrorType.INVALID_STATUS);
        }

        assignment.setStatus(AssignmentStatus.REJECTED);
        assignment.setRejectionReason(rejectionReason);
        assignment.setRespondedAt(LocalDateTime.now());

        ServiceRequest serviceRequest = assignment.getRequest();
        serviceRequest.setStatus(ServiceRequestStatus.REOPENED);

        Technician technician = assignment.getTechnician();
        technician.setRejectedJobs(technician.getRejectedJobs() + 1);

        serviceRequestRepository.save(serviceRequest);

        return serviceRequestAssignmentRepository.save(assignment);
    }

    @Transactional
    public ServiceRequest technicianArrive(Long requestId) {
        ServiceRequest serviceRequest =
                serviceRequestRepository.findById(requestId)
                        .orElseThrow(() -> new HiredHelpException(
                                ErrorType.SERVICE_REQUEST_NOT_FOUND
                        ));
        if (serviceRequest.getStatus() != ServiceRequestStatus.ACCEPTED) {
            throw new HiredHelpException(ErrorType.INVALID_STATUS);
        }

        serviceRequest.setStatus(ServiceRequestStatus.TECHNICIAN_ARRIVED);
        serviceRequest.setArrivedAt(LocalDateTime.now());

        return serviceRequestRepository.save(serviceRequest);
    }

    @Transactional
    public ServiceRequest startService(Long requestId) {

        ServiceRequest serviceRequest =
                serviceRequestRepository.findById(requestId)
                        .orElseThrow(() -> new HiredHelpException(
                                ErrorType.SERVICE_REQUEST_NOT_FOUND
                        ));

        if (serviceRequest.getStatus() != ServiceRequestStatus.TECHNICIAN_ARRIVED) {
            throw new HiredHelpException(ErrorType.INVALID_STATUS);
        }

        serviceRequest.setStatus(ServiceRequestStatus.IN_PROGRESS);
        serviceRequest.setStartedAt(LocalDateTime.now());

        return serviceRequestRepository.save(serviceRequest);
    }

    @Transactional
    public ServiceRequest completeService(Long requestId, Double finalPrice) {

        ServiceRequest serviceRequest =
                serviceRequestRepository.findById(requestId)
                        .orElseThrow(() -> new HiredHelpException(
                                ErrorType.SERVICE_REQUEST_NOT_FOUND
                        ));

        // Service can be completed only if it is currently in progress
        if (serviceRequest.getStatus() != ServiceRequestStatus.IN_PROGRESS) {
            throw new HiredHelpException(ErrorType.INVALID_STATUS);
        }

        // Validate final price
        if (finalPrice == null || finalPrice < 0) {
            throw new HiredHelpException(ErrorType.INVALID_PRICE);
        }

        // Update service request
        serviceRequest.setStatus(ServiceRequestStatus.COMPLETED);
        serviceRequest.setFinalPrice(finalPrice);
        serviceRequest.setCompletedAt(LocalDateTime.now());

        // Find the accepted technician for this request
        ServiceRequestAssignment assignment =
                serviceRequestAssignmentRepository
                        .findByRequest_RequestIdAndStatus(
                                requestId,
                                AssignmentStatus.ACCEPTED
                        )
                        .orElseThrow(() -> new HiredHelpException(
                                ErrorType.ASSIGNMENT_NOT_FOUND
                        ));

        // Update technician statistics
        Technician technician = assignment.getTechnician();
        technician.setCompletedJobs(technician.getCompletedJobs() + 1);

        // Save technician
        technicianRepository.save(technician);

        // Save request
        return serviceRequestRepository.save(serviceRequest);
    }

}
