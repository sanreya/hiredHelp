package com.project.hiredHelp.DTO;

import com.project.hiredHelp.Entity.Review;
import com.project.hiredHelp.Entity.ServiceRequestAssignment;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompletedJobWrapper {
    private ServiceRequestAssignment serviceRequestAssignment;
    private Review review;
}
