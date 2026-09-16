package com.project.hiredHelp.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "request_id",
            nullable = false,
            unique = true
    )
    private ServiceRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "customer_id",
            nullable = false
    )
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "technician_id",
            nullable = false
    )
    private Technician technician;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String review;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}