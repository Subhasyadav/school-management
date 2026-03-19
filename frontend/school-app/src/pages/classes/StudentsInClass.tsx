import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { classService } from '../../api/class';
import type { StudentResponse } from '../../types/class';
import { TrashIcon, UserIcon } from '@heroicons/react/24/outline';

interface Props {
  classId: number;
}

const StudentsInClass: React.FC<Props> = ({ classId }) => {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    loadStudents();
  }, [classId, page]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await classService.getStudents(classId, page, 10);
      setStudents(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Failed to load students', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (studentId: number) => {
    if (!window.confirm('Remove this student from the class?')) return;
    try {
      await classService.removeStudent(classId, studentId);
      if (students.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        loadStudents();
      }
    } catch (error) {
      alert('Failed to remove student');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">Loading students...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-8">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">No students enrolled.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              {isAdmin && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.firstName} {student.lastName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                {isAdmin && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleRemove(student.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Remove"
                    >
                      <TrashIcon className="h-5 w-5" />
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
    </div>
  );
};

export default StudentsInClass;