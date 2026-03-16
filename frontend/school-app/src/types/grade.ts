// types/grade.ts

export interface GradeResponse {
  id: number;
  studentId: number;
  studentName: string;
  subjectId: number;
  subjectName: string;
  classId: number;
  className: string;
  examName: string;
  examDate: string;          // ISO date string
  marksObtained: number;
  maxMarks: number;
  gradeLetter: string;
  remarks: string;
  enteredBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GradeCreateRequest {
  studentId: number;
  subjectId: number;
  classId: number;
  examName: string;
  examDate: string;
  marksObtained: number;
  maxMarks: number;
  gradeLetter?: string;
  remarks?: string;
}

export interface GradeUpdateRequest {
  examName?: string;
  examDate?: string;
  marksObtained?: number;
  maxMarks?: number;
  gradeLetter?: string;
  remarks?: string;
}

// Used for filtering GET /grades
export interface GradeFilterParams {
  classId?: number;
  subjectId?: number;
  studentId?: number;
  className?: string | undefined;
}