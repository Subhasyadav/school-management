//package com.school.schoolmanagementsystem.DTOs.request;
//
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.NotNull;
//import lombok.Data;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.time.LocalDate;
//
//@Data
//public class AssignmentCreateRequest {
//    @NotBlank
//    private String title;
//
//    private String description;
//
//    @NotNull
//    private Long classId;
//
//    @NotNull
//    private Long subjectId;
//
//    private LocalDate dueDate;
//
//    private MultipartFile attachment;      // file upload
//}

package com.school.schoolmanagementsystem.DTOs.request.assignment;

import com.school.schoolmanagementsystem.Enum.AssignmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AssignmentCreateRequest {
    @NotBlank
    private String title;

    private String description;

    @NotNull
    private Long classId;

    @NotNull
    private Long subjectId;

    @NotNull
    private LocalDate dueDate;

    private MultipartFile attachment;

    // New fields
    private AssignmentStatus status; // if null, defaults to DRAFT in service
    private LocalDateTime publishDate;
    private boolean allowLateSubmission;
    private double latePenaltyPercent;
    private boolean anonymousGrading;
}
