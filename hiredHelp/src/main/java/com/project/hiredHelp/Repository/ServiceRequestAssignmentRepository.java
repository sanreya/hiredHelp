package com.project.hiredHelp.Repository;

import com.project.hiredHelp.Entity.ServiceRequestAssignment;
import com.project.hiredHelp.Enum.AssignmentStatus;
import com.project.hiredHelp.Enum.ServiceRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ServiceRequestAssignmentRepository extends JpaRepository<ServiceRequestAssignment, Long> {

    boolean existsByRequest_RequestIdAndTechnician_TechnicianId(
            Long requestId,
            Long technicianId
    );

    List<ServiceRequestAssignment> findByTechnician_User_UserIdAndStatus(Long userId, AssignmentStatus status);

    @Query("""
    SELECT a
    FROM ServiceRequestAssignment a
    JOIN a.request r
    WHERE a.technician.user.userId = :userId
      AND r.status = :status
""")
    List<ServiceRequestAssignment> findByTechnicianUserIdAndRequestStatus(
            @Param("userId") Long userId,
            @Param("status") ServiceRequestStatus status
    );

    @Query("""
    SELECT a
    FROM ServiceRequestAssignment a
    JOIN a.request r
    WHERE r.customer.userId = :userId
      AND r.status = :status
""")
    List<ServiceRequestAssignment> findByUserIdAndRequestStatus(
            @Param("userId") Long userId,
            @Param("status") ServiceRequestStatus status
    );

    Optional<ServiceRequestAssignment> findByRequest_RequestIdAndStatus(Long requestId, AssignmentStatus assignmentStatus);
}