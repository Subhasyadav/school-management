package com.school.schoolmanagementsystem.service.impl;

import com.school.schoolmanagementsystem.DTOs.dashboard.*;
import com.school.schoolmanagementsystem.Entity.classes.ClassRoom;
import com.school.schoolmanagementsystem.Entity.classes.Enrollment;
import com.school.schoolmanagementsystem.Entity.users.Parent;
import com.school.schoolmanagementsystem.Entity.users.Student;
import com.school.schoolmanagementsystem.Entity.users.Teacher;
import com.school.schoolmanagementsystem.Enum.EnrollmentStatus;
import com.school.schoolmanagementsystem.Enum.Role;
import com.school.schoolmanagementsystem.Repository.assignments.AssignmentRepository;
import com.school.schoolmanagementsystem.Repository.assignments.AssignmentSubmissionRepository;
import com.school.schoolmanagementsystem.Repository.attendance.AttendanceRepository;
import com.school.schoolmanagementsystem.Repository.classes.ClassRoomRepository;
import com.school.schoolmanagementsystem.Repository.classes.EnrollmentRepository;
import com.school.schoolmanagementsystem.Repository.subjects.SubjectRepository;
import com.school.schoolmanagementsystem.Repository.users.*;
import com.school.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.school.schoolmanagementsystem.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final ClassRoomRepository classRoomRepository;
    private final SubjectRepository subjectRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final ParentStudentRepository parentStudentRepository;

    @Override
    public AdminDashboardResponse getAdminDashboard() {
        return AdminDashboardResponse.builder()
                .totalStudents(userRepository.countByRoleAndDeletedFalse(Role.STUDENT))
                .totalTeachers(userRepository.countByRoleAndDeletedFalse(Role.TEACHER))
                .totalParents(userRepository.countByRoleAndDeletedFalse(Role.PARENT))
                .totalClasses(classRoomRepository.countByDeletedFalse())
                .totalSubjects(subjectRepository.count())
                .recentEnrollments(enrollmentRepository.countByEnrollmentDateAfter(LocalDate.now().minusDays(30)))
                .recentAssignments(assignmentRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(30)))
                .build();
    }

    @Override
    public TeacherDashboardResponse getTeacherDashboard(Long teacherId) {
        Teacher teacher = teacherRepository.findActiveById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));

        // Classes taught by this teacher (through ClassSubject or as class teacher)
        List<ClassRoom> classes = classRoomRepository.findByTeacherId(teacherId); // need this method

        long totalStudents = enrollmentRepository.countByClassIdsAndStatus(
                classes.stream().map(ClassRoom::getId).collect(Collectors.toList()),
                EnrollmentStatus.ACTIVE
        ); // need custom query

        long pendingGrading = submissionRepository.countByGradedByIsNullAndAssignmentTeacherId(teacherId); // need method

        long upcomingAssignments = assignmentRepository.countByTeacherIdAndDueDateBetween(
                teacherId, LocalDate.now(), LocalDate.now().plusDays(7)
        ); // need method

        List<ClassSummary> classSummaries = classes.stream()
                .map(c -> ClassSummary.builder()
                        .classId(c.getId())
                        .className(c.getName())
                        .studentCount((int) enrollmentRepository.countByClassRoomIdAndStatus(c.getId(), EnrollmentStatus.ACTIVE))
                        .pendingSubmissions((int) submissionRepository.countByAssignmentClassRoomIdAndGradeIsNull(c.getId()))
                        .build())
                .collect(Collectors.toList());

        return TeacherDashboardResponse.builder()
                .totalClasses(classes.size())
                .totalStudents(totalStudents)
                .pendingGrading(pendingGrading)
                .upcomingAssignments(upcomingAssignments)
                .classSummaries(classSummaries)
                .build();
    }

    @Override
    public StudentDashboardResponse getStudentDashboard(Long studentId) {
        Student student = studentRepository.findActiveById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        // Get current active enrollment
        Enrollment activeEnrollment = enrollmentRepository.findByStudentIdAndStatus(studentId, EnrollmentStatus.ACTIVE)
                .orElse(null);
        String className = activeEnrollment != null ? activeEnrollment.getClassRoom().getName() : "Not enrolled";

        // Attendance percentage for last 30 days
        double attendancePercentage = attendanceRepository.calculateAttendancePercentage(
                studentId, LocalDate.now().minusDays(30), LocalDate.now()
        ); // need custom query

        // Average grade
        Double avgGrade = submissionRepository.calculateAverageGradeByStudent(studentId); // need method

        // Pending assignments (not submitted)
        long pendingAssignments = assignmentRepository.countByClassRoomIdAndStudentNotSubmitted(
                activeEnrollment != null ? activeEnrollment.getClassRoom().getId() : null,
                studentId
        ); // need method

        // Upcoming assignments (due in next 7 days, not submitted)
        long upcomingAssignments = assignmentRepository.countByClassRoomIdAndDueDateBetweenAndStudentNotSubmitted(
                activeEnrollment != null ? activeEnrollment.getClassRoom().getId() : null,
                LocalDate.now(), LocalDate.now().plusDays(7), studentId
        );

        return StudentDashboardResponse.builder()
                .className(className)
                .attendancePercentage(attendancePercentage)
                .averageGrade(avgGrade != null ? avgGrade : 0.0)
                .pendingAssignments((int) pendingAssignments)
                .upcomingAssignments((int) upcomingAssignments)
                .build();
    }

    @Override
    public ParentDashboardResponse getParentDashboard(Long parentId) {
        Parent parent = parentRepository.findActiveById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found with id: " + parentId));

        List<Long> studentIds = parentStudentRepository.findStudentIdsByParentId(parentId);

        List<ChildSummary> children = studentIds.stream()
                .map(studentId -> {
                    // Similar to student dashboard but simplified
                    Student student = studentRepository.findActiveById(studentId).orElse(null);
                    if (student == null) return null;

                    Enrollment activeEnrollment = enrollmentRepository.findByStudentIdAndStatus(studentId, EnrollmentStatus.ACTIVE)
                            .orElse(null);

                    double attendance = attendanceRepository.calculateAttendancePercentage(
                            studentId, LocalDate.now().minusDays(30), LocalDate.now()
                    );

                    Double avgGrade = submissionRepository.calculateAverageGradeByStudent(studentId);

                    long pending = assignmentRepository.countByClassRoomIdAndStudentNotSubmitted(
                            activeEnrollment != null ? activeEnrollment.getClassRoom().getId() : null,
                            studentId
                    );

                    return ChildSummary.builder()
                            .studentId(studentId)
                            .studentName(student.getFirstName() + " " + student.getLastName())
                            .className(activeEnrollment != null ? activeEnrollment.getClassRoom().getName() : "Not enrolled")
                            .attendancePercentage(attendance)
                            .averageGrade(avgGrade != null ? avgGrade : 0.0)
                            .pendingAssignments((int) pending)
                            .build();
                })
                .filter(c -> c != null)
                .collect(Collectors.toList());

        return ParentDashboardResponse.builder()
                .children(children)
                .build();
    }
}