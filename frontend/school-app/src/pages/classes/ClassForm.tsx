import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { classService } from '../../api/class';
import { userApi } from '../../api/users';
import type { ClassCreateRequest, ClassUpdateRequest } from '../../types/class';
import type { AnyUser } from '../../types/user';
import Layout from '../../component/layout';
import { AcademicCapIcon, CalendarIcon, IdentificationIcon } from '@heroicons/react/24/outline';

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

const ClassForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<AnyUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTeachers, setFetchingTeachers] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<ClassCreateRequest | null>(null);

  // Combobox state
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [filteredTeachers, setFilteredTeachers] = useState<AnyUser[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClassCreateRequest>();

  const { ref: teacherIdRef, ...teacherIdRegister } = register('classTeacherId');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await userApi.getByRole('TEACHER', 0, 100);
        const teacherData = Array.isArray(res.data) ? res.data : res.data.content || [];
        setTeachers(teacherData);
      } catch (error) {
        console.error('Failed to load teachers', error);
      } finally {
        setFetchingTeachers(false);
      }
    };
    fetchTeachers();

    if (id) {
      loadClass();
    }
  }, [id]);

  const loadClass = async () => {
    try {
      setLoading(true);
      const res = await classService.getById(parseInt(id!));
      setValue('name', res.data.name);
      setValue('academicYear', res.data.academicYear);
      const teacherId = res.data.classTeacher?.id;
      setValue('classTeacherId', teacherId);
    } catch (error) {
      console.error('Failed to load class', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teachers.length > 0 && id) {
      const currentTeacherId = (document.querySelector('input[name="classTeacherId"]') as HTMLInputElement)?.value;
      if (currentTeacherId) {
        const teacher = teachers.find(t => t.id === parseInt(currentTeacherId));
        if (teacher) {
          setTeacherSearch(`${teacher.firstName} ${teacher.lastName} (${teacher.email})`);
        }
      }
    }
  }, [teachers, id]);

  useEffect(() => {
    if (teacherSearch.trim() === '') {
      setFilteredTeachers(teachers);
    } else {
      const lower = teacherSearch.toLowerCase();
      setFilteredTeachers(
        teachers.filter(
          t =>
            t.firstName.toLowerCase().includes(lower) ||
            t.lastName.toLowerCase().includes(lower) ||
            t.email.toLowerCase().includes(lower)
        )
      );
    }
  }, [teacherSearch, teachers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setTeacherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTeacher = (teacher: AnyUser) => {
    const display = `${teacher.firstName} ${teacher.lastName} (${teacher.email})`;
    setTeacherSearch(display);
    setValue('classTeacherId', teacher.id);
    setTeacherOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeacherSearch(e.target.value);
    setTeacherOpen(true);
    const currentTeacherId = (document.querySelector('input[name="classTeacherId"]') as HTMLInputElement)?.value;
    if (currentTeacherId) {
      const currentTeacher = teachers.find(t => t.id === parseInt(currentTeacherId));
      if (currentTeacher) {
        const currentDisplay = `${currentTeacher.firstName} ${currentTeacher.lastName} (${currentTeacher.email})`;
        if (e.target.value !== currentDisplay) {
          setValue('classTeacherId', undefined);
        }
      }
    }
  };

  // This function is called by handleSubmit (react-hook-form) with validated data
  const onValidSubmit = (data: ClassCreateRequest) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    if (!formData) return;
    setShowConfirmModal(false);
    try {
      if (id) {
        await classService.update(parseInt(id), formData as ClassUpdateRequest);
      } else {
        await classService.create(formData);
      }
      navigate('/classes');
    } catch (error) {
      alert('Error saving class');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 max-w-2xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Edit Class' : 'Create New Class'}
          </h1>
        </div>

        <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">
              {id ? 'Update class information' : 'Enter class details'}
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6">
              {/* Class Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    {...register('name', { required: 'Class name is required' })}
                    className={`mt-1 block w-full pl-10 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="e.g., Grade 10A"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              {/* Academic Year */}
              <div>
                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="academicYear"
                    {...register('academicYear', { required: 'Academic year is required' })}
                    className={`mt-1 block w-full pl-10 border ${errors.academicYear ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="e.g., 2024-2025"
                  />
                </div>
                {errors.academicYear && <p className="mt-1 text-sm text-red-600">{errors.academicYear.message}</p>}
              </div>

              {/* Class Teacher (combobox) */}
              <div>
                <label htmlFor="teacherSearch" className="block text-sm font-medium text-gray-700 mb-1">
                  Class Teacher (optional)
                </label>
                <div className="relative" ref={containerRef}>
                  <input
                    type="text"
                    id="teacherSearch"
                    value={teacherSearch}
                    onChange={handleSearchChange}
                    onFocus={() => setTeacherOpen(true)}
                    placeholder="Search teacher..."
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={fetchingTeachers}
                  />
                  <input
                    type="hidden"
                    {...teacherIdRegister}
                    ref={teacherIdRef}
                  />
                  {teacherOpen && filteredTeachers.length > 0 && (
                    <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {filteredTeachers.map(teacher => (
                        <li
                          key={teacher.id}
                          onClick={() => handleSelectTeacher(teacher)}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                        >
                          {teacher.firstName} {teacher.lastName} ({teacher.email})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {fetchingTeachers && <p className="mt-1 text-sm text-gray-500">Loading teachers...</p>}
                {teachers.length === 0 && !fetchingTeachers && (
                  <p className="mt-1 text-sm text-red-600">No teachers available. Please add teachers first.</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/classes')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    id ? 'Update Class' : 'Create Class'
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
        title={id ? 'Update Class' : 'Create Class'}
        message={`Are you sure you want to ${id ? 'update' : 'create'} this class?`}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirmModal(false)}
      />
    </Layout>
  );
};

export default ClassForm;