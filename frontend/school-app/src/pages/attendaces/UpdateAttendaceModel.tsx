import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AttendanceResponse, AttendanceStatus } from '../../types/attendance';
import { useUpdateAttendance } from '../../hooks/useAttendance';

const statusOptions: AttendanceStatus[] = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];

const updateSchema = z.object({
  status: z.enum(statusOptions as [string, ...string[]]).optional(),
  remarks: z.string().optional(),
});

type UpdateFormData = z.infer<typeof updateSchema>;

interface Props {
  attendance: AttendanceResponse;
  onClose: () => void;
  onSaved: () => void;
}

const UpdateAttendanceModal: React.FC<Props> = ({ attendance, onClose, onSaved }) => {
  const updateMutation = useUpdateAttendance();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      status: attendance.status,
      remarks: attendance.remarks || '',
    },
  });

  const onSubmit = async (data: UpdateFormData) => {
    try {
      // ✅ Cast status to AttendanceStatus
      const payload = {
        status: data.status as AttendanceStatus,
        remarks: data.remarks,
      };
      await updateMutation.mutateAsync({ id: attendance.id, data: payload });
      onSaved();
      onClose();
    } catch (error) {
      // error toast handled by mutation
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold mb-4">Edit Attendance</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <p className="px-3 py-2 bg-gray-50 rounded-md">{attendance.studentName}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <p className="px-3 py-2 bg-gray-50 rounded-md">{attendance.subjectName || '-'}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <p className="px-3 py-2 bg-gray-50 rounded-md">{attendance.date}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              {...register('status')}
              className={`w-full px-3 py-2 border rounded-md ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              id="remarks"
              {...register('remarks')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAttendanceModal;