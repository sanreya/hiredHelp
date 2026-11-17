package com.project.hiredHelp.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "technician_skills",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "technician_id",
                                "skill_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnicianSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "technician_id",
            nullable = false
    )
    private Technician technician;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "skill_id",
            nullable = false
    )
    private Skill skill;

    @Column(nullable = false)
    private Integer experienceYears = 0;

    private String certificateUrl;

    @Column(length = 2000)
    private String workPhotos;

    @Column
    @Builder.Default
    private Boolean active = true;
}