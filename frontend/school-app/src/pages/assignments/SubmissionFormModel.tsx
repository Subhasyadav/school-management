// // components/SubmissionFormModal.tsx
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useSubmitAssignment } from '../../hooks/useAssignments';
// import Layout from '../../component/layout';
// // import { useSubmitAssignment } from '../hooks/useAssignments';

// const submissionSchema = z.object({
//   file: z.instanceof(File, { message: 'File is required' }),
// });

// type SubmissionFormData = z.infer<typeof submissionSchema>;

// interface Props {
//   assignmentId: number;
//   onClose: () => void;
//   onSaved: () => void;
// }

// const SubmissionFormModal: React.FC<Props> = ({ assignmentId, onClose, onSaved }) => {
//   const submitMutation = useSubmitAssignment(assignmentId);
//   const {
//     handleSubmit,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<SubmissionFormData>({
//     resolver: zodResolver(submissionSchema),
//   });

//   const [fileName, setFileName] = useState('');

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setValue('file', file);
//       setFileName(file.name);
//     }
//   };

//   const onSubmit = async (data: SubmissionFormData) => {
//     try {
//       await submitMutation.mutateAsync(data);
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
//         <h3 className="text-xl font-semibold mb-4">Submit Assignment</h3>
//         <form onSubmit={handleSubmit(onSubmit)} noValidate>
//           <div className="mb-4">
//             <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
//               Upload File
//             </label>
//             <input
//               id="file"
//               type="file"
//               onChange={handleFileChange}
//               className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
//                 errors.file ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {fileName && <p className="mt-1 text-sm text-gray-600">Selected: {fileName}</p>}
//             {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>}
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
//               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//     </Layout>
//   );
// };

// export default SubmissionFormModal;



// components/SubmissionFormModal.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitAssignment } from '../../hooks/useAssignments';

const submissionSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' }),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface Props {
  assignmentId: number;
  onClose: () => void;
  onSaved: () => void;
}

const SubmissionFormModal: React.FC<Props> = ({ assignmentId, onClose, onSaved }) => {
  const submitMutation = useSubmitAssignment(assignmentId);
  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('file', file);
      setFileName(file.name);
    }
  };

  const onSubmit = async (data: SubmissionFormData) => {
    try {
      await submitMutation.mutateAsync(data);
      onSaved();
      onClose();
    } catch (error) {
      // error toast handled by mutation
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold mb-4">Submit Assignment</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Upload File
            </label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.file ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {fileName && <p className="mt-1 text-sm text-gray-600">Selected: {fileName}</p>}
            {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>}
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
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionFormModal;