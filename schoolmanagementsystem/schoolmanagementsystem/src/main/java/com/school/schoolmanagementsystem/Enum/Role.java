package com.school.schoolmanagementsystem.Enum;

public enum Role {
    ADMIN, TEACHER, STUDENT, PARENT
}


//package com.school.schoolmanagementsystem.Enum;
//
//public enum Role {
//    // System-level roles
//    SUPER_ADMIN,      // Manages multiple schools/tenants, global configuration
//
//    // School-level administrative roles
//    ADMIN,            // Full CRUD for a single school (classes, users, subjects)
//    PRINCIPAL,        // Oversight of academic programs, can view all classes/teachers
//    VICE_PRINCIPAL,   // Assists principal, may have limited admin rights
//
//    // Academic staff
//    TEACHER,          // Core teaching staff
//    HEAD_OF_DEPARTMENT, // Manages teachers and curriculum for a department
//    SUBJECT_COORDINATOR, // Coordinates a specific subject across classes
//
//    // Students and parents
//    STUDENT,          // Learners
//    PARENT,           // Guardians of students
//
//    // Administrative support
//    ACCOUNTANT,       // Manages fees, invoices, financial reports
//    LIBRARIAN,        // Manages library resources
//    COUNSELOR,        // Student guidance and counseling
//    ADMIN_ASSISTANT,  // Supports administrative tasks (admissions, records)
//
//    // Extracurricular / support
//    COACH,            // Sports or activities coach
//    NURSE,            // School nurse (health records)
//
//    // IT & operations
//    IT_SUPPORT,       // Technical support, system maintenance
//    SECURITY,         // Campus security personnel
//
//    // External stakeholders
//    AUDITOR,          // External auditor (read-only access)
//    GUEST             // Limited temporary access (e.g., for events)
//}