package com.project.hiredHelp.Entity;

import com.project.hiredHelp.Enum.AssignmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "service_request_assignments",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "request_id",
                                "technician_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequestAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "request_id",
            nullable = false
    )
    private ServiceRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "technician_id",
            nullable = false
    )
    private Technician technician;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AssignmentStatus status =
            AssignmentStatus.REQUESTED;

    @Column(nullable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime respondedAt;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @PrePersist
    protected void onCreate() {
        if (requestedAt == null) {
            requestedAt = LocalDateTime.now();
        }

        if (status == null) {
            status = AssignmentStatus.REQUESTED;
        }
    }
}