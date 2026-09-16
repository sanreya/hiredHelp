package com.project.hiredHelp.Repository;

import com.project.hiredHelp.Entity.Skill;
import com.project.hiredHelp.Entity.TechnicianSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findById(Long id);

    List<Skill> findAll();
}
