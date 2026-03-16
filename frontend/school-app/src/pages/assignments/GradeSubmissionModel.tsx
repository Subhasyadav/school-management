// // components/GradeSubmissionModal.tsx
// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import type { SubmissionResponse } from '../../types/assignment';
// import { useGradeSubmission } from '../../hooks/useAssignments';
// import Layout from '../../component/layout';
// // import { useGradeSubmission } from '../hooks/useAssignments';
// // import type { SubmissionResponse } from '../types/assignment';

// const gradeSchema = z.object({
//   grade: z.number({ required_error: 'Grade is required' }).min(0).max(100),
//   feedback: z.string().optional(),
// });

// type GradeFormData = z.infer<typeof gradeSchema>;

// interface Props {
//   submission: SubmissionResponse;
//   onClose: () => void;
//   onSaved: () => void;
// }

// const GradeSubmissionModal: React.FC<Props> = ({ submission, onClose, onSaved }) => {
//   const gradeMutation = useGradeSubmission(submission.id);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<GradeFormData>({
//     resolver: zodResolver(gradeSchema),
//     defaultValues: {
//       grade: submission.grade || 0,
//       feedback: submission.feedback || '',
//     },
//   });

//   const onSubmit = async (data: GradeFormData) => {
//     try {
//       await gradeMutation.mutateAsync(data);
//       onSaved();
//       onClose();
//     } catch (error) {
//       // error toast handled by mutation
//     }
//   };

//   return (
//     <Layout>
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
//         <h3 className="text-xl font-semibold mb-4">Grade Submission</h3>
//         <p className="mb-2"><span className="font-medium">Student:</span> {submission.studentName}</p>
//         <p className="mb-4"><span className="font-medium">Assignment:</span> {submission.assignmentTitle}</p>
//         <form onSubmit={handleSubmit(onSubmit)} noValidate>
//           <div className="mb-4">
//             <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
//               Grade (0-100)
//             </label>
//             <input
//               id="grade"
//               type="number"
//               step="0.1"
//               {...register('grade', { valueAsNumber: true })}
//               className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//                 errors.grade ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>}
//           </div>
//           <div className="mb-4">
//             <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
//               Feedback
//             </label>
//             <textarea
//               id="feedback"
//               rows={4}
//               {...register('feedback')}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
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
//               {isSubmitting ? 'Saving...' : 'Save Grade'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//     </Layout>
//   );
// };

// export default GradeSubmissionModal;



// components/GradeSubmissionModal.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { SubmissionResponse } from '../../types/assignment';
import { useGradeSubmission } from '../../hooks/useAssignments';

const gradeSchema = z.object({
  grade: z.number({ required_error: 'Grade is required' }).min(0).max(100),
  letterGrade: z.string().optional(),
  gradeType: z.enum(['PERCENTAGE', 'LETTER', 'PASS_FAIL']).optional(),
  feedback: z.string().optional(),
});

type GradeFormData = z.infer<typeof gradeSchema>;

interface Props {
  submission: SubmissionResponse;
  onClose: () => void;
  onSaved: () => void;
}

const GradeSubmissionModal: React.FC<Props> = ({ submission, onClose, onSaved }) => {
  const gradeMutation = useGradeSubmission(submission.id);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      grade: submission.grade || 0,
      letterGrade: submission.letterGrade || '',
      gradeType: (submission.gradeType as any) || 'PERCENTAGE',
      feedback: submission.feedback || '',
    },
  });

  const onSubmit = async (data: GradeFormData) => {
    try {
      await gradeMutation.mutateAsync(data);
      onSaved();
      onClose();
    } catch (error) {
      // error toast handled by mutation
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold mb-4">Grade Submission</h3>
        <p className="mb-2"><span className="font-medium">Student:</span> {submission.studentName}</p>
        <p className="mb-4"><span className="font-medium">Assignment:</span> {submission.assignmentTitle}</p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
              Grade (0-100)
            </label>
            <input
              id="grade"
              type="number"
              step="0.1"
              {...register('grade', { valueAsNumber: true })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.grade ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="gradeType" className="block text-sm font-medium text-gray-700 mb-1">
              Grade Type
            </label>
            <select
              id="gradeType"
              {...register('gradeType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="LETTER">Letter Grade (A, B, etc.)</option>
              <option value="PASS_FAIL">Pass/Fail</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="letterGrade" className="block text-sm font-medium text-gray-700 mb-1">
              Letter Grade (optional)
            </label>
            <input
              id="letterGrade"
              type="text"
              {...register('letterGrade')}
              placeholder="e.g., A, B+, Pass"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
              Feedback
            </label>
            <textarea
              id="feedback"
              rows={4}
              {...register('feedback')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2">
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
              {isSubmitting ? 'Saving...' : 'Save Grade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeSubmissionModal;