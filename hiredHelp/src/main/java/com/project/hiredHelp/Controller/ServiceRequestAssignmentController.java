package com.project.hiredHelp.Controller;

import com.project.hiredHelp.Entity.ServiceRequest;
import com.project.hiredHelp.Entity.ServiceRequestAssignment;
import com.project.hiredHelp.Repository.ServiceRequestRepository;
import com.project.hiredHelp.Service.ServiceRequestAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/service-request-assignment")
public class ServiceRequestAssignmentController {

    @Autowired
    private ServiceRequestAssignmentService serviceRequestAssignmentService;
    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @PostMapping("/{requestId}/technicians/{technicianId}/request")
    public ResponseEntity<ServiceRequestAssignment> requestTechnician(@PathVariable Long requestId, @PathVariable Long technicianId) {
        ServiceRequestAssignment assignment = serviceRequestAssignmentService.requestTechnician(requestId, technicianId);
        return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
    }

    @PutMapping("/{assignmentId}/accept")
    public ResponseEntity<ServiceRequestAssignment> acceptRequest( @PathVariable Long assignmentId) {
        ServiceRequestAssignment assignment = serviceRequestAssignmentService.technicianAcceptRequest(assignmentId);
        return ResponseEntity.ok(assignment); }

    @PutMapping("/{assignmentId}/reject")
    public ResponseEntity<ServiceRequestAssignment> rejectRequest( @PathVariable Long assignmentId, @RequestBody String rejectionReason) {
        ServiceRequestAssignment assignment = serviceRequestAssignmentService.technicianRejectRequest( assignmentId, rejectionReason);
        return ResponseEntity.ok(assignment);
    }

    @PutMapping("/{requestId}/arrive")
    public ResponseEntity<ServiceRequest> arrive(@PathVariable Long requestId) {
        ServiceRequest serviceRequest = serviceRequestAssignmentService.technicianArrive(requestId);
        return ResponseEntity.ok(serviceRequest);
    }

    @PutMapping("/{requestId}/start")
    public ResponseEntity<ServiceRequest> start( @PathVariable Long requestId) {
        ServiceRequest serviceRequest = serviceRequestAssignmentService.startService(requestId);
        return ResponseEntity.ok(serviceRequest);
    }

    @PutMapping("/{requestId}/complete")
    public ResponseEntity<ServiceRequest> complete( @PathVariable Long requestId, @RequestBody Double finalPrice) {
        ServiceRequest serviceRequest = serviceRequestAssignmentService.completeService( requestId, finalPrice );
        return ResponseEntity.ok(serviceRequest);
    }
}
