package com.project.hiredHelp.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long skillId;

    @Column(
            nullable = false,
            unique = true,
            length = 100
    )
    private String skillName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;
}