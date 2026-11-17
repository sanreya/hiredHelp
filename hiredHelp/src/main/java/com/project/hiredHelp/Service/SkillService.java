package com.project.hiredHelp.Service;

import com.project.hiredHelp.Entity.Skill;
import com.project.hiredHelp.Repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    public List<Skill> getSkills() {
        return skillRepository.findAll();
    }

    public Skill getSkillById(Long id) {
        Optional<Skill> skill = skillRepository.findById(id);
        return skill.orElse(null);
    }
}
