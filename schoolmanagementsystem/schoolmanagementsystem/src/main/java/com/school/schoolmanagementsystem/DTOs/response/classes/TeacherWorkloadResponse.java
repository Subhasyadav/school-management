//package com.school.schoolmanagementsystem.DTOs;
//
//public class TeacherWorkLoadResponse {
//}


package com.school.schoolmanagementsystem.DTOs.response.classes;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeacherWorkloadResponse {
    private Long teacherId;
    private String teacherName;
    private long assignmentsCreated;
    private long submissionsPendingGrading;
    private long totalSubmissions;
}