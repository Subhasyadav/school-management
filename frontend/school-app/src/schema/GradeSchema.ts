// schemas/gradeSchema.ts
import { z } from 'zod';

export const gradeFormSchema = z.object({
  studentId: z.number({ required_error: 'Student ID is required' }).positive(),
  subjectId: z.number({ required_error: 'Subject ID is required' }).positive(),
  classId: z.number({ required_error: 'Class ID is required' }).positive(),
  examName: z.string().min(1, 'Exam name is required'),
  examDate: z.string().min(1, 'Exam date is required'),
  marksObtained: z.number({ required_error: 'Marks obtained is required' })
    .min(0, 'Marks must be ≥ 0'),
  maxMarks: z.number({ required_error: 'Max marks is required' })
    .min(1, 'Max marks must be ≥ 1'),
  gradeLetter: z.string().optional(),
  remarks: z.string().optional(),
}).refine(data => data.marksObtained <= data.maxMarks, {
  message: 'Marks obtained cannot exceed maximum marks',
  path: ['marksObtained'],
});

export type GradeFormData = z.infer<typeof gradeFormSchema>;