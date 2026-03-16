import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../../api/users';
import toast from 'react-hot-toast';
import type { AnyUser } from '../../types/user';
import Layout from '../../component/layout';
import { UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const AssignParent: React.FC = () => {
  const [students, setStudents] = useState<AnyUser[]>([]);
  const [parents, setParents] = useState<AnyUser[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedParent, setSelectedParent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, parentsRes] = await Promise.all([
          userApi.getByRole('STUDENT', 0, 100),
          userApi.getByRole('PARENT', 0, 100),
        ]);
        setStudents(studentsRes.data.content);
        setParents(parentsRes.data.content);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedParent) {
      toast.error('Please select both a student and a parent');
      return;
    }
    setSubmitting(true);
    try {
      await userApi.assignParent(parseInt(selectedStudent), parseInt(selectedParent));
      toast.success('Parent assigned successfully');
      navigate('/admin/users');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Assignment failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header with icon */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <UserGroupIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Assign Parent to Student</h1>
        </div>

        <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Parent‑Student Relationship</h2>
            <p className="text-sm text-gray-500">Select a student and a parent to link them.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Student select */}
            <div>
              <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">
                Student <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="student"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">-- Choose a student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Parent select */}
            <div>
              <label htmlFor="parent" className="block text-sm font-medium text-gray-700 mb-1">
                Parent <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="parent"
                  value={selectedParent}
                  onChange={(e) => setSelectedParent(e.target.value)}
                  required
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">-- Choose a parent --</option>
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || loading}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Assigning...
                  </span>
                ) : (
                  'Assign Parent'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AssignParent;