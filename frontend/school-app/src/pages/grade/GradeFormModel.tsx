// components/GradeFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { GradeResponse } from '../../types/grade';
import { useCreateGrade, useUpdateGrade } from '../../hooks/useGrade';
import { gradeFormSchema, type GradeFormData } from '../../schema/GradeSchema';
import Layout from '../../component/layout';
// import { gradeFormSchema, type GradeFormData } from '../schemas/gradeSchema';
// import type { GradeResponse } from '../types/grade';
// import { useCreateGrade, useUpdateGrade } from '../hooks/useGrades';

interface Props {
  grade: GradeResponse | null;
  onClose: () => void;
  onSaved: () => void;
}

const GradeFormModal: React.FC<Props> = ({ grade, onClose, onSaved }) => {
  const isEdit = !!grade;
  const createMutation = useCreateGrade();
  const updateMutation = useUpdateGrade();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      studentId: grade?.studentId || 0,
      subjectId: grade?.subjectId || 0,
      classId: grade?.classId || 0,
      examName: grade?.examName || '',
      examDate: grade?.examDate ? grade.examDate.slice(0, 10) : '',
      marksObtained: grade?.marksObtained || 0,
      maxMarks: grade?.maxMarks || 100,
      gradeLetter: grade?.gradeLetter || '',
      remarks: grade?.remarks || '',
    },
  });

  useEffect(() => {
    if (grade) {
      reset({
        studentId: grade.studentId,
        subjectId: grade.subjectId,
        classId: grade.classId,
        examName: grade.examName,
        examDate: grade.examDate.slice(0, 10),
        marksObtained: grade.marksObtained,
        maxMarks: grade.maxMarks,
        gradeLetter: grade.gradeLetter,
        remarks: grade.remarks,
      });
    }
  }, [grade, reset]);

  const onSubmit = async (data: GradeFormData) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: grade.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSaved();
      onClose();
    } catch (error) {
      // error toast handled by mutation
    }
  };

  return (
    <Layout>
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">
          {isEdit ? 'Edit Grade' : 'Create Grade'}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Student ID */}
          <div className="mb-4">
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              id="studentId"
              type="number"
              {...register('studentId', { valueAsNumber: true })}
              disabled={isEdit}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.studentId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.studentId && (
              <p className="mt-1 text-sm text-red-600">{errors.studentId.message}</p>
            )}
          </div>

          {/* Subject ID */}
          <div className="mb-4">
            <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-1">
              Subject ID
            </label>
            <input
              id="subjectId"
              type="number"
              {...register('subjectId', { valueAsNumber: true })}
              disabled={isEdit}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.subjectId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.subjectId && (
              <p className="mt-1 text-sm text-red-600">{errors.subjectId.message}</p>
            )}
          </div>

          {/* Class ID */}
          <div className="mb-4">
            <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
              Class ID
            </label>
            <input
              id="classId"
              type="number"
              {...register('classId', { valueAsNumber: true })}
              disabled={isEdit}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.classId ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.classId && (
              <p className="mt-1 text-sm text-red-600">{errors.classId.message}</p>
            )}
          </div>

          {/* Exam Name */}
          <div className="mb-4">
            <label htmlFor="examName" className="block text-sm font-medium text-gray-700 mb-1">
              Exam Name
            </label>
            <input
              id="examName"
              type="text"
              {...register('examName')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.examName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.examName && (
              <p className="mt-1 text-sm text-red-600">{errors.examName.message}</p>
            )}
          </div>

          {/* Exam Date */}
          <div className="mb-4">
            <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-1">
              Exam Date
            </label>
            <input
              id="examDate"
              type="date"
              {...register('examDate')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.examDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.examDate && (
              <p className="mt-1 text-sm text-red-600">{errors.examDate.message}</p>
            )}
          </div>

          {/* Marks Obtained */}
          <div className="mb-4">
            <label htmlFor="marksObtained" className="block text-sm font-medium text-gray-700 mb-1">
              Marks Obtained
            </label>
            <input
              id="marksObtained"
              type="number"
              step="0.01"
              {...register('marksObtained', { valueAsNumber: true })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.marksObtained ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.marksObtained && (
              <p className="mt-1 text-sm text-red-600">{errors.marksObtained.message}</p>
            )}
          </div>

          {/* Max Marks */}
          <div className="mb-4">
            <label htmlFor="maxMarks" className="block text-sm font-medium text-gray-700 mb-1">
              Max Marks
            </label>
            <input
              id="maxMarks"
              type="number"
              step="0.01"
              {...register('maxMarks', { valueAsNumber: true })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.maxMarks ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.maxMarks && (
              <p className="mt-1 text-sm text-red-600">{errors.maxMarks.message}</p>
            )}
          </div>

          {/* Grade Letter */}
          <div className="mb-4">
            <label htmlFor="gradeLetter" className="block text-sm font-medium text-gray-700 mb-1">
              Grade Letter
            </label>
            <input
              id="gradeLetter"
              type="text"
              {...register('gradeLetter')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Remarks */}
          <div className="mb-4">
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              id="remarks"
              {...register('remarks')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Layout>
  );
};

export default GradeFormModal;