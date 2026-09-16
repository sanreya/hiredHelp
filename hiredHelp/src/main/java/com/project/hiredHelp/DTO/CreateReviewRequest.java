package com.project.hiredHelp.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReviewRequest {
    private Integer rating;
    private String review;
}
