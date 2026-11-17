package com.project.hiredHelp.Repository;

import com.project.hiredHelp.Entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository  extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByCustomer_UserId(Long userId);
}
