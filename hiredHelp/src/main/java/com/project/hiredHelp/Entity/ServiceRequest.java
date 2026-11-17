package com.project.hiredHelp.Entity;

import com.project.hiredHelp.Enum.ServiceRequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "service_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "customer_id",
            nullable = false
    )
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "skill_id",
            nullable = false
    )
    private Skill skill;

    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String description;

    @Column(length = 2000)
    private String issuePhotos;

    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String serviceAddress;

    private Double latitude;

    private Double longitude;

    @Column(nullable = false)
    private LocalDate scheduledDate;

    @Column(nullable = false)
    private LocalTime scheduledStartTime;

    @Column(nullable = false)
    private LocalTime scheduledEndTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ServiceRequestStatus status = ServiceRequestStatus.OPEN;

    private Double estimatedPriceMin;

    private Double estimatedPriceMax;

    private Double finalPrice;

    private LocalDateTime acceptedAt;

    private LocalDateTime arrivedAt;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = ServiceRequestStatus.OPEN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}