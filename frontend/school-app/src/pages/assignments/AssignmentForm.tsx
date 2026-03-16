
// // components/AssignmentFormModal.tsx
// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import toast from 'react-hot-toast';
// import type { AssignmentResponse } from '../../types/assignment';
// import { useCreateAssignment, useUpdateAssignment } from '../../hooks/useAssignments';
// import type { ClassRoomResponse, SubjectResponse } from '../../types/class';
// import { classService } from '../../api/class';
// import subjectService from '../../api/subject';
// import { getFullUrl } from '../../utils/url'; // import URL helper

// const assignmentSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().optional(),
//   classId: z.number({ required_error: 'Class is required' }).positive(),
//   subjectId: z.number({ required_error: 'Subject is required' }).positive(),
//   dueDate: z.string().min(1, 'Due date is required'),
//   attachment: z.instanceof(File).optional(),
// });

// type AssignmentFormData = z.infer<typeof assignmentSchema>;

// interface Props {
//   assignment?: AssignmentResponse;
//   onClose: () => void;
//   onSaved: () => void;
// }

// const AssignmentFormModal: React.FC<Props> = ({ assignment, onClose, onSaved }) => {
//   const isEdit = !!assignment;
//   const createMutation = useCreateAssignment();
//   const updateMutation = useUpdateAssignment();

//   const [classes, setClasses] = useState<ClassRoomResponse[]>([]);
//   const [subjects, setSubjects] = useState<SubjectResponse[]>([]);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//   } = useForm<AssignmentFormData>({
//     resolver: zodResolver(assignmentSchema),
//     defaultValues: {
//       title: assignment?.title || '',
//       description: assignment?.description || '',
//       classId: assignment?.classId,
//       subjectId: assignment?.subjectId,
//       dueDate: assignment?.dueDate || '',
//       attachment: undefined,
//     },
//   });

//   useEffect(() => {
//     Promise.all([
//       classService.getAll(0, 100).then((res: { data: { content: ClassRoomResponse[] } }) =>
//         setClasses(res.data.content)
//       ),
//       subjectService.getAllSubjects(0, 100).then((res: { data: { content: SubjectResponse[] } }) =>
//         setSubjects(res.data.content)
//       ),
//     ]).catch(() => toast.error('Failed to load classes/subjects'));
//   }, []);

//   const onSubmit = async (data: AssignmentFormData) => {
//     try {
//       if (isEdit) {
//         await updateMutation.mutateAsync({ id: assignment.id, data });
//       } else {
//         await createMutation.mutateAsync(data);
//       }
//       onSaved();
//       onClose();
//     } catch (error) {
//       // error toast handled by mutation
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) setValue('attachment', file);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
//       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
//         <h3 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Assignment' : 'Create Assignment'}</h3>
//         <form onSubmit={handleSubmit(onSubmit)} noValidate>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="mb-4 col-span-2">
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                 Title
//               </label>
//               <input
//                 id="title"
//                 type="text"
//                 {...register('title')}
//                 className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.title ? 'border-red-500' : 'border-gray-300'
//                 }`}
//               />
//               {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
//             </div>

//             <div className="mb-4 col-span-2">
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 rows={4}
//                 {...register('description')}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
//                 Class
//               </label>
//               <select
//                 id="classId"
//                 {...register('classId', { valueAsNumber: true })}
//                 className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.classId ? 'border-red-500' : 'border-gray-300'
//                 }`}
//               >
//                 <option value="">Select class</option>
//                 {classes.map((c) => (
//                   <option key={c.id} value={c.id}>{c.name}</option>
//                 ))}
//               </select>
//               {errors.classId && <p className="mt-1 text-sm text-red-600">{errors.classId.message}</p>}
//             </div>

//             <div className="mb-4">
//               <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-1">
//                 Subject
//               </label>
//               <select
//                 id="subjectId"
//                 {...register('subjectId', { valueAsNumber: true })}
//                 className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.subjectId ? 'border-red-500' : 'border-gray-300'
//                 }`}
//               >
//                 <option value="">Select subject</option>
//                 {subjects.map((s) => (
//                   <option key={s.id} value={s.id}>{s.name}</option>
//                 ))}
//               </select>
//               {errors.subjectId && <p className="mt-1 text-sm text-red-600">{errors.subjectId.message}</p>}
//             </div>

//             <div className="mb-4 col-span-2">
//               <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
//                 Due Date
//               </label>
//               <input
//                 id="dueDate"
//                 type="date"
//                 {...register('dueDate')}
//                 className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.dueDate ? 'border-red-500' : 'border-gray-300'
//                 }`}
//               />
//               {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
//             </div>

//             <div className="mb-4 col-span-2">
//               <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">
//                 Attachment (optional)
//               </label>
//               <input
//                 id="attachment"
//                 type="file"
//                 onChange={handleFileChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               />
//               {assignment?.attachmentUrl && (
//                 <p className="mt-1 text-sm text-gray-600">
//                   Current file:{" "}
//                   <a
//                     href={getFullUrl(assignment.attachmentUrl)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline"
//                   >
//                     View
//                   </a>
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//             >
//               {isSubmitting ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AssignmentFormModal;



// components/AssignmentFormModal.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import type { AssignmentResponse } from '../../types/assignment';
import { useCreateAssignment, useUpdateAssignment } from '../../hooks/useAssignments';
import type { ClassRoomResponse, SubjectResponse } from '../../types/class';
import { classService } from '../../api/class';
import subjectService from '../../api/subject';
import { getFullUrl } from '../../utils/url';

// Extended schema with new fields
const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  classId: z.number({ required_error: 'Class is required' }).positive(),
  subjectId: z.number({ required_error: 'Subject is required' }).positive(),
  dueDate: z.string().min(1, 'Due date is required'),
  attachment: z.instanceof(File).optional(),
  // New fields (all optional)
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  publishDate: z.string().optional(),
  allowLateSubmission: z.boolean().optional(),
  latePenaltyPercent: z.number().min(0).max(100).optional(),
  anonymousGrading: z.boolean().optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface Props {
  assignment?: AssignmentResponse;
  onClose: () => void;
  onSaved: () => void;
}

const AssignmentFormModal: React.FC<Props> = ({ assignment, onClose, onSaved }) => {
  const isEdit = !!assignment;
  const createMutation = useCreateAssignment();
  const updateMutation = useUpdateAssignment();

  const [classes, setClasses] = useState<ClassRoomResponse[]>([]);
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: assignment?.title || '',
      description: assignment?.description || '',
      classId: assignment?.classId,
      subjectId: assignment?.subjectId,
      dueDate: assignment?.dueDate || '',
      attachment: undefined,
      // New fields
      status: assignment?.status || 'DRAFT',
      publishDate: assignment?.publishDate || '',
      allowLateSubmission: assignment?.allowLateSubmission ?? false,
      latePenaltyPercent: assignment?.latePenaltyPercent ?? 0,
      anonymousGrading: assignment?.anonymousGrading ?? false,
    },
  });

  useEffect(() => {
    Promise.all([
      classService.getAll(0, 100).then((res: { data: { content: ClassRoomResponse[] } }) =>
        setClasses(res.data.content)
      ),
      subjectService.getAllSubjects(0, 100).then((res: { data: { content: SubjectResponse[] } }) =>
        setSubjects(res.data.content)
      ),
    ]).catch(() => toast.error('Failed to load classes/subjects'));
  }, []);

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: assignment.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSaved();
      onClose();
    } catch (error) {
      // error toast handled by mutation
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setValue('attachment', file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Assignment' : 'Create Assignment'}</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div className="mb-4 col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                {...register('title')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="mb-4 col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Class */}
            <div className="mb-4">
              <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                id="classId"
                {...register('classId', { 
                  setValueAs: (v) => v === '' ? undefined : Number(v) 
                })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.classId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.classId && <p className="mt-1 text-sm text-red-600">{errors.classId.message}</p>}
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subjectId"
                {...register('subjectId', { 
                  setValueAs: (v) => v === '' ? undefined : Number(v) 
                })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.subjectId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {errors.subjectId && <p className="mt-1 text-sm text-red-600">{errors.subjectId.message}</p>}
            </div>

            {/* Due Date */}
            <div className="mb-4 col-span-2">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                {...register('dueDate')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
            </div>

            {/* Attachment */}
            <div className="mb-4 col-span-2">
              <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">
                Attachment (optional)
              </label>
              <input
                id="attachment"
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {assignment?.attachmentUrl && (
                <p className="mt-1 text-sm text-gray-600">
                  Current file:{" "}
                  <a
                    href={getFullUrl(assignment.attachmentUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </p>
              )}
            </div>

            {/* Advanced Options Toggle */}
            <div className="col-span-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </button>
            </div>

            {/* Advanced Options (collapsible) */}
            {showAdvanced && (
              <>
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Publish Date (optional)
                  </label>
                  <input
                    id="publishDate"
                    type="datetime-local"
                    {...register('publishDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mb-4 flex items-center">
                  <input
                    id="allowLateSubmission"
                    type="checkbox"
                    {...register('allowLateSubmission')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowLateSubmission" className="ml-2 block text-sm text-gray-900">
                    Allow Late Submissions
                  </label>
                </div>

                {watch('allowLateSubmission') && (
                  <div className="mb-4">
                    <label htmlFor="latePenaltyPercent" className="block text-sm font-medium text-gray-700 mb-1">
                      Late Penalty (%) 
                    </label>
                    <input
                      id="latePenaltyPercent"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      {...register('latePenaltyPercent', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div className="mb-4 flex items-center">
                  <input
                    id="anonymousGrading"
                    type="checkbox"
                    {...register('anonymousGrading')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymousGrading" className="ml-2 block text-sm text-gray-900">
                    Anonymous Grading
                  </label>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentFormModal;