//package com.school.schoolmanagementsystem.DTOs.request;
//
//import lombok.Data;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.time.LocalDate;
//
//@Data
//public class AssignmentUpdateRequest {
//    private String title;
//    private String description;
//    private Long classId;
//    private Long subjectId;
//    private LocalDate dueDate;
//    private MultipartFile attachment;      // optional
//}


package com.school.schoolmanagementsystem.DTOs.request.assignment;

import com.school.schoolmanagementsystem.Enum.AssignmentStatus;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Data
public class AssignmentUpdateRequest {
    private String title;
    private String description;
    private Long classId;
    private Long subjectId;
    private LocalDate dueDate;
    private MultipartFile attachment;
    private AssignmentStatus status;
    private LocalDateTime publishDate;
    private Boolean allowLateSubmission; // use Boolean to allow null (no change)
    private Double latePenaltyPercent;
    private Boolean anonymousGrading;
}