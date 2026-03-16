//package com.school.schoolmanagementsystem.service.impl;
//
//public class NotificationServiceImpl {
//}


package com.school.schoolmanagementsystem.service.impl;

import com.school.schoolmanagementsystem.Entity.assignment.Assignment;
import com.school.schoolmanagementsystem.Entity.assignment.AssignmentSubmission;
import com.school.schoolmanagementsystem.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    @Override
    public void notifyAssignmentCreated(Assignment assignment) {
        // In a real system, send emails/push notifications to students in the class
        log.info("Assignment created: {} (ID: {}) for class {}", assignment.getTitle(), assignment.getId(), assignment.getClassRoom().getName());
    }

    @Override
    public void notifyAssignmentDueSoon(Assignment assignment) {
        log.info("Assignment due soon: {} (ID: {}) due on {}", assignment.getTitle(), assignment.getId(), assignment.getDueDate());
    }

    @Override
    public void notifySubmissionGraded(AssignmentSubmission submission) {
        log.info("Submission graded for student {} on assignment {}", submission.getStudent().getFirstName(), submission.getAssignment().getTitle());
    }
}