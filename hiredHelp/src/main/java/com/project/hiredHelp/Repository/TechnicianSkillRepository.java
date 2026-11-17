package com.project.hiredHelp.Repository;

import com.project.hiredHelp.Entity.Technician;
import com.project.hiredHelp.Entity.TechnicianSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicianSkillRepository extends JpaRepository<TechnicianSkill, Long> {

    List<TechnicianSkill> findByTechnician_User_UserId(Long userId);

    @Query("""
    SELECT DISTINCT t
    FROM Technician t
    JOIN TechnicianSkill ts ON ts.technician = t
    WHERE ts.skill.skillId = :skillId
    """)
    List<Technician> findTechniciansBySkillId(@Param("skillId") Long skillId);

    List<TechnicianSkill> findByTechnician_TechnicianId(Long technicianId);
}
