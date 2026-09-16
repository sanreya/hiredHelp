package com.project.hiredHelp.Repository;

import com.project.hiredHelp.Entity.Technician;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {

    @NonNull Optional<Technician> findById(@NonNull Long id);

    Optional<Technician> findByUser_UserId(Long userId);

    @Query("""
        SELECT DISTINCT t
        FROM Technician t
        JOIN TechnicianSkill ts ON ts.technician = t
        WHERE ts.skill.skillId = :skillId
          AND ts.active = true
    """)
    List<Technician> findTechniciansBySkillId(@Param("skillId") Long skillId);
}
