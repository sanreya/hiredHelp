package com.project.hiredHelp.Controller;

import com.project.hiredHelp.Auth.DTO.UserPrincipal;
import com.project.hiredHelp.DTO.TechnicianSearchWrapper;
import com.project.hiredHelp.Entity.ServiceRequest;
import com.project.hiredHelp.Entity.Technician;
import com.project.hiredHelp.Service.ServiceRequestService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/service-requests")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @PostMapping
    public ResponseEntity<ServiceRequest> createServiceRequest(@RequestBody ServiceRequest serviceRequest) {
        ServiceRequest newServiceRequests = serviceRequestService.createServiceRequest(serviceRequest);
        return new ResponseEntity<>(newServiceRequests, HttpStatus.OK);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ServiceRequest>> getServiceRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getUserId();
        List<ServiceRequest> serviceRequests = serviceRequestService.getServiceRequests(userId);
        return new ResponseEntity<>(serviceRequests, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ServiceRequest> getServiceRequestsByServiceId(@RequestParam Long serviceId) {
        ServiceRequest serviceRequest = serviceRequestService.getServiceRequestById(serviceId);
        if(serviceRequest == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(serviceRequest, HttpStatus.OK);
    }

    @PutMapping("/cancel/{serviceId}")
    public ResponseEntity<String> cancelServiceRequest(@PathVariable Long serviceId) {
        String serviceRequestCancelled = serviceRequestService.cancelServiceRequest(serviceId);
        if(serviceRequestCancelled == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(serviceRequestCancelled, HttpStatus.OK);
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<TechnicianSearchWrapper>> getTechniciansByServiceId(@RequestParam Long skillId) {
        List<TechnicianSearchWrapper> technicianList = serviceRequestService.getTechnicianList(skillId);
        return ResponseEntity.ok(technicianList);
    }


}
