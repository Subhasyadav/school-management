import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTeachers } from '../../hooks/useTeacher';
import { useMarkTeacherAttendance } from '../../hooks/useTeacherAttendance';
import type { LeaveType } from '../../types/leaveType';

const leaveTypeOptions: LeaveType[] = ['VACATION', 'SICK_LEAVE', 'PUBLIC_HOLIDAY', 'OTHER'];

const bulkSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  records: z.array(
    z.object({
      teacherId: z.number(),
      leaveType: z.enum(leaveTypeOptions as [string, ...string[]]),
      remarks: z.string().optional(),
    })
  ),
});

type BulkFormData = z.infer<typeof bulkSchema>;

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const MarkTeacherAttendanceModal: React.FC<Props> = ({ onClose, onSaved }) => {
  const { data: teachersData, isLoading: loadingTeachers } = useTeachers(0, 100);
  const teachers = teachersData?.content || [];
  const markMutation = useMarkTeacherAttendance();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BulkFormData>({
    resolver: zodResolver(bulkSchema),
    defaultValues: {
      date: '',
      records: [],
    },
  });

  const { fields, replace } = useFieldArray({ control, name: 'records' });

  useEffect(() => {
    if (teachers.length > 0) {
      const initialRecords = teachers.map(t => ({
        teacherId: t.id,
        leaveType: 'VACATION' as LeaveType,
        remarks: '',
      }));
      replace(initialRecords);
    }
  }, [teachers, replace]);

  const onSubmit = async (data: BulkFormData) => {
    try {
      await markMutation.mutateAsync(data as any);
      onSaved();
      onClose();
    } catch (error) {
      // handled by mutation
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold mb-4">Mark Teacher Attendance</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className={`w-full px-3 py-2 border rounded-md ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
          </div>

          {loadingTeachers && <p>Loading teachers...</p>}

          {!loadingTeachers && teachers.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto border rounded-md p-2">
              <div className="flex font-medium text-sm text-gray-700 p-2">
                <span className="w-1/3">Teacher</span>
                <span className="w-1/3">Leave Type</span>
                <span className="w-1/3">Remarks</span>
              </div>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 p-2 border-b">
                  <span className="w-1/3 text-sm">{teachers[index]?.firstName} {teachers[index]?.lastName}</span>
                  <select
                    {...register(`records.${index}.leaveType`)}
                    className="w-1/3 px-2 py-1 border rounded text-sm"
                  >
                    {leaveTypeOptions.map(lt => (
                      <option key={lt} value={lt}>{lt}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Remarks"
                    {...register(`records.${index}.remarks`)}
                    className="w-1/3 px-2 py-1 border rounded text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded">
              {isSubmitting ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkTeacherAttendanceModal;