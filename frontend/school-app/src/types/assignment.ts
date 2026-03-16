// types/assignment.ts
export interface AssignmentResponse {
  id: number;
  title: string;
  description: string;
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  dueDate: string; // YYYY-MM-DD
  attachmentUrl?: string;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
  // New fields
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishDate?: string; // ISO datetime
  allowLateSubmission: boolean;
  latePenaltyPercent: number;
  anonymousGrading: boolean;
  deleted: boolean;
}

export interface SubmissionResponse {
  id: number;
  assignmentId: number;
  assignmentTitle: string;
  studentId: number;
  studentName: string;
  submissionDate: string; // ISO datetime
  fileUrl: string;
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  createdAt: string;
  updatedAt: string;
  // New fields
  late: boolean;
  version: number;
  letterGrade?: string;
  gradeType?: string; // "PERCENTAGE", "LETTER", "PASS_FAIL"
}

// Request DTOs
export interface AssignmentCreateRequest {
  title: string;
  description?: string;
  classId: number;
  subjectId: number;
  dueDate: string;
  attachment?: File;
  // New optional fields
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishDate?: string;
  allowLateSubmission?: boolean;
  latePenaltyPercent?: number;
  anonymousGrading?: boolean;
}

export interface AssignmentUpdateRequest {
  title?: string;
  description?: string;
  classId?: number;
  subjectId?: number;
  dueDate?: string;
  attachment?: File;
  // New optional fields
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishDate?: string;
  allowLateSubmission?: boolean;
  latePenaltyPercent?: number;
  anonymousGrading?: boolean;
}

export interface SubmissionRequest {
  file: File;
}

export interface GradeSubmissionRequest {
  grade: number;
  feedback?: string;
  // New fields
  letterGrade?: string;
  gradeType?: string; // "PERCENTAGE", "LETTER", "PASS_FAIL"
}