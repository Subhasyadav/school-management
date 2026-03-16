//package com.school.schoolmanagementsystem.DTOs.request;
//
//import jakarta.validation.constraints.NotNull;
//import lombok.Data;
//
//@Data
//public class GradeSubmissionRequest {
//    @NotNull
//    private Double grade;
//    private String feedback;
//}

package com.school.schoolmanagementsystem.DTOs.request.grades;

import lombok.Data;

@Data
public class GradeSubmissionRequest {
    private Double grade;
    private String letterGrade;
    private String gradeType; // PERCENTAGE, LETTER, PASS_FAIL
    private String feedback;
}