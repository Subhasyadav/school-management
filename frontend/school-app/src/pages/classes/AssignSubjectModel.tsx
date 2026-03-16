import React, { useEffect, useState, useRef } from 'react';
import { userApi } from '../../api/users';
import { classService } from '../../api/class';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { AnyUser } from '../../types/user';
import type { SubjectResponse } from '../../types/class';
import subjectService from '../../api/subject';

interface Props {
  classId: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface AssignmentRow {
  subjectId: number | '';
  subjectSearch: string;
  teacherId: number | '';
  teacherSearch: string;
}

// Generic Combobox component
interface ComboboxProps<T> {
  items: T[];
  value: number | '';
  search: string;
  onChange: (id: number | '', search: string) => void;
  getDisplayLabel: (item: T) => string;
  getSearchableText: (item: T) => string;
  placeholder: string;
  disabled?: boolean;
}

function Combobox<T extends { id: number }>({
  items,
  value,
  search,
  onChange,
  getDisplayLabel,
  getSearchableText,
  placeholder,
  disabled,
}: ComboboxProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredItems(items);
    } else {
      const lower = search.toLowerCase();
      setFilteredItems(
        items.filter(item => getSearchableText(item).toLowerCase().includes(lower))
      );
    }
  }, [search, items, getSearchableText]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedItem = items.find(item => item.id === value);

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={search}
        onChange={(e) => {
          onChange(value, e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
        disabled={disabled}
      />
      {isOpen && filteredItems.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {filteredItems.map(item => (
            <li
              key={item.id}
              onClick={() => {
                onChange(item.id, getDisplayLabel(item));
                setIsOpen(false);
              }}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
            >
              {getDisplayLabel(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const AssignSubjectModal: React.FC<Props> = ({ classId, onClose, onSuccess }) => {
  const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
  const [teachers, setTeachers] = useState<AnyUser[]>([]);
  const [rows, setRows] = useState<AssignmentRow[]>([
    { subjectId: '', subjectSearch: '', teacherId: '', teacherSearch: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [subjectsRes, teachersRes] = await Promise.all([
          subjectService.getAllSubjects(0, 100),
          userApi.getByRole('TEACHER', 0, 100),
        ]);

        setSubjects(
          Array.isArray(subjectsRes.data)
            ? subjectsRes.data
            : subjectsRes.data.content || []
        );
        setTeachers(
          Array.isArray(teachersRes.data)
            ? teachersRes.data
            : teachersRes.data.content || []
        );
      } catch (error) {
        console.error('Failed to load data', error);
        setError('Failed to load subjects or teachers. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRowChange = (
    index: number,
    field: 'subjectId' | 'subjectSearch' | 'teacherId' | 'teacherSearch',
    value: number | '' | string
  ) => {
    const updated = [...rows];
    if (field === 'subjectId') {
      updated[index].subjectId = value as number | '';
    } else if (field === 'subjectSearch') {
      updated[index].subjectSearch = value as string;
    } else if (field === 'teacherId') {
      updated[index].teacherId = value as number | '';
    } else if (field === 'teacherSearch') {
      updated[index].teacherSearch = value as string;
    }
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { subjectId: '', subjectSearch: '', teacherId: '', teacherSearch: '' }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invalid = rows.some(row => row.subjectId === '' || row.teacherId === '');
    if (invalid) {
      setError('Please select both a subject and a teacher for each row.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await Promise.all(
        rows.map(row =>
          classService.assignTeacher(classId, row.subjectId as number, row.teacherId as number)
        )
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Assignment failed', error);
      setError('Failed to assign subjects. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Assign Subjects to Class</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        ) : error && !submitting ? (
          <div className="p-6 text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            {teachers.length === 0 && (
              <p className="text-sm text-red-600 mb-4">No teachers available. Please add teachers first.</p>
            )}
            {subjects.length === 0 && (
              <p className="text-sm text-red-600 mb-4">No subjects available. Please add subjects first.</p>
            )}

            <div className="space-y-4">
              {rows.map((row, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {/* Subject combobox */}
                  <div className="flex-1">
                    <Combobox<SubjectResponse>
                      items={subjects}
                      value={row.subjectId}
                      search={row.subjectSearch}
                      onChange={(id, search) => {
                        handleRowChange(index, 'subjectId', id);
                        handleRowChange(index, 'subjectSearch', search);
                      }}
                      getDisplayLabel={(subject) => `${subject.name} (${subject.code})`}
                      getSearchableText={(subject) => `${subject.name} ${subject.code}`}
                      placeholder="Search subject..."
                      disabled={subjects.length === 0}
                    />
                  </div>

                  {/* Teacher combobox */}
                  <div className="flex-1">
                    <Combobox<AnyUser>
                      items={teachers}
                      value={row.teacherId}
                      search={row.teacherSearch}
                      onChange={(id, search) => {
                        handleRowChange(index, 'teacherId', id);
                        handleRowChange(index, 'teacherSearch', search);
                      }}
                      getDisplayLabel={(teacher) => `${teacher.firstName} ${teacher.lastName} (${teacher.email})`}
                      getSearchableText={(teacher) => `${teacher.firstName} ${teacher.lastName} ${teacher.email}`}
                      placeholder="Search teacher..."
                      disabled={teachers.length === 0}
                    />
                  </div>

                  {/* Remove row button */}
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRow}
              className="mt-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Another Subject
            </button>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  submitting ||
                  teachers.length === 0 ||
                  subjects.length === 0 ||
                  rows.some(row => row.subjectId === '' || row.teacherId === '')
                }
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
                  'Assign Subjects'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssignSubjectModal;