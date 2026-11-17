package com.project.hiredHelp.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "technician_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Technician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long technicianId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Builder.Default
    @Column(nullable = false)
    private Integer completedJobs = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer acceptedJobs = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer rejectedJobs = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer forfeitedJobs = 0;

    @Builder.Default
    @Column(nullable = false)
    private Double slaScore = 100.0;

    @Builder.Default
    @Column(nullable = false)
    private Double averageRating = 0.0;

    @Builder.Default
    @Column(nullable = false)
    private Integer totalRatings = 0;

    private String profilePhoto;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}