package com.project.hiredHelp.Controller;

import com.project.hiredHelp.Entity.Skill;
import com.project.hiredHelp.Service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/skills")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @GetMapping("/getAllSkills")
    public ResponseEntity<List<Skill>> getAllSkills(){
        List<Skill> skill = skillService.getSkills();
        return ResponseEntity.ok(skill);
    }

    @GetMapping("/getSkillById")
    public ResponseEntity<Skill> getSkills(@RequestParam("skillId") Long skillId){
        Skill skill = skillService.getSkillById(skillId);
        return ResponseEntity.ok(skill);
    }

}
