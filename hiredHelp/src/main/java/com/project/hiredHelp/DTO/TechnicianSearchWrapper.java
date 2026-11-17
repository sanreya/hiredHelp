package com.project.hiredHelp.DTO;

import com.project.hiredHelp.Entity.Technician;
import com.project.hiredHelp.Entity.TechnicianSkill;
import com.project.hiredHelp.Entity.User;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TechnicianSearchWrapper {

    private Technician technician;
    private List<TechnicianSkill> technicianSkills;
}
