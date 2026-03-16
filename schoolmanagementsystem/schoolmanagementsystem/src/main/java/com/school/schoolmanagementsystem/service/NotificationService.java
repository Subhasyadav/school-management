//package com.school.schoolmanagementsystem.service;
//
//public interface NotificationService {
//}


package com.school.schoolmanagementsystem.service;

import com.school.schoolmanagementsystem.Entity.assignment.Assignment;
import com.school.schoolmanagementsystem.Entity.assignment.AssignmentSubmission;

public interface NotificationService {
    void notifyAssignmentCreated(Assignment assignment);
    void notifyAssignmentDueSoon(Assignment assignment);
    void notifySubmissionGraded(AssignmentSubmission submission);
}