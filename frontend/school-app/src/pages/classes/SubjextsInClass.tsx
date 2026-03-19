import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { classService } from '../../api/class';
import type { ClassSubjectResponse } from '../../types/class';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import AssignTeacherModals from './AssignTeacherModal';

interface Props {
  classId: number;
}

const SubjectInClass: React.FC<Props> = ({ classId }) => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<ClassSubjectResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<ClassSubjectResponse | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadSubjects();
  }, [classId, page]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await classService.getSubjects(classId, page, 10);
      setSubjects(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to load subjects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (teacherId: number) => {
    if (!selectedSubject) return;
    try {
      await classService.assignTeacher(classId, selectedSubject.subject.id, teacherId);
      setShowAssignModal(false);
      loadSubjects(); // refresh list
    } catch (error) {
      alert('Failed to assign teacher');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">Loading subjects...</p>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">No subjects assigned to this class.</p>
        {isAdmin && (
          <p className="text-sm text-gray-500 mt-1">
            Click the "Assign Subjects" button above to add subjects.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              {isAdmin && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjects.map((cs) => (
              <tr key={cs.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {cs.subject.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{cs.subject.code}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {cs.teacher ? (
                    `${cs.teacher.firstName} ${cs.teacher.lastName}`
                  ) : (
                    <span className="text-gray-400 italic">Not assigned</span>
                  )}
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setSelectedSubject(cs);
                        setShowAssignModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      {cs.teacher ? 'Change Teacher' : 'Assign Teacher'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      {/* {showAssignModal && selectedSubject && (
        <AssignTeacherModal
          subject={selectedSubject.subject}
          onAssign={handleAssign}
          onClose={() => setShowAssignModal(false)}
        />
      )} */}
    
      {showAssignModal && selectedSubject && (
        <AssignTeacherModals
          subject={selectedSubject.subject}
          currentTeacherId={selectedSubject.teacher?.id}
          onAssign={handleAssign}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </div>
  );
};

export default SubjectInClass;