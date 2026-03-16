// import React, { useState, useEffect } from 'react';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import toast from 'react-hot-toast';
// import type { ClassRoomResponse, StudentResponse, SubjectResponse } from '../../types/class';
// import { useMarkBulkAttendance } from '../../hooks/useAttendance';
// import { classService } from '../../api/class';

// const statusOptions = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const;

// const bulkSchema = z.object({
//   classId: z.number({ required_error: 'Class is required' }).positive(),
//   date: z.string().min(1, 'Date is required'),
//   records: z.array(
//     z.object({
//       studentId: z.number(),
//       subjectId: z.number(),
//       status: z.enum(statusOptions),
//       remarks: z.string().optional(),
//     })
//   ),
// });

// type BulkFormData = z.infer<typeof bulkSchema>;

// interface Props {
//   onClose: () => void;
//   onSaved: () => void;
// }

// const MarkAttendanceModal: React.FC<Props> = ({ onClose, onSaved }) => {
//   const [classes, setClasses] = useState<ClassRoomResponse[]>([]);
//   const [students, setStudents] = useState<StudentResponse[]>([]);
//   const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
//   const [loading, setLoading] = useState(false);
//   const bulkMutation = useMarkBulkAttendance();

//   const {
//     register,
//     handleSubmit,
//     control,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm<BulkFormData>({
//     resolver: zodResolver(bulkSchema),
//     defaultValues: {
//       classId: undefined,
//       date: '',
//       records: [],
//     },
//   });

//   const { fields, replace } = useFieldArray({ control, name: 'records' });

//   const selectedClassId = watch('classId');
//   const selectedDate = watch('date');

//   useEffect(() => {
//     classService.getAll(0, 100)
//       .then((res) => setClasses(res.data.content))
//       .catch(() => toast.error('Failed to load classes'));
//   }, []);

//   useEffect(() => {
//     if (selectedClassId) {
//       setLoading(true);
//       Promise.all([
//         classService.getStudents(selectedClassId, 0, 100),
//         classService.getSubjects(selectedClassId)
//       ])
//         .then(([studentsRes, subjectsRes]) => {
//           setStudents(studentsRes.data.content);
//           // Map the response to SubjectResponse
//           const subjectList: SubjectResponse[] = subjectsRes.data.content.map((item: any) => ({
//             id: item.id,
//             name: item.name,
//             code: item.code,
//           }));
//           setSubjects(subjectList);
//           const initialRecords = studentsRes.data.content.map((s) => ({
//             studentId: s.id,
//             subjectId: subjectList[0]?.id || 0,
//             status: 'PRESENT' as const,
//             remarks: '',
//           }));
//           replace(initialRecords);
//         })
//         .catch(() => toast.error('Failed to load data'))
//         .finally(() => setLoading(false));
//     } else {
//       setStudents([]);
//       setSubjects([]);
//       replace([]);
//     }
//   }, [selectedClassId, replace]);

//   const onSubmit = async (data: BulkFormData) => {
//     try {
//       await bulkMutation.mutateAsync(data);
//       onSaved();
//       onClose();
//     } catch (error) {
//       // error toast handled by mutation
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
//       <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
//         <h3 className="text-xl font-semibold mb-4">Mark Attendance</h3>
//         <form onSubmit={handleSubmit(onSubmit)} noValidate>
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div>
//               <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
//               <select
//                 id="classId"
//                 {...register('classId', { valueAsNumber: true })}
//                 className={`w-full px-3 py-2 border rounded-md ${errors.classId ? 'border-red-500' : 'border-gray-300'}`}
//               >
//                 <option value="">Select a class</option>
//                 {classes.map((c) => (
//                   <option key={c.id} value={c.id}>{c.name}</option>
//                 ))}
//               </select>
//               {errors.classId && <p className="text-red-600 text-sm mt-1">{errors.classId.message}</p>}
//             </div>
//             <div>
//               <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//               <input
//                 id="date"
//                 type="date"
//                 {...register('date')}
//                 className={`w-full px-3 py-2 border rounded-md ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
//             </div>
//           </div>

//           {loading && <p className="text-center py-4">Loading students and subjects...</p>}

//           {!loading && students.length > 0 && subjects.length > 0 && (
//             <div className="space-y-2 max-h-96 overflow-y-auto border rounded-md p-2">
//               <div className="flex font-medium text-sm text-gray-700 p-2">
//                 <span className="w-1/4">Student</span>
//                 <span className="w-1/4">Subject</span>
//                 <span className="w-1/4">Status</span>
//                 <span className="w-1/4">Remarks</span>
//               </div>
//               {fields.map((field, index) => (
//                 <div key={field.id} className="flex items-center gap-2 p-2 border-b">
//                   <span className="w-1/4 text-sm">{students[index]?.firstName} {students[index]?.lastName}</span>
//                   <select
//                     {...register(`records.${index}.subjectId`, { valueAsNumber: true })}
//                     className="w-1/4 px-2 py-1 border rounded text-sm"
//                   >
//                     {subjects.map(sub => (
//                       <option key={sub.id} value={sub.id}>{sub.name}</option>
//                     ))}
//                   </select>
//                   <select
//                     {...register(`records.${index}.status`)}
//                     className="w-1/4 px-2 py-1 border rounded text-sm"
//                   >
//                     {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
//                   </select>
//                   <input
//                     type="text"
//                     placeholder="Remarks"
//                     {...register(`records.${index}.remarks`)}
//                     className="w-1/4 px-2 py-1 border rounded text-sm"
//                   />
//                 </div>
//               ))}
//             </div>
//           )}

//           {!loading && students.length > 0 && subjects.length === 0 && (
//             <p className="text-center text-red-500">No subjects found for this class.</p>
//           )}

//           <div className="flex justify-end gap-2 mt-4">
//             <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 border rounded">
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting || !selectedClassId || !selectedDate || students.length === 0 || subjects.length === 0}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//             >
//               {isSubmitting ? 'Saving...' : 'Save Attendance'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MarkAttendanceModal;

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import type {
  ClassRoomResponse,
  StudentResponse,
  SubjectResponse,
} from "../../types/class";
import { useMarkBulkAttendance } from "../../hooks/useAttendance";
import { classService } from "../../api/class";

const statusOptions = ["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const;

const bulkSchema = z.object({
  classId: z.number({ required_error: "Class is required" }).positive(),
  date: z.string().min(1, "Date is required"),
  records: z.array(
    z.object({
      studentId: z.number(),
      subjectId: z.number(),
      status: z.enum(statusOptions),
      remarks: z.string().optional(),
    }),
  ),
});

type BulkFormData = z.infer<typeof bulkSchema>;

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const MarkAttendanceModal: React.FC<Props> = ({ onClose, onSaved }) => {
  const [classes, setClasses] = useState<ClassRoomResponse[]>([]);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const bulkMutation = useMarkBulkAttendance();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BulkFormData>({
    resolver: zodResolver(bulkSchema),
    defaultValues: {
      classId: undefined,
      date: "",
      records: [],
    },
  });

  const { fields, replace } = useFieldArray({ control, name: "records" });

  const selectedClassId = watch("classId");
  const selectedDate = watch("date");

  // Load classes on mount
  useEffect(() => {
    classService
      .getAll(0, 100)
      .then((res) => setClasses(res.data.content))
      .catch(() => toast.error("Failed to load classes"));
  }, []);

  // Load students and subjects when a class is selected
  useEffect(() => {
  if (selectedClassId) {
    setLoading(true);
    Promise.all([
      classService.getStudents(selectedClassId, 0, 100),
      classService.getSubjects(selectedClassId)
    ])
      .then(([studentsRes, subjectsRes]) => {
        console.log('Students response:', studentsRes.data);
        console.log('Subjects response:', subjectsRes.data);

        setStudents(studentsRes.data.content);

        // Extract subject array from the response – handle both paginated and non-paginated
        let rawSubjects: any[] = [];
        if (subjectsRes.data.content) {
          rawSubjects = subjectsRes.data.content;
        } else if (Array.isArray(subjectsRes.data)) {
          rawSubjects = subjectsRes.data;
        }

        // Map the nested subject structure to SubjectResponse
        const subjectList: SubjectResponse[] = rawSubjects.map((item: any) => {
          // If the item has a 'subject' property, use that; otherwise assume it's already a subject
          const subjectData = item.subject || item;
          return {
            id: subjectData.id,
            name: subjectData.name,
            code: subjectData.code || '',
          };
        });
        setSubjects(subjectList);

        // Initialize records with the first subject (if any)
        const initialRecords = studentsRes.data.content.map((s) => ({
          studentId: s.id,
          subjectId: subjectList[0]?.id || 0,
          status: 'PRESENT' as const,
          remarks: '',
        }));
        replace(initialRecords);
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        toast.error('Failed to load students or subjects');
      })
      .finally(() => setLoading(false));
  } else {
    setStudents([]);
    setSubjects([]);
    replace([]);
  }
}, [selectedClassId, replace]);

  const onSubmit = async (data: BulkFormData) => {
    try {
      await bulkMutation.mutateAsync(data);
      onSaved();
      onClose();
    } catch (error) {
      // error toast handled by mutation
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">Mark Attendance</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="classId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Class
              </label>
              <select
                id="classId"
                {...register("classId", { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-md ${errors.classId ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select a class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.classId && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.classId.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                {...register("date")}
                className={`w-full px-3 py-2 border rounded-md ${errors.date ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.date && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          {loading && (
            <p className="text-center py-4">Loading students and subjects...</p>
          )}

          {!loading && students.length > 0 && subjects.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto border rounded-md p-2">
              <div className="flex font-medium text-sm text-gray-700 p-2">
                <span className="w-1/4">Student</span>
                <span className="w-1/4">Subject</span>
                <span className="w-1/4">Status</span>
                <span className="w-1/4">Remarks</span>
              </div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-2 p-2 border-b"
                >
                  <span className="w-1/4 text-sm">
                    {students[index]?.firstName} {students[index]?.lastName}
                  </span>
                  <select
                    {...register(`records.${index}.subjectId`, {
                      valueAsNumber: true,
                    })}
                    className="w-1/4 px-2 py-1 border rounded text-sm"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <select
                    {...register(`records.${index}.status`)}
                    className="w-1/4 px-2 py-1 border rounded text-sm"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Remarks"
                    {...register(`records.${index}.remarks`)}
                    className="w-1/4 px-2 py-1 border rounded text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {!loading && students.length > 0 && subjects.length === 0 && (
            <p className="text-center text-red-500">
              No subjects found for this class.
            </p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !selectedClassId ||
                !selectedDate ||
                students.length === 0 ||
                subjects.length === 0
              }
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkAttendanceModal;
