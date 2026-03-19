import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userApi } from '../../api/users';
import { classService } from '../../api/class';
import type { AnyUser } from '../../types/user';
import Layout from '../../component/layout';
import { UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline';

// Confirmation Modal Component
const ConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const EnrollStudent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<AnyUser[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await userApi.getByRole('STUDENT', 0, 100);
        setStudents(res.data.content);
      } catch (error) {
        console.error('Failed to load students', error);
      } finally {
        setFetching(false);
      }
    };
    fetchStudents();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    const student = students.find(s => s.id === selectedStudentId);
    if (student) {
      setSelectedStudentName(`${student.firstName} ${student.lastName}`);
    }
    setShowConfirmModal(true);
  };

  const handleConfirmEnroll = async () => {
    if (!selectedStudentId) return;
    setShowConfirmModal(false);
    setLoading(true);
    try {
      await classService.enrollStudent(parseInt(id!), Number(selectedStudentId));
      navigate(`/classes/${id}`);
    } catch (error) {
      alert('Failed to enroll student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <UserGroupIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Enroll Student</h1>
        </div>

        <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Select a student to enroll</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">
                  Student <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserPlusIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="student"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : '')}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={fetching}
                  >
                    <option value="">-- Choose a student --</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} ({student.email})
                      </option>
                    ))}
                  </select>
                </div>
                {fetching && <p className="mt-1 text-sm text-gray-500">Loading students...</p>}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(`/classes/${id}`)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || fetching || !selectedStudentId}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Enrolling...
                    </span>
                  ) : (
                    'Enroll Student'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirm Enrollment"
        message={`Are you sure you want to enroll ${selectedStudentName} in this class?`}
        onConfirm={handleConfirmEnroll}
        onCancel={() => setShowConfirmModal(false)}
      />
    </Layout>
  );
};

export default EnrollStudent;